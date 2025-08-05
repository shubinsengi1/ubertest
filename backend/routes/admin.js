const express = require('express');
const User = require('../models/User');
const Ride = require('../models/Ride');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total counts
    const totalUsers = await User.countDocuments({ userType: 'user' });
    const totalDrivers = await User.countDocuments({ userType: 'driver' });
    const onlineDrivers = await User.countDocuments({ userType: 'driver', isOnline: true });
    const totalRides = await Ride.countDocuments();

    // Get today's stats
    const todayRides = await Ride.countDocuments({ createdAt: { $gte: today } });
    const activeRides = await Ride.countDocuments({ 
      status: { $in: ['accepted', 'driver_on_way', 'arrived', 'in_progress'] } 
    });

    // Get revenue stats
    const totalRevenue = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$fare.total' } } }
    ]);

    const todayRevenue = await Ride.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$fare.total' } } }
    ]);

    // Get ride status distribution
    const rideStatusStats = await Ride.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get recent activities
    const recentRides = await Ride.find()
      .populate('rider', 'firstName lastName')
      .populate('driver', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = {
      users: {
        total: totalUsers,
        drivers: totalDrivers,
        onlineDrivers
      },
      rides: {
        total: totalRides,
        today: todayRides,
        active: activeRides
      },
      revenue: {
        total: totalRevenue.length > 0 ? Math.round(totalRevenue[0].total * 100) / 100 : 0,
        today: todayRevenue.length > 0 ? Math.round(todayRevenue[0].total * 100) / 100 : 0
      },
      rideStatusStats
    };

    res.json({
      success: true,
      data: {
        stats,
        recentRides
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, userType, search, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (userType && userType !== 'all') {
      query.userType = userType;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: { users }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all rides with pagination
// @route   GET /api/admin/rides
// @access  Private (Admin only)
router.get('/rides', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, dateFrom, dateTo } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const rides = await Ride.find(query)
      .populate('rider', 'firstName lastName email phone')
      .populate('driver', 'firstName lastName email phone vehicleInfo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ride.countDocuments(query);

    res.json({
      success: true,
      count: rides.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: { rides }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
router.put('/users/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    let startDate = new Date();
    let groupBy = {};

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        groupBy = { $dayOfWeek: '$createdAt' };
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = { $dayOfMonth: '$createdAt' };
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = { $month: '$createdAt' };
        break;
    }

    // Rides analytics
    const ridesAnalytics = await Ride.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupBy,
          totalRides: { $sum: 1 },
          completedRides: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          revenue: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$fare.total', 0] }
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // User registration analytics
    const userAnalytics = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            period: groupBy,
            userType: '$userType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.period': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        rides: ridesAnalytics,
        users: userAnalytics
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;