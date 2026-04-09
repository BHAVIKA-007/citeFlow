import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import TopicCard from "../components/TopicCard";
import { getTopics, createTopic, deleteTopic } from "../api/services/researchTopicService";

const Topics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      const topics = await getTopics();
      setTopics(topics || []);
      console.log("Topics:", topics);
    } catch (err) {
      setError("Failed to load topics");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) {
      setError("Please enter a topic name");
      return;
    }

    try {
      setError("");
      setSuccess("");
      await createTopic({ topicName: newTopicName });
      setNewTopicName("");
      setSuccess("Topic created successfully!");
      fetchTopics();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create topic");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      setError("");
      await deleteTopic(topicId);
      setSuccess("Topic deleted successfully!");
      fetchTopics();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete topic");
    }
  };

  const handleTopicClick = (topicId) => {
    navigate(`/papers?topic=${topicId}`);
  };

  if (isLoading) {
    return (
      <Layout pageTitle="Topics">
        <div className="loading">Loading topics...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Topics">
      <div className="dashboard-header">
        <h1>🏷️ Research Topics</h1>
        <p>Organize your research papers into topics</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="topics-container">
        <form onSubmit={handleCreateTopic} className="add-topic-form">
          <input
            type="text"
            placeholder="Enter new topic name..."
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="add-paper-btn">
            ➕ Add Topic
          </button>
        </form>

        {topics.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No topics yet. Create one to get started!</div>
          </div>
        ) : (
          <div className="topics-grid">
            {topics.map((topic) => (
              <TopicCard
                key={topic._id}
                topic={topic}
                paperCount={topic.paperCount || 0}
                onDelete={handleDeleteTopic}
                onClick={() => handleTopicClick(topic._id)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Topics;