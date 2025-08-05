import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Car, 
  DollarSign, 
  Settings, 
  LogOut, 
  User,
  TrendingUp,
  MapPin,
  Calendar,
  Search,
  Filter,
  Eye,
  UserX,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: 15420,
    totalDrivers: 3280,
    onlineDrivers: 1547,
    totalRides: 89453,
    todayRides: 342,
    activeRides: 28,
    totalRevenue: 2847293.50,
    todayRevenue: 8492.75
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'user', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', type: 'driver', status: 'active', joinDate: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', type: 'user', status: 'inactive', joinDate: '2024-01-13' },
  ];

  const recentRides = [
    { id: 1, rider: 'Alice Brown', driver: 'Bob Wilson', pickup: 'Downtown', destination: 'Airport', fare: 25.50, status: 'completed' },
    { id: 2, rider: 'Charlie Davis', driver: 'Diana Moore', pickup: 'Mall', destination: 'University', fare: 15.75, status: 'in_progress' },
    { id: 3, rider: 'Eve Taylor', driver: 'Frank Miller', pickup: 'Hospital', destination: 'Home', fare: 18.25, status: 'completed' },
  ];

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3, path: '/admin' },
    { id: 'users', name: 'Users', icon: Users, path: '/admin/users' },
    { id: 'drivers', name: 'Drivers', icon: Car, path: '/admin/drivers' },
    { id: 'rides', name: 'Rides', icon: MapPin, path: '/admin/rides' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onlineDrivers.toLocaleString()}</p>
              <p className="text-xs text-gray-500">of {stats.totalDrivers.toLocaleString()} total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Rides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayRides}</p>
              <p className="text-xs text-gray-500">{stats.activeRides} active now</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.todayRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">${stats.totalRevenue.toLocaleString()} total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{user.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Rides</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentRides.map((ride) => (
                <div key={ride.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{ride.rider}</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-gray-700">{ride.driver}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {ride.pickup} → {ride.destination}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${ride.fare}</div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ride.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ride.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <button className="bg-uber-black text-white px-4 py-2 rounded-lg hover:bg-uber-dark">
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-uber-black focus:border-uber-black"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-uber-black focus:border-uber-black"
            >
              <option value="all">All Users</option>
              <option value="user">Riders</option>
              <option value="driver">Drivers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.type === 'driver' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <UserCheck className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') {
      return <OverviewTab />;
    } else if (path === '/admin/users') {
      return <UsersTab />;
    } else {
      return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-uber-black" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-uber-black text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">{user?.firstName}</span>
            </div>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {sidebarItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;