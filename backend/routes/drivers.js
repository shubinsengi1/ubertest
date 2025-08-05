const express = require('express');
const User = require('../models/User');
const Ride = require('../models/Ride');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get driver dashboard data
// @route   GET /api/drivers/dashboard
// @access  Private (Drivers only)
router.get('/dashboard', protect, authorize('driver'), async (req, res) => {
  try {
    const driverId = req.user.id;

    // Get today's rides
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRides = await Ride.find({
      driver: driverId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).populate('rider', 'firstName lastName rating');

    // Get this week's earnings
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyRides = await Ride.find({
      driver: driverId,
      status: 'completed',
      createdAt: { $gte: weekStart }
    });

    const weeklyEarnings = weeklyRides.reduce((total, ride) => total + ride.fare.total, 0);

    // Get driver stats
    const totalRides = await Ride.countDocuments({ driver: driverId, status: 'completed' });
    const totalEarnings = await Ride.aggregate([
      { $match: { driver: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$fare.total' } } }
    ]);

    const stats = {
      todayRides: todayRides.length,
      weeklyEarnings: Math.round(weeklyEarnings * 100) / 100,
      totalRides,
      totalEarnings: totalEarnings.length > 0 ? Math.round(totalEarnings[0].total * 100) / 100 : 0,
      rating: req.user.rating.average,
      isOnline: req.user.isOnline
    };

    res.json({
      success: true,
      data: {
        stats,
        todayRides
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

// @desc    Get driver earnings breakdown
// @route   GET /api/drivers/earnings
// @access  Private (Drivers only)
router.get('/earnings', protect, authorize('driver'), async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const driverId = req.user.id;

    let startDate = new Date();
    let groupBy = {};

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        groupBy = {
          _id: { $dayOfWeek: '$createdAt' },
          earnings: { $sum: '$fare.total' },
          rides: { $sum: 1 }
        };
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = {
          _id: { $dayOfMonth: '$createdAt' },
          earnings: { $sum: '$fare.total' },
          rides: { $sum: 1 }
        };
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = {
          _id: { $month: '$createdAt' },
          earnings: { $sum: '$fare.total' },
          rides: { $sum: 1 }
        };
        break;
    }

    const earnings = await Ride.aggregate([
      {
        $match: {
          driver: req.user._id,
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      { $group: groupBy },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      data: { earnings }
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