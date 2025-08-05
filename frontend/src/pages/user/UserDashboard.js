import React, { useState } from 'react';
import { MapPin, Car, Clock, Star, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('book');
  const [rideForm, setRideForm] = useState({
    pickup: '',
    destination: '',
    rideType: 'economy'
  });

  const handleRideFormChange = (e) => {
    const { name, value } = e.target;
    setRideForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookRide = (e) => {
    e.preventDefault();
    // TODO: Implement ride booking
    console.log('Booking ride:', rideForm);
  };

  const rideTypes = [
    { id: 'economy', name: 'UberX', price: '$8.50', time: '2 min away', icon: Car },
    { id: 'comfort', name: 'Comfort', price: '$12.30', time: '3 min away', icon: Car },
    { id: 'premium', name: 'Black', price: '$18.90', time: '5 min away', icon: Car },
    { id: 'suv', name: 'XL', price: '$15.60', time: '4 min away', icon: Car },
  ];

  const recentRides = [
    {
      id: 1,
      pickup: 'Times Square, NYC',
      destination: 'Central Park, NYC',
      date: '2024-01-15',
      fare: '$12.50',
      driver: 'John D.',
      rating: 5
    },
    {
      id: 2,
      pickup: 'Brooklyn Bridge',
      destination: 'Manhattan Bridge',
      date: '2024-01-14',
      fare: '$8.75',
      driver: 'Sarah M.',
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-uber-black" />
              <span className="text-xl font-bold">UberClone</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Good morning, {user?.firstName}!
              </h1>
              <p className="text-gray-600">Where would you like to go today?</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('book')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'book'
                        ? 'border-uber-black text-uber-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Book a Ride
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'history'
                        ? 'border-uber-black text-uber-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Ride History
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'book' && (
                  <div>
                    {/* Ride Booking Form */}
                    <form onSubmit={handleBookRide} className="space-y-4 mb-6">
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <MapPin className="h-5 w-5 text-uber-green" />
                          </div>
                          <input
                            type="text"
                            name="pickup"
                            value={rideForm.pickup}
                            onChange={handleRideFormChange}
                            placeholder="Pickup location"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-uber-black focus:border-uber-black"
                          />
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <MapPin className="h-5 w-5 text-uber-orange" />
                          </div>
                          <input
                            type="text"
                            name="destination"
                            value={rideForm.destination}
                            onChange={handleRideFormChange}
                            placeholder="Where to?"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-uber-black focus:border-uber-black"
                          />
                        </div>
                      </div>
                    </form>

                    {/* Ride Options */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-900">Choose a ride</h3>
                      {rideTypes.map((ride) => (
                        <div
                          key={ride.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            rideForm.rideType === ride.id
                              ? 'border-uber-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setRideForm(prev => ({ ...prev, rideType: ride.id }))}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <ride.icon className="h-8 w-8 text-gray-600" />
                              <div>
                                <div className="font-medium text-gray-900">{ride.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {ride.time}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{ride.price}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      onClick={handleBookRide}
                      disabled={!rideForm.pickup || !rideForm.destination}
                      className="w-full mt-6 bg-uber-black text-white py-3 px-4 rounded-lg font-medium hover:bg-uber-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Request {rideTypes.find(r => r.id === rideForm.rideType)?.name}
                    </button>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Rides</h3>
                    <div className="space-y-4">
                      {recentRides.map((ride) => (
                        <div key={ride.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="h-4 w-4 text-uber-green" />
                                <span className="text-sm text-gray-600">{ride.pickup}</span>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="h-4 w-4 text-uber-orange" />
                                <span className="text-sm text-gray-600">{ride.destination}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{ride.date}</span>
                                <span>Driver: {ride.driver}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900 mb-1">{ride.fare}</div>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < ride.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rides</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment</h3>
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded"></div>
                <div>
                  <div className="text-sm font-medium">•••• 4242</div>
                  <div className="text-xs text-gray-500">Default payment</div>
                </div>
              </div>
              <button className="w-full mt-3 text-sm text-uber-black hover:text-uber-dark font-medium">
                Manage payment methods
              </button>
            </div>

            {/* Promotions */}
            <div className="bg-gradient-to-r from-uber-green to-uber-blue rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Get 20% off</h3>
              <p className="text-sm opacity-90 mb-3">
                Invite friends and get ride credits when they take their first trip.
              </p>
              <button className="bg-white text-uber-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Invite Friends
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;