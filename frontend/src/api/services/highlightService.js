import API from '../axios.js';

// Add highlight
export const addHighlight = async (highlightData) => {
  const response = await API.post('/highlights', highlightData);
  return response.data;
};

// Get highlights
export const getHighlights = async (paperId) => {
  const response = await API.get(`/highlights/${paperId}`);
  return response.data;
};

// Delete highlight
export const deleteHighlight = async (id) => {
  const response = await API.delete(`/highlights/${id}`);
  return response.data;
};