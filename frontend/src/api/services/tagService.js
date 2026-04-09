import API from '../axios.js';

// Create tag
export const createTag = async (tagData) => {
  const response = await API.post('/tags', tagData);
  return response.data;
};

// Get tags
export const getTags = async () => {
  const response = await API.get('/tags');
  return response.data;
};

// Delete tag
export const deleteTag = async (id) => {
  const response = await API.delete(`/tags/${id}`);
  return response.data;
};