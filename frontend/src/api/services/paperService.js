import API from '../axios.js';

// Create paper
export const createPaper = async (paperData) => {
  const response = await API.post('/papers', paperData);
  return response.data;
};

// Get all papers
export const getAllPapers = async () => {
  const response = await API.get('/papers');
  return response.data;
};

// Get paper by ID
export const getPaperById = async (id) => {
  const response = await API.get(`/papers/${id}`);
  return response.data;
};

// Update paper
export const updatePaper = async (id, paperData) => {
  const response = await API.patch(`/papers/${id}`, paperData);
  return response.data;
};

// Delete paper
export const deletePaper = async (id) => {
  const response = await API.delete(`/papers/${id}`);
  return response.data;
};

// Upload paper PDF
export const uploadPaperPDF = async (id, pdfFile) => {
  const formData = new FormData();
  formData.append('pdf', pdfFile);
  const response = await API.post(`/papers/${id}/pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Search papers
export const searchPapers = async (query) => {
  const response = await API.get('/papers/search', { params: query });
  return response.data;
};

// Toggle favorite
export const toggleFavorite = async (id) => {
  const response = await API.patch(`/papers/favorite/${id}`);
  return response.data;
};

// Get all papers (alias for getAllPapers)
export const getPapers = async () => {
  const response = await API.get('/papers');
  return response.data;
};

// Get papers by topic
export const getPapersByTopic = async (topicId) => {
  const response = await API.get(`/papers/topic/${topicId}`);
  return response.data;
};