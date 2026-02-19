import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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

export default api;