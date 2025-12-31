import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
      
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  getCurrentAdmin: () => api.get('/auth/admin/me')
};

export const complaintAPI = {
  submit: (data) => api.post('/complaints', data),
  getAll: () => api.get('/complaints'),
  getById: (id) => api.get(`/complaints/${id}`)
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllComplaints: (params) => api.get('/admin/complaints', { params }),
  getComplaintById: (id) => api.get(`/admin/complaints/${id}`),
  updateComplaint: (id, data) => api.put(`/admin/complaints/${id}`, data),
  deleteComplaint: (id) => api.delete(`/admin/complaints/${id}`),
  assignComplaint: (id, data) => api.post(`/admin/complaints/${id}/assign`, data),
  respondToComplaint: (id, data) => api.post(`/admin/complaints/${id}/respond`, data),
  getAllUsers: () => api.get('/admin/users')
};

export const analyticsAPI = {
  getOverallStats: () => api.get('/analytics/overall-stats'),
  getCategoryStats: () => api.get('/analytics/category-stats'),
  getDepartmentStats: () => api.get('/analytics/department-stats'),
  getUserStats: () => api.get('/analytics/user-stats'),
  getAssignedUserStats: () => api.get('/analytics/assigned-user-stats'),
  getStatusBreakdown: () => api.get('/analytics/status-breakdown'),
  getMonthlyTrends: (year) => api.get('/analytics/monthly-trends', { params: { year } }),
  getWeeklyTrends: (weeks) => api.get('/analytics/weekly-trends', { params: { weeks } }),
  getFrequentIssues: (limit) => api.get('/analytics/frequent-issues', { params: { limit } }),
  getPriorityStats: () => api.get('/analytics/priority-stats')
};

export default api;

