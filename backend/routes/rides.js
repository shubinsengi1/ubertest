const express = require('express');
const { body, validationResult } = require('express-validator');
const Ride = require('../models/Ride');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Request a ride
// @route   POST /api/rides/request
// @access  Private (Users only)
router.post('/request', protect, authorize('user'), [
  body('pickupLocation.address').notEmpty().withMessage('Pickup address is required'),
  body('pickupLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Pickup coordinates must be an array of [lng, lat]'),
  body('destination.address').notEmpty().withMessage('Destination address is required'),
  body('destination.coordinates').isArray({ min: 2, max: 2 }).withMessage('Destination coordinates must be an array of [lng, lat]'),
  body('rideType').optional().isIn(['economy', 'comfort', 'premium', 'suv']).withMessage('Invalid ride type')
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

    const { pickupLocation, destination, rideType, specialRequests } = req.body;

    // Calculate distance and fare (simplified calculation)
    const distance = calculateDistance(
      pickupLocation.coordinates[1], pickupLocation.coordinates[0],
      destination.coordinates[1], destination.coordinates[0]
    );

    const estimatedDuration = Math.round(distance * 2.5); // Rough estimate: 2.5 min per km
    const fare = calculateFare(distance, rideType || 'economy');

    // Create ride
    const ride = await Ride.create({
      rider: req.user.id,
      pickupLocation,
      destination,
      rideType: rideType || 'economy',
      distance,
      estimatedDuration,
      fare,
      specialRequests
    });

    // Emit to available drivers
    const io = req.app.get('io');
    io.emit('new-ride-request', {
      rideId: ride._id,
      pickupLocation,
      destination,
      rideType: rideType || 'economy',
      fare: fare.total,
      distance,
      estimatedDuration
    });

    res.status(201).json({
      success: true,
      message: 'Ride requested successfully',
      data: { ride }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get available rides for drivers
// @route   GET /api/rides/available
// @access  Private (Drivers only)
router.get('/available', protect, authorize('driver'), async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    let query = { status: 'requested' };

    // If location provided, find rides within radius
    if (lat && lng) {
      query['pickupLocation.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const rides = await Ride.find(query)
      .populate('rider', 'firstName lastName phone rating')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: rides.length,
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

// @desc    Accept a ride
// @route   PUT /api/rides/:id/accept
// @access  Private (Drivers only)
router.put('/:id/accept', protect, authorize('driver'), async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('rider', 'firstName lastName phone');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: 'Ride is no longer available'
      });
    }

    // Update ride
    ride.driver = req.user.id;
    ride.status = 'accepted';
    ride.timeline.acceptedAt = new Date();
    await ride.save();

    // Update driver earnings
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { ridesAsDriver: ride._id }
    });

    // Update rider rides
    await User.findByIdAndUpdate(ride.rider._id, {
      $addToSet: { ridesAsUser: ride._id }
    });

    // Emit to rider
    const io = req.app.get('io');
    io.to(ride.rider._id.toString()).emit('ride-accepted', {
      rideId: ride._id,
      driver: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
        rating: req.user.rating,
        vehicleInfo: req.user.vehicleInfo
      },
      estimatedArrival: new Date(Date.now() + ride.estimatedDuration * 60000)
    });

    res.json({
      success: true,
      message: 'Ride accepted successfully',
      data: { ride }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update ride status
// @route   PUT /api/rides/:id/status
// @access  Private (Drivers only)
router.put('/:id/status', protect, authorize('driver'), [
  body('status').isIn(['driver_on_way', 'arrived', 'in_progress', 'completed']).withMessage('Invalid status')
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

    const { status } = req.body;
    const ride = await Ride.findById(req.params.id).populate('rider', 'firstName lastName phone');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this ride'
      });
    }

    // Update ride status and timeline
    ride.status = status;
    switch (status) {
      case 'arrived':
        ride.timeline.driverArrivedAt = new Date();
        break;
      case 'in_progress':
        ride.timeline.startedAt = new Date();
        break;
      case 'completed':
        ride.timeline.completedAt = new Date();
        ride.payment.status = 'completed';
        
        // Update driver earnings
        const driver = await User.findById(req.user.id);
        driver.earnings.total += ride.fare.total;
        driver.earnings.thisWeek += ride.fare.total;
        driver.earnings.thisMonth += ride.fare.total;
        await driver.save();
        break;
    }

    await ride.save();

    // Emit to rider
    const io = req.app.get('io');
    io.to(ride.rider._id.toString()).emit(`ride-${status.replace('_', '-')}`, {
      rideId: ride._id,
      status,
      timeline: ride.timeline
    });

    res.json({
      success: true,
      message: `Ride status updated to ${status}`,
      data: { ride }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cancel a ride
// @route   PUT /api/rides/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    const { reason } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is authorized to cancel
    const isRider = ride.rider.toString() === req.user.id;
    const isDriver = ride.driver && ride.driver.toString() === req.user.id;

    if (!isRider && !isDriver) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this ride'
      });
    }

    if (['completed', 'cancelled'].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed or already cancelled ride'
      });
    }

    // Update ride
    ride.status = 'cancelled';
    ride.timeline.cancelledAt = new Date();
    ride.cancellationReason = reason;
    ride.cancelledBy = req.user.userType;
    await ride.save();

    // Emit cancellation
    const io = req.app.get('io');
    const targetUserId = isRider ? ride.driver : ride.rider;
    if (targetUserId) {
      io.to(targetUserId.toString()).emit('ride-cancelled', {
        rideId: ride._id,
        cancelledBy: req.user.userType,
        reason
      });
    }

    res.json({
      success: true,
      message: 'Ride cancelled successfully',
      data: { ride }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Rate a ride
// @route   PUT /api/rides/:id/rate
// @access  Private
router.put('/:id/rate', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
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

    const { rating, comment } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed rides'
      });
    }

    const isRider = ride.rider.toString() === req.user.id;
    const isDriver = ride.driver && ride.driver.toString() === req.user.id;

    if (!isRider && !isDriver) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this ride'
      });
    }

    // Update rating
    if (isRider) {
      if (ride.rating.riderRating.score) {
        return res.status(400).json({
          success: false,
          message: 'You have already rated this ride'
        });
      }
      ride.rating.riderRating = { score: rating, comment };
      
      // Update driver's overall rating
      const driver = await User.findById(ride.driver);
      const totalRating = (driver.rating.average * driver.rating.count) + rating;
      driver.rating.count += 1;
      driver.rating.average = totalRating / driver.rating.count;
      await driver.save();
    } else {
      if (ride.rating.driverRating.score) {
        return res.status(400).json({
          success: false,
          message: 'You have already rated this ride'
        });
      }
      ride.rating.driverRating = { score: rating, comment };
      
      // Update rider's overall rating
      const rider = await User.findById(ride.rider);
      const totalRating = (rider.rating.average * rider.rating.count) + rating;
      rider.rating.count += 1;
      rider.rating.average = totalRating / rider.rating.count;
      await rider.save();
    }

    await ride.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: { ride }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's ride history
// @route   GET /api/rides/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.user.userType === 'driver') {
      query.driver = req.user.id;
    } else {
      query.rider = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .populate('rider', 'firstName lastName phone rating')
      .populate('driver', 'firstName lastName phone rating vehicleInfo')
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

// Helper functions
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 100) / 100; // Round to 2 decimal places
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function calculateFare(distance, rideType) {
  const baseFares = {
    economy: 2.50,
    comfort: 3.50,
    premium: 5.00,
    suv: 4.00
  };

  const perKmRates = {
    economy: 1.20,
    comfort: 1.50,
    premium: 2.00,
    suv: 1.80
  };

  const baseFare = baseFares[rideType];
  const distanceFare = distance * perKmRates[rideType];
  const total = baseFare + distanceFare;

  return {
    baseFare,
    distanceFare,
    timeFare: 0,
    surgeFare: 0,
    total: Math.round(total * 100) / 100
  };
}

module.exports = router;