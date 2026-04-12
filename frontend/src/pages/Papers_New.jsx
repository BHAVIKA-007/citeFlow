import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PaperCard from "../components/PaperCard";
import { getPapers, toggleFavorite, createPaper } from "../api/services/paperService";
import { getTopics } from "../api/services/researchTopicService";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all"); // "all", "title", "author"
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [sortOption, setSortOption] = useState("title"); // "title", "year-asc", "year-desc"
  const [showAddPaper, setShowAddPaper] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: "",
    description: "",
    authors: "",
    publicationYear: "",
    journal: "",
    topics: [],
    externalLink: "",
  });
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load papers and topics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [papersRes, topicsRes] = await Promise.all([
          getPapers(),
          getTopics()
        ]);
        setPapers(papersRes.data || []);
        setTopics(topicsRes.data || []);
      } catch (err) {
        setError("Failed to load papers");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle topic param from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topicParam = params.get("topic");
    if (topicParam) {
      setSelectedTopics([topicParam]);
    }
  }, [location.search]);

  // Compute filtered and sorted papers - CRITICAL FIX
  const filteredAndSortedPapers = useMemo(() => {
    let filtered = [...papers];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((paper) => {
        if (searchBy === "author") {
          return (paper.authors || []).some(a =>
            String(a).toLowerCase().includes(searchLower)
          );
        } else if (searchBy === "title") {
          return (
            paper.title.toLowerCase().includes(searchLower) ||
            (paper.description && paper.description.toLowerCase().includes(searchLower))
          );
        } else {
          // all
          return (
            paper.title.toLowerCase().includes(searchLower) ||
            (paper.description && paper.description.toLowerCase().includes(searchLower)) ||
            (paper.authors || []).some(a => String(a).toLowerCase().includes(searchLower))
          );
        }
      });
    }

    // Topic filter
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((paper) => {
        const paperTopicIds = (paper.topics || []).map(t => t._id || t);
        return selectedTopics.some(id => paperTopicIds.includes(id));
      });
    }

    // Sort - APPLIED ALWAYS
    filtered.sort((a, b) => {
      if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "year-asc") {
        return (a.publicationYear || 0) - (b.publicationYear || 0);
      } else if (sortOption === "year-desc") {
        return (b.publicationYear || 0) - (a.publicationYear || 0);
      }
      return 0;
    });

    return filtered;
  }, [papers, searchTerm, searchBy, selectedTopics, sortOption]);

  const handleToggleFavorite = async (paperId, isFavorite) => {
    try {
      await toggleFavorite(paperId);
      setPapers(papers.map((p) =>
        p._id === paperId ? { ...p, isFavorite: !isFavorite } : p
      ));
    } catch (err) {
      setError("Failed to update favorite");
    }
  };

  const handleAddTopicFilter = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleCreatePaper = async (e) => {
    e.preventDefault();
    if (!newPaper.title.trim()) {
      setCreateError("Title is required");
      return;
    }

    if (newPaper.publicationYear && (isNaN(newPaper.publicationYear) || newPaper.publicationYear < 1000)) {
      setCreateError("Publication year must be a valid number");
      return;
    }

    try {
      setCreateError("");
      setCreateSuccess("");
      
      let authorsArray = [];
      if (newPaper.authors) {
        authorsArray = newPaper.authors.split(",").map(a => a.trim()).filter(a => a);
      }

      await createPaper({
        title: newPaper.title.trim(),
        description: newPaper.description || "",
        authors: authorsArray,
        publicationYear: newPaper.publicationYear ? Number(newPaper.publicationYear) : undefined,
        journal: newPaper.journal || "",
        topics: newPaper.topics.length > 0 ? newPaper.topics : undefined,
        externalLink: newPaper.externalLink || "",
      });

      setCreateSuccess("Paper added successfully!");
      resetForm();
      setShowAddPaper(false);
      
      // Refresh papers
      const response = await getPapers();
      setPapers(response.data || []);
      
      setTimeout(() => setCreateSuccess(""), 3000);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create paper");
    }
  };

  const resetForm = () => {
    setNewPaper({
      title: "",
      description: "",
      authors: "",
      publicationYear: "",
      journal: "",
      topics: [],
      externalLink: "",
    });
    setPdfFile(null);
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
      <div className="papers-page">
        {/* Header */}
        <div className="page-header">
          <h1>📚 Research Papers</h1>
          <p>Manage and organize your research papers</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Search & Filter Section */}
        <div className="search-filter-section">
          <div className="search-row">
            <input
              type="text"
              placeholder="Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="filter-select"
            >
              <option value="all">Search All</option>
              <option value="title">Title & Description</option>
              <option value="author">Authors</option>
            </select>
          </div>

          <div className="sort-filter-row">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="title">Sort: Title (A–Z)</option>
              <option value="year-desc">Sort: Year (Newest First)</option>
              <option value="year-asc">Sort: Year (Oldest First)</option>
            </select>

            <button
              className="btn btn-primary"
              onClick={() => setShowAddPaper(!showAddPaper)}
            >
              {showAddPaper ? "Hide Form" : "+ Add Paper"}
            </button>
          </div>

          {/* Topic Filter */}
          {topics.length > 0 && (
            <div className="topic-filter">
              <div className="filter-label">Filter by Topics:</div>
              <div className="topic-chips">
                {topics.map((topic) => (
                  <button
                    key={topic._id}
                    className={`topic-chip ${selectedTopics.includes(topic._id) ? "active" : ""}`}
                    onClick={() => handleAddTopicFilter(topic._id)}
                  >
                    {topic.topicName || topic.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Paper Form */}
        {showAddPaper && (
          <div className="add-paper-card">
            <h3>Add New Paper</h3>
            <form onSubmit={handleCreatePaper} className="add-paper-form">
              {/* Title */}
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Paper title"
                  value={newPaper.title}
                  onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Brief description..."
                  value={newPaper.description}
                  onChange={(e) => setNewPaper({ ...newPaper, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-row">
                {/* Authors */}
                <div className="form-group">
                  <label>Authors</label>
                  <input
                    type="text"
                    placeholder="Author names (comma separated)"
                    value={newPaper.authors}
                    onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })}
                  />
                </div>

                {/* Year */}
                <div className="form-group">
                  <label>Publication Year</label>
                  <input
                    type="number"
                    placeholder="2023"
                    value={newPaper.publicationYear}
                    onChange={(e) => setNewPaper({ ...newPaper, publicationYear: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                {/* Journal */}
                <div className="form-group">
                  <label>Journal</label>
                  <input
                    type="text"
                    placeholder="Journal name"
                    value={newPaper.journal}
                    onChange={(e) => setNewPaper({ ...newPaper, journal: e.target.value })}
                  />
                </div>

                {/* Topics */}
                <div className="form-group">
                  <label>Topics</label>
                  <select
                    multiple
                    value={newPaper.topics}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                      setNewPaper({ ...newPaper, topics: selected });
                    }}
                    className="topic-select"
                  >
                    {topics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.topicName || topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* External Link */}
              <div className="form-group">
                <label>External Link (URL)</label>
                <input
                  type="url"
                  placeholder="https://example.com/paper.pdf"
                  value={newPaper.externalLink}
                  onChange={(e) => setNewPaper({ ...newPaper, externalLink: e.target.value })}
                />
              </div>

              {/* Buttons */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Paper
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddPaper(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>

              {createError && <div className="alert alert-error">{createError}</div>}
              {createSuccess && <div className="alert alert-success">{createSuccess}</div>}
            </form>
          </div>
        )}

        {/* Papers List */}
        {filteredAndSortedPapers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">
              {papers.length === 0
                ? "No papers yet. Click \"Add Paper\" to create one!"
                : "No papers match your search or filter."}
            </div>
          </div>
        ) : (
          <div className="papers-grid">
            {filteredAndSortedPapers.map((paper) => (
              <PaperCard
                key={paper._id}
                paper={paper}
                onFavoriteToggle={handleToggleFavorite}
                onClick={() => navigate(`/papers/${paper._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Papers;
