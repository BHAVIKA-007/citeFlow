import API from '../axios.js';

// Create topic
export const createTopic = async (topicData) => {
  const payload = {
    topicName: topicData.topicName || topicData.name,
    description: topicData.description,
    domain: topicData.domain,
    topicType: topicData.topicType,
    priority: topicData.priority,
    status: topicData.status,
  };

  const response = await API.post('/topics', payload);
  return response.data.data;
};

// Get topics
export const getTopics = async () => {
  const response = await API.get('/topics');
  return response.data.data;
};

// Update topic
export const updateTopic = async (id, topicData) => {
  const response = await API.patch(`/topics/${id}`, topicData);
  return response.data;
};

// Delete topic
export const deleteTopic = (id, data) => {
  return API.delete(`/topics/${id}`, { data });
};