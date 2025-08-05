import React, { useState } from 'react';
import { Car, DollarSign, Clock, Star, User, LogOut, Power, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    todayEarnings: 145.50,
    weeklyEarnings: 823.75,
    totalRides: 156,
    rating: 4.8,
    todayRides: 8
  };

  const recentRides = [
    {
      id: 1,
      rider: 'John S.',
      pickup: 'Downtown',
      destination: 'Airport',
      fare: 25.50,
      status: 'completed',
      time: '10:30 AM'
    },
    {
      id: 2,
      rider: 'Sarah M.',
      pickup: 'Mall',
      destination: 'University',
      fare: 15.75,
      status: 'completed',
      time: '11:45 AM'
    }
  ];

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    // TODO: Implement API call to update online status
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-uber-black" />
              <span className="text-xl font-bold">Driver Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleOnlineStatus}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                  isOnline 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <Power className={`h-4 w-4 ${isOnline ? 'text-green-600' : 'text-gray-600'}`} />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </button>
              
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.todayEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Weekly Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.weeklyEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Rides</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayRides}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Recent Rides */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Rides</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentRides.map((ride) => (
                    <div key={ride.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="font-medium text-gray-900">{ride.rider}</div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ride.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {ride.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {ride.pickup} → {ride.destination}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{ride.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${ride.fare}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Make</span>
                  <span className="font-medium">{user?.vehicleInfo?.make || 'Toyota'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium">{user?.vehicleInfo?.model || 'Camry'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium">{user?.vehicleInfo?.year || '2020'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color</span>
                  <span className="font-medium">{user?.vehicleInfo?.color || 'Black'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License</span>
                  <span className="font-medium">{user?.vehicleInfo?.licensePlate || 'ABC123'}</span>
                </div>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="bg-gradient-to-r from-uber-green to-uber-blue rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Weekly Goal</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>82%</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <p className="text-sm opacity-90">
                $177 more to reach your $1,000 weekly goal
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">View Earnings</div>
                  <div className="text-sm text-gray-600">Check detailed earnings report</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Update Vehicle</div>
                  <div className="text-sm text-gray-600">Modify vehicle information</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Support</div>
                  <div className="text-sm text-gray-600">Get help and support</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;