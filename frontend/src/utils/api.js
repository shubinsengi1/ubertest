import axios from 'axios';

// Set base URL for API calls
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => axios.post('/api/auth/login', credentials),
  register: (userData) => axios.post('/api/auth/register', userData),
  getProfile: () => axios.get('/api/auth/me'),
  updateProfile: (data) => axios.put('/api/auth/profile', data),
  changePassword: (data) => axios.put('/api/auth/change-password', data),
};

// User API
export const userAPI = {
  updateLocation: (coordinates) => axios.put('/api/users/location', { coordinates }),
  toggleOnline: () => axios.put('/api/users/toggle-online'),
  getNearbyDrivers: (lat, lng, radius, rideType) => 
    axios.get(`/api/users/nearby-drivers?lat=${lat}&lng=${lng}&radius=${radius}&rideType=${rideType}`),
};

// Rides API
export const ridesAPI = {
  requestRide: (rideData) => axios.post('/api/rides/request', rideData),
  getAvailableRides: (lat, lng, radius) => 
    axios.get(`/api/rides/available?lat=${lat}&lng=${lng}&radius=${radius}`),
  acceptRide: (rideId) => axios.put(`/api/rides/${rideId}/accept`),
  updateRideStatus: (rideId, status) => axios.put(`/api/rides/${rideId}/status`, { status }),
  cancelRide: (rideId, reason) => axios.put(`/api/rides/${rideId}/cancel`, { reason }),
  rateRide: (rideId, rating, comment) => axios.put(`/api/rides/${rideId}/rate`, { rating, comment }),
  getRideHistory: (page = 1, limit = 10, status) => 
    axios.get(`/api/rides/history?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
};

// Driver API
export const driverAPI = {
  getDashboard: () => axios.get('/api/drivers/dashboard'),
  getEarnings: (period) => axios.get(`/api/drivers/earnings?period=${period}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => axios.get('/api/admin/dashboard'),
  getUsers: (page, limit, userType, search, status) => 
    axios.get(`/api/admin/users?page=${page}&limit=${limit}&userType=${userType}&search=${search}&status=${status}`),
  getRides: (page, limit, status, dateFrom, dateTo) => 
    axios.get(`/api/admin/rides?page=${page}&limit=${limit}&status=${status}&dateFrom=${dateFrom}&dateTo=${dateTo}`),
  toggleUserStatus: (userId) => axios.put(`/api/admin/users/${userId}/toggle-status`),
  getAnalytics: (period) => axios.get(`/api/admin/analytics?period=${period}`),
};

export default axios;