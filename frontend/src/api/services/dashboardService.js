import API from '../axios.js';

// Get dashboard stats
export const getDashboardStats = async () => {
  const response = await API.get('/dashboard');
  return response.data;
};