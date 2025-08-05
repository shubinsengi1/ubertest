# UberClone - Complete Ride-Sharing Application

A full-stack ride-sharing application built with React, Node.js, Express, and MongoDB. Features user authentication, real-time ride tracking, driver management, and an admin dashboard.

## Features

### 🚗 For Users
- **Ride Booking**: Request rides with pickup and destination locations
- **Real-time Tracking**: Track driver location and ride progress
- **Multiple Vehicle Types**: Choose from Economy, Comfort, Premium, and SUV
- **Ride History**: View past rides and receipts
- **Rating System**: Rate drivers and rides
- **Payment Integration**: Multiple payment methods

### 🚕 For Drivers
- **Driver Dashboard**: Track earnings, rides, and performance
- **Online/Offline Toggle**: Control availability status
- **Ride Management**: Accept, start, and complete rides
- **Earnings Tracking**: View daily, weekly, and monthly earnings
- **Real-time Notifications**: Get notified of new ride requests

### 👨‍💼 For Admins
- **Admin Dashboard**: Comprehensive system overview
- **User Management**: Manage users and drivers
- **Ride Analytics**: View ride statistics and analytics
- **Revenue Tracking**: Monitor platform revenue
- **System Controls**: Activate/deactivate accounts

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Real-time**: Socket.io Client

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uber-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/uber_clone
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   
   # Optional: Configure these for full functionality
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or if using MongoDB service
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start them separately
   npm run server  # Backend on http://localhost:5000
   npm run client  # Frontend on http://localhost:3000
   ```

## Demo Accounts

Once the application is running, you can use these demo accounts:

- **User**: `user@demo.com` / `password`
- **Driver**: `driver@demo.com` / `password`
- **Admin**: `admin@demo.com` / `password`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Rides
- `POST /api/rides/request` - Request a ride
- `GET /api/rides/available` - Get available rides (drivers)
- `PUT /api/rides/:id/accept` - Accept a ride
- `PUT /api/rides/:id/status` - Update ride status
- `GET /api/rides/history` - Get ride history

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/rides` - View all rides
- `GET /api/admin/analytics` - System analytics

## Project Structure

```
uber-clone/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication & validation
│   ├── server.js        # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── utils/       # API utilities
│   │   └── App.js       # Main app component
│   └── package.json
└── README.md
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Starts development server with hot reload
```

### Building for Production
```bash
npm run build  # Builds frontend for production
npm start      # Starts production server
```

## Real-time Features

The application uses Socket.io for real-time functionality:

- **Live Driver Tracking**: Users can see driver location in real-time
- **Ride Status Updates**: Instant notifications for ride status changes
- **Driver Notifications**: Real-time ride requests for drivers
- **Admin Monitoring**: Live system monitoring and analytics

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Express validator for request validation
- **Rate Limiting**: Protection against API abuse
- **CORS Protection**: Controlled cross-origin requests
- **Helmet**: Security headers for Express

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@uberclone.com or create an issue in the repository.

---

**Note**: This is a demonstration application. For production use, ensure proper security measures, payment gateway integration, and compliance with local transportation regulations.