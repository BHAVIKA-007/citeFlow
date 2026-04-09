import API from '../axios.js';

// Register user
export const registerUser = async (userData) => {
  const formData = new FormData();
  formData.append('username', userData.username);
  formData.append('email', userData.email);
  formData.append('name', userData.name);
  formData.append('password', userData.password);
  if (userData.avatar) {
    formData.append('avatar', userData.avatar);
  }
  const response = await API.post('/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await API.post('/users/login', credentials);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await API.post('/users/logout');
  return response.data;
};

// Refresh access token
export const refreshAccessToken = async () => {
  const response = await API.post('/users/refresh-token');
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await API.get('/users/me');
  return response.data;
};

// Update account details
export const updateAccountDetails = async (userData) => {
  const response = await API.patch('/users/update-profile', userData);
  return response.data;
};

// Update user avatar
export const updateUserAvatar = async (avatarFile) => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);
  const response = await API.patch('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await API.post('/users/change-password', passwordData);
  return response.data;
};