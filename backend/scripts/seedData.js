const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Ride = require('../models/Ride');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uber_clone');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Ride.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const demoUsers = [
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'user@demo.com',
        phone: '+1234567890',
        password: 'password',
        userType: 'user',
        isVerified: true,
        isActive: true,
        rating: { average: 4.8, count: 25 }
      },
      {
        firstName: 'Demo',
        lastName: 'Driver',
        email: 'driver@demo.com',
        phone: '+1234567891',
        password: 'password',
        userType: 'driver',
        isVerified: true,
        isActive: true,
        vehicleInfo: {
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          color: 'Black',
          licensePlate: 'ABC123',
          type: 'economy'
        },
        rating: { average: 4.9, count: 156 },
        earnings: {
          total: 15420.75,
          thisWeek: 823.50,
          thisMonth: 3247.25
        },
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128] // NYC coordinates
        }
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@demo.com',
        phone: '+1234567892',
        password: 'password',
        userType: 'admin',
        isVerified: true,
        isActive: true
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@demo.com',
        phone: '+1234567893',
        password: 'password',
        userType: 'driver',
        isVerified: true,
        isActive: true,
        vehicleInfo: {
          make: 'Honda',
          model: 'Accord',
          year: 2021,
          color: 'White',
          licensePlate: 'XYZ789',
          type: 'comfort'
        },
        rating: { average: 4.7, count: 89 },
        earnings: {
          total: 8945.30,
          thisWeek: 567.80,
          thisMonth: 2134.50
        },
        location: {
          type: 'Point',
          coordinates: [-74.005, 40.7142]
        }
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@demo.com',
        phone: '+1234567894',
        password: 'password',
        userType: 'user',
        isVerified: true,
        isActive: true,
        rating: { average: 4.6, count: 42 }
      }
    ];

    // Hash passwords and create users
    for (const userData of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const createdUsers = await User.insertMany(demoUsers);
    console.log(`Created ${createdUsers.length} demo users`);

    // Create demo rides
    const user = createdUsers.find(u => u.userType === 'user');
    const driver = createdUsers.find(u => u.userType === 'driver');

    const demoRides = [
      {
        rider: user._id,
        driver: driver._id,
        pickupLocation: {
          address: 'Times Square, New York, NY',
          coordinates: [-73.9857, 40.7589]
        },
        destination: {
          address: 'Central Park, New York, NY',
          coordinates: [-73.9654, 40.7829]
        },
        rideType: 'economy',
        status: 'completed',
        distance: 2.3,
        estimatedDuration: 8,
        fare: {
          baseFare: 2.50,
          distanceFare: 2.76,
          timeFare: 0,
          surgeFare: 0,
          total: 5.26
        },
        payment: {
          method: 'card',
          status: 'completed',
          transactionId: 'txn_demo_001'
        },
        timeline: {
          requestedAt: new Date(Date.now() - 86400000), // 1 day ago
          acceptedAt: new Date(Date.now() - 86400000 + 120000), // 2 min later
          startedAt: new Date(Date.now() - 86400000 + 420000), // 7 min later
          completedAt: new Date(Date.now() - 86400000 + 900000) // 15 min later
        },
        rating: {
          riderRating: { score: 5, comment: 'Great ride!' },
          driverRating: { score: 5, comment: 'Excellent passenger' }
        }
      },
      {
        rider: user._id,
        pickupLocation: {
          address: 'Brooklyn Bridge, New York, NY',
          coordinates: [-73.9969, 40.7061]
        },
        destination: {
          address: 'Manhattan Bridge, New York, NY',
          coordinates: [-73.9904, 40.7092]
        },
        rideType: 'economy',
        status: 'requested',
        distance: 1.2,
        estimatedDuration: 5,
        fare: {
          baseFare: 2.50,
          distanceFare: 1.44,
          timeFare: 0,
          surgeFare: 0,
          total: 3.94
        },
        payment: {
          method: 'card',
          status: 'pending'
        },
        timeline: {
          requestedAt: new Date(Date.now() - 300000) // 5 min ago
        }
      }
    ];

    const createdRides = await Ride.insertMany(demoRides);
    console.log(`Created ${createdRides.length} demo rides`);

    console.log('\n--- Demo Account Credentials ---');
    console.log('User: user@demo.com / password');
    console.log('Driver: driver@demo.com / password');
    console.log('Admin: admin@demo.com / password');
    console.log('-------------------------------\n');

    console.log('Demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeding
seedData();