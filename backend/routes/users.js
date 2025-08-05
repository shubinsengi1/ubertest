const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
router.put('/location', protect, [
  body('coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [lng, lat]')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { coordinates } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'location.coordinates': coordinates
      },
      { new: true }
    );

    // Emit location update if user is a driver
    if (user.userType === 'driver' && user.isOnline) {
      const io = req.app.get('io');
      io.emit('driver-location-update', {
        driverId: user._id,
        location: { coordinates }
      });
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: { location: user.location }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle driver online status
// @route   PUT /api/users/toggle-online
// @access  Private (Drivers only)
router.put('/toggle-online', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can toggle online status'
      });
    }

    const user = await User.findById(req.user.id);
    user.isOnline = !user.isOnline;
    await user.save();

    res.json({
      success: true,
      message: `Driver is now ${user.isOnline ? 'online' : 'offline'}`,
      data: { isOnline: user.isOnline }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get nearby drivers
// @route   GET /api/users/nearby-drivers
// @access  Private
router.get('/nearby-drivers', protect, async (req, res) => {
  try {
    const { lat, lng, radius = 10, rideType = 'economy' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const drivers = await User.find({
      userType: 'driver',
      isOnline: true,
      isActive: true,
      'vehicleInfo.type': rideType,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    }).select('firstName lastName location rating vehicleInfo');

    res.json({
      success: true,
      count: drivers.length,
      data: { drivers }
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