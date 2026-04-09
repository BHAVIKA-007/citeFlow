import API from '../axios.js';

// Create note (alias)
export const addNote = async (noteData) => {
  const response = await API.post('/notes', noteData);
  return response.data;
};

// Create note
export const createNote = async (noteData) => {
  const response = await API.post('/notes', noteData);
  return response.data;
};

// Get notes
export const getNotes = async (paperId) => {
  const response = await API.get(`/notes/${paperId}`);
  return response.data;
};

// Update note
export const updateNote = async (id, noteData) => {
  const response = await API.patch(`/notes/update/${id}`, noteData);
  return response.data;
};

// Delete note
export const deleteNote = async (id) => {
  const response = await API.delete(`/notes/delete/${id}`);
  return response.data;
};