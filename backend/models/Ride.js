const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  rideType: {
    type: String,
    enum: ['economy', 'comfort', 'premium', 'suv'],
    default: 'economy'
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'driver_on_way', 'arrived', 'in_progress', 'completed', 'cancelled'],
    default: 'requested'
  },
  distance: {
    type: Number, // in kilometers
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  fare: {
    baseFare: {
      type: Number,
      required: true
    },
    distanceFare: {
      type: Number,
      required: true
    },
    timeFare: {
      type: Number,
      default: 0
    },
    surgeFare: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'paypal'],
      default: 'card'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String
  },
  timeline: {
    requestedAt: {
      type: Date,
      default: Date.now
    },
    acceptedAt: Date,
    driverArrivedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date
  },
  rating: {
    riderRating: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String
    },
    driverRating: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String
    }
  },
  route: [{
    coordinates: [Number],
    timestamp: Date
  }],
  estimatedArrivalTime: Date,
  actualArrivalTime: Date,
  specialRequests: {
    type: String,
    maxlength: 500
  },
  cancellationReason: {
    type: String,
    maxlength: 500
  },
  cancelledBy: {
    type: String,
    enum: ['rider', 'driver', 'admin']
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
rideSchema.index({ rider: 1, createdAt: -1 });
rideSchema.index({ driver: 1, createdAt: -1 });
rideSchema.index({ status: 1 });
rideSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
rideSchema.index({ 'destination.coordinates': '2dsphere' });

module.exports = mongoose.model('Ride', rideSchema);