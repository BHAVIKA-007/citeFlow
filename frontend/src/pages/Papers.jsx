import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PaperCard from "../components/PaperCard";
import { getPapers, toggleFavorite, createPaper, deletePaper } from "../api/services/paperService";
import { getTopics } from "../api/services/researchTopicService";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [topics, setTopics] = useState([]);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [sortBy, setSortBy] = useState("title-asc");

  const [showCreatePaper, setShowCreatePaper] = useState(false);

  const [newPaper, setNewPaper] = useState({
    title: "",
    authors: "",
    publicationYear: "",
    journal: "",
    topics: [],
    externalLink: ""
  });

  const [pdfFile, setPdfFile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const location = useLocation();

  useEffect(() => {
    fetchPapers();
    fetchTopics();
  }, []);

  // ✅ URL → topic sync (IMPORTANT)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topicParam = params.get("topic");

    if (topicParam) {
      setSelectedTopic(topicParam);
    }
  }, [location.search]);

  useEffect(() => {
    filterAndSortPapers();
  }, [papers, searchTitle, searchAuthor, selectedTopic, sortBy]);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const res = await getPapers();
      setPapers(res.data || []);
    } catch {
      setError("Failed to load papers");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await getTopics();
      setTopics(res || []);
    } catch {}
  };

  const handleDeletePaper = async (id) => {
    if (!window.confirm("Delete this paper?")) return;

    try {
      await deletePaper(id);
      setPapers(papers.filter(p => p._id !== id));
    } catch {
      alert("Failed to delete paper");
    }
  };

  // ✅ FINAL FILTER + SORT
  const filterAndSortPapers = () => {
    let filtered = [...papers];

    if (searchTitle) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (searchAuthor) {
      filtered = filtered.filter(p => {
        const authorsText = Array.isArray(p.authors)
          ? p.authors.join(", ").toLowerCase()
          : (p.authors || "").toLowerCase();

        return authorsText.includes(searchAuthor.toLowerCase());
      });
    }

    // ✅ FIXED topic filter
    if (selectedTopic) {
      filtered = filtered.filter(p =>
        p.topics?.some(t => String(t._id || t) === selectedTopic)
      );
    }

    // SORT
    if (sortBy === "title-asc") {
      filtered.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );
    } else if (sortBy === "title-desc") {
      filtered.sort((a, b) =>
        b.title.toLowerCase().localeCompare(a.title.toLowerCase())
      );
    } else if (sortBy === "year-desc") {
      filtered.sort((a, b) => (b.publicationYear || 0) - (a.publicationYear || 0));
    } else if (sortBy === "year-asc") {
      filtered.sort((a, b) => (a.publicationYear || 0) - (b.publicationYear || 0));
    }

    setFilteredPapers(filtered);
  };

  const handleFavoriteToggle = async (paperId, isFavorite) => {
    await toggleFavorite(paperId);
    setPapers(papers.map(p => p._id === paperId ? { ...p, isFavorite } : p));
  };

  const handleCreatePaper = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    if (!newPaper.title.trim()) {
      setCreateError("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", newPaper.title);
    formData.append("authors", newPaper.authors);
    formData.append("publicationYear", newPaper.publicationYear);
    formData.append("journal", newPaper.journal);
    formData.append("externalLink", newPaper.externalLink);
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    try {
      await createPaper(formData);
      setCreateSuccess("Paper added successfully!");
      setNewPaper({
        title: "",
        authors: "",
        publicationYear: "",
        journal: "",
        topics: [],
        externalLink: ""
      });
      setPdfFile(null);
      setShowCreatePaper(false);
      fetchPapers();
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to add paper");
    }
  };

  if (isLoading) return <Layout><div>Loading…</div></Layout>;

  return (
    <Layout pageTitle="Papers">
      <div className="dashboard-header">
        <h1>📄 Research Papers</h1>
        <p>Browse, filter, and manage your research collection in a cleaner view.</p>
      </div>

      <div className="papers-top-section">
        <div className="search-filter-bar">

        <input
          placeholder="Search by title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />

        <input
          placeholder="Search by author"
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
        />

        {/* ✅ NEW TOPIC FILTER */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">All Topics</option>
          {topics.map(t => (
            <option key={t._id} value={t._id}>
              {t.topicName || t.name}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title-asc">A → Z</option>
          <option value="title-desc">Z → A</option>
          <option value="year-desc">Newest</option>
          <option value="year-asc">Oldest</option>
        </select>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowCreatePaper(!showCreatePaper)}
          style={{ whiteSpace: "nowrap" }}
        >
          {showCreatePaper ? "Hide Add Paper" : "+ Add Paper"}
        </button>
        </div>

        {showCreatePaper && (
          <div className="paper-create-card">
            <div className="paper-create-header">Add New Paper</div>
            <form className="paper-create-form" onSubmit={handleCreatePaper}>
              <div className="paper-form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Paper title"
                    value={newPaper.title}
                    onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Authors</label>
                  <input
                    type="text"
                    placeholder="Authors (comma separated)"
                    value={newPaper.authors}
                    onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })}
                  />
                </div>
              </div>

              <div className="paper-form-row">
                <div className="form-group">
                  <label>Publication year</label>
                  <input
                    type="number"
                    placeholder="e.g. 2025"
                    value={newPaper.publicationYear}
                    onChange={(e) => setNewPaper({ ...newPaper, publicationYear: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Journal</label>
                  <input
                    type="text"
                    placeholder="Journal name"
                    value={newPaper.journal}
                    onChange={(e) => setNewPaper({ ...newPaper, journal: e.target.value })}
                  />
                </div>
              </div>

              <div className="paper-form-row">
                <div className="form-group">
                  <label>External link</label>
                  <input
                    type="url"
                    placeholder="Optional link"
                    value={newPaper.externalLink}
                    onChange={(e) => setNewPaper({ ...newPaper, externalLink: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Upload PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="paper-form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Paper
                </button>
              </div>

              {createError && <div className="alert alert-error">{createError}</div>}
              {createSuccess && <div className="alert alert-success">{createSuccess}</div>}
            </form>
          </div>
        )}
      </div>

      {/* PAPERS */}
      <div className="papers-grid">
        {filteredPapers.map(p => (
          <PaperCard
            key={p._id}
            paper={p}
            onFavoriteToggle={handleFavoriteToggle}
            onDelete={handleDeletePaper}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Papers;