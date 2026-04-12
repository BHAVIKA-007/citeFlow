import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PaperCard from "../components/PaperCard";
import { getPapers, toggleFavorite } from "../api/services/paperService";
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

  // Filter and sort papers
  const filteredAndSortedPapers = useMemo(() => {
    let filtered = [...papers];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((paper) => {
        if (searchBy === "author") {
          return (paper.authors || []).some(a => a.toLowerCase().includes(searchLower));
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
            (paper.authors || []).some(a => a.toLowerCase().includes(searchLower))
          );
        }
      });
    }

    // Topic filter
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((paper) => {
        const paperTopicIds = (paper.topics || []).map(t => t._id || t);
        return selectedTopicIds.some(id => paperTopicIds.includes(id));
      });
    }

    // Sort
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

  const handleAddTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
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

          <div className="filter-row">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="title">Title (A–Z)</option>
              <option value="year-desc">Year (Newest First)</option>
              <option value="year-asc">Year (Oldest First)</option>
            </select>

            <button
              className="btn btn-primary"
              onClick={() => setShowAddPaper(!showAddPaper)}
            >
              {showAddPaper ? "Hide Form" : "+ Add Paper"}
            </button>
          </div>

          {/* Topic Filter */}
          <div className="topic-filter">
            <div className="filter-label">Filter by Topics:</div>
            <div className="topic-chips">
              {topics.map((topic) => (
                <button
                  key={topic._id}
                  className={`topic-chip ${selectedTopics.includes(topic._id) ? "active" : ""}`}
                  onClick={() => handleAddTopic(topic._id)}
                >
                  {topic.topicName || topic.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add Paper Form */}
        {showAddPaper && (
          <AddPaperForm
            topics={topics}
            onSuccess={() => {
              setShowAddPaper(false);
              // Refresh papers
            }}
          />
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
                onEdit={() => navigate(`/papers/${paper._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const AddPaperForm = ({ topics, onSuccess }) => {
  // Implement AddPaperForm component
  return <div>Add Paper Form</div>;
};

export default Papers;
