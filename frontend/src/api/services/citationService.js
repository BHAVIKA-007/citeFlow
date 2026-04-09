import API from '../axios.js';

// Generate citation
export const generateCitation = async (paperId, citationData) => {
  const response = await API.post(`/citations/${paperId}`, citationData);
  return response.data;
};

// Get citations
export const getCitations = async (paperId) => {
  const response = await API.get(`/citations/${paperId}`);
  return response.data;
};