import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PaperCard from "../components/PaperCard";
import { getPapers, toggleFavorite, createPaper } from "../api/services/paperService";
import { getTopics } from "../api/services/researchTopicService";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [showCreatePaper, setShowCreatePaper] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: "",
    authors: "",
    publicationYear: "",
    journal: "",
    topic: "",
  });
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchPapers();
    fetchTopics();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topicParam = params.get("topic") || "";
    if (topicParam) {
      setSelectedTopic(topicParam);
    }
  }, [location.search]);

  useEffect(() => {
    filterAndSortPapers();
  }, [papers, searchTerm, selectedTopic, sortBy]);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const response = await getPapers();
      setPapers(response.data || []);
    } catch (err) {
      setError("Failed to load papers");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const topics = await getTopics();
      setTopics(topics || []);
    } catch (err) {
      console.error("Failed to load topics", err);
    }
  };

  const filterAndSortPapers = () => {
    let filtered = papers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (paper) =>
          paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (paper.authors || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Topic filter
    if (selectedTopic) {
      filtered = filtered.filter((paper) => {
        const topicId = paper.topic?._id || paper.topic;
        return String(topicId) === selectedTopic;
      });
    }

    // Sort
    if (sortBy === "year") {
      filtered.sort((a, b) => (b.publicationYear || 0) - (a.publicationYear || 0));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredPapers(filtered);
  };

  const handleFavoriteToggle = async (paperId, isFavorite) => {
    try {
      await toggleFavorite(paperId);
      setPapers(
        papers.map((p) =>
          p._id === paperId ? { ...p, isFavorite } : p
        )
      );
    } catch (err) {
      setError("Failed to update favorite");
    }
  };

  const handleCreatePaper = async (e) => {
    e.preventDefault();
    if (!newPaper.title.trim()) {
      setCreateError("Title is required");
      return;
    }

    try {
      setCreateError("");
      setCreateSuccess("");
      await createPaper({
        title: newPaper.title,
        authors: newPaper.authors,
        publicationYear: newPaper.publicationYear ? Number(newPaper.publicationYear) : undefined,
        journal: newPaper.journal,
        topic: newPaper.topic || undefined,
      });
      setCreateSuccess("Paper added successfully!");
      setNewPaper({ title: "", authors: "", publicationYear: "", journal: "", topic: "" });
      setShowCreatePaper(false);
      fetchPapers();
      setTimeout(() => setCreateSuccess(""), 3000);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create paper");
    }
  };

  if (isLoading) {
    return (
      <Layout pageTitle="Papers">
        <div className="loading">Loading papers...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Papers">
      <div className="dashboard-header">
        <h1>📄 Research Papers</h1>
        <p>Browse and manage your research paper collection</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="papers-container">
        <div className="papers-top-section">
          <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search papers by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="filter-select"
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.topicName || topic.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="title">Sort by Title</option>
            <option value="year">Sort by Year</option>
          </select>
        </div>
        <div className="paper-actions-bar">
          <button
            className="btn-primary"
            type="button"
            onClick={() => setShowCreatePaper(!showCreatePaper)}
          >
            {showCreatePaper ? "Hide Add Paper" : "+ Add Paper"}
          </button>
        </div>
        {showCreatePaper && (
          <form className="add-paper-form" onSubmit={handleCreatePaper}>
            <input
              type="text"
              placeholder="Paper title"
              value={newPaper.title}
              onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Authors"
              value={newPaper.authors}
              onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })}
            />
            <input
              type="text"
              placeholder="Publication year"
              value={newPaper.publicationYear}
              onChange={(e) => setNewPaper({ ...newPaper, publicationYear: e.target.value })}
            />
            <input
              type="text"
              placeholder="Journal"
              value={newPaper.journal}
              onChange={(e) => setNewPaper({ ...newPaper, journal: e.target.value })}
            />
            <select
              value={newPaper.topic}
              onChange={(e) => setNewPaper({ ...newPaper, topic: e.target.value })}
            >
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.topicName || topic.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary">
              Save Paper
            </button>
            {createError && <div className="alert alert-error">{createError}</div>}
            {createSuccess && <div className="alert alert-success">{createSuccess}</div>}
          </form>
        )}
        </div>

        {filteredPapers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">
              {papers.length === 0
                ? "No papers yet. Create topics and upload papers to get started!"
                : "No papers match your search or filter criteria."}
            </div>
          </div>
        ) : (
          <div className="papers-grid">
            {filteredPapers.map((paper) => (
              <PaperCard
                key={paper._id}
                paper={paper}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Papers;