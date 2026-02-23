import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API (different base URL - no /api prefix)
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    delete authApi.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Auth functions
export const auth = {
  getLoginUrl: () => `${API_BASE_URL}/auth/login`,
  getMe: () => authApi.get('/me'),
  logout: () => {
    setAuthToken(null);
    localStorage.removeItem('user');
    return authApi.post('/logout');
  },
  setToken: setAuthToken,
  getUsers: () => authApi.get('/users'),
  updateUserRole: (userId, role) => authApi.put(`/users/${userId}/role`, { role })
};

// Employee API
export const employeeApi = {
  getAll: (params = {}) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getManagers: (excludeId) => api.get('/employees/managers', { params: { exclude: excludeId } }),
  getAddresses: (id) => api.get(`/employees/${id}/addresses`),
  addAddress: (id, data) => api.post(`/employees/${id}/addresses`, data)
};

// Address API
export const addressApi = {
  getById: (id) => api.get(`/addresses/${id}`),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`)
};

// Analytics API
export const analyticsApi = {
  getSummary: () => api.get('/analytics/summary'),
  getByDepartment: () => api.get('/analytics/department'),
  getByStatus: () => api.get('/analytics/status'),
  getByType: () => api.get('/analytics/type'),
  getByLocation: () => api.get('/analytics/location'),
  getByTenure: () => api.get('/analytics/tenure'),
  getDepartments: () => api.get('/analytics/departments/list')
};

// Leave API
export const leaveApi = {
  // Leave Types
  getTypes: () => api.get('/leaves/types'),
  
  // Leave Balances
  getMyBalance: (year) => api.get('/leaves/balance', { params: { year } }),
  getUserBalance: (userId, year) => api.get(`/leaves/balance/${userId}`, { params: { year } }),
  
  // Leave Requests (User)
  createRequest: (data) => api.post('/leaves/request', data),
  getMyRequests: (params = {}) => api.get('/leaves/requests', { params }),
  getRequest: (id) => api.get(`/leaves/requests/${id}`),
  cancelRequest: (id) => api.put(`/leaves/requests/${id}/cancel`),
  
  // Leave Requests (Admin)
  getAllRequests: (params = {}) => api.get('/leaves/admin/requests', { params }),
  approveRequest: (id) => api.put(`/leaves/admin/requests/${id}/approve`),
  rejectRequest: (id, reason) => api.put(`/leaves/admin/requests/${id}/reject`, { reason }),
  
  // Reports (Admin)
  getReport: (params = {}) => api.get('/leaves/reports', { params }),
  getStats: (year) => api.get('/leaves/reports/stats', { params: { year } }),
  exportReport: (params = {}) => api.get('/leaves/reports/export', { params, responseType: 'blob' })
};

export default api;