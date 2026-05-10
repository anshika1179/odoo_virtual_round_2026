import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Trips
export const getTrips = (params) => API.get('/trips', { params });
export const createTrip = (data) => API.post('/trips', data);
export const getTrip = (id) => API.get(`/trips/${id}`);
export const updateTrip = (id, data) => API.put(`/trips/${id}`, data);
export const deleteTrip = (id) => API.delete(`/trips/${id}`);

// Cities
export const searchCities = (params) => API.get('/cities/search', { params });
export const getPopularCities = () => API.get('/cities/popular');
export const getCity = (id) => API.get(`/cities/${id}`);

// Activities
export const searchActivities = (params) => API.get('/activities/search', { params });

// Stops / Itinerary
export const getStops = (tripId) => API.get(`/trips/${tripId}/stops`);
export const createStop = (tripId, data) => API.post(`/trips/${tripId}/stops`, data);
export const updateStop = (stopId, data) => API.put(`/stops/${stopId}`, data);
export const deleteStop = (stopId) => API.delete(`/stops/${stopId}`);
export const reorderStops = (tripId, data) => API.put(`/trips/${tripId}/stops/reorder`, data);
export const addActivity = (stopId, data) => API.post(`/stops/${stopId}/activities`, data);
export const getStopActivities = (stopId) => API.get(`/stops/${stopId}/activities`);
export const removeActivity = (activityId) => API.delete(`/stop-activities/${activityId}`);

// Budget & Expenses
export const getBudget = (tripId) => API.get(`/trips/${tripId}/budget`);
export const updateBudget = (tripId, data) => API.put(`/trips/${tripId}/budget`, data);
export const getExpenses = (tripId) => API.get(`/trips/${tripId}/expenses`);
export const createExpense = (tripId, data) => API.post(`/trips/${tripId}/expenses`, data);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getInvoice = (tripId) => API.get(`/trips/${tripId}/invoice`);
export const downloadInvoicePdf = (tripId) => API.get(`/trips/${tripId}/invoice/pdf`, { responseType: 'blob' });

// Checklist
export const getChecklist = (tripId) => API.get(`/trips/${tripId}/checklist`);
export const createChecklistItem = (tripId, data) => API.post(`/trips/${tripId}/checklist`, data);
export const updateChecklistItem = (id, data) => API.put(`/checklist/${id}`, data);
export const deleteChecklistItem = (id) => API.delete(`/checklist/${id}`);
export const resetChecklist = (tripId) => API.post(`/trips/${tripId}/checklist/reset`);

// Notes
export const getNotes = (tripId, filter) => API.get(`/trips/${tripId}/notes`, { params: { filter } });
export const createNote = (tripId, data) => API.post(`/trips/${tripId}/notes`, data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);

// Community
export const getCommunityPosts = (params) => API.get('/community', { params });
export const createCommunityPost = (data) => API.post('/community', data);
export const likePost = (id) => API.put(`/community/${id}/like`);

// Share
export const shareTrip = (tripId) => API.post(`/trips/${tripId}/share`);
export const getShared = (token) => API.get(`/shared/${token}`);

// Profile
export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');

export default API;
