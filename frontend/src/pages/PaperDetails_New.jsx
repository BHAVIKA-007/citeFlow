import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getPaperById,
  toggleFavorite,
  updatePaper,
  deletePaper,
} from "../api/services/paperService";
import {
  addNote,
  getNotes,
  deleteNote,
} from "../api/services/noteService";
import { getTopics } from "../api/services/researchTopicService";

const PaperDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [notes, setNotes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    authors: "",
    publicationYear: "",
    journal: "",
    topics: [],
    externalLink: "",
  });
  const [newNote, setNewNote] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchTopics();
    fetchPaperData();
  }, [id]);

  const fetchTopics = async () => {
    try {
      const topicList = await getTopics();
      setTopics(topicList.data || topicList || []);
    } catch (err) {
      console.error("Failed to load topics", err);
    }
  };

  const fetchPaperData = async () => {
    try {
      setIsLoading(true);
      const [paperRes, notesRes] = await Promise.all([
        getPaperById(id),
        getNotes(id),
      ]);
      const paperData = paperRes.data || null;
      setPaper(paperData);
      setNotes(notesRes.data || []);
      setIsFavorite(paperData?.isFavorite || false);
      setEditData({
        title: paperData?.title || "",
        description: paperData?.description || "",
        authors: (paperData?.authors || []).join(", "),
        publicationYear: paperData?.publicationYear || "",
        journal: paperData?.journal || "",
        topics: (paperData?.topics || []).map(t => t._id || t),
        externalLink: paperData?.externalLink || "",
      });
    } catch (err) {
      setError("Failed to load paper details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(id);
      setIsFavorite(!isFavorite);
      setPaper({ ...paper, isFavorite: !isFavorite });
      setSuccess("Favorite updated!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to update favorite");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setError("");
      await addNote({ content: newNote, paper: id, noteType: "text" });
      setNewNote("");
      setRefreshKey(prev => prev + 1);
      const notesRes = await getNotes(id);
      setNotes(notesRes.data || []);
      setSuccess("Note added successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to add note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(noteId);
      const notesRes = await getNotes(id);
      setNotes(notesRes.data || []);
      setSuccess("Note deleted!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  const handleUpdatePaper = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      let authorsArray = [];
      if (editData.authors) {
        authorsArray = editData.authors.split(",").map(a => a.trim()).filter(a => a);
      }

      const response = await updatePaper(id, {
        title: editData.title,
        description: editData.description,
        authors: authorsArray,
        publicationYear: editData.publicationYear ? Number(editData.publicationYear) : undefined,
        journal: editData.journal,
        topics: editData.topics.length > 0 ? editData.topics : [],
        externalLink: editData.externalLink,
      });
      const updatedPaper = response.data;
      setPaper(updatedPaper);
      setSuccess("Paper updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update paper");
    }
  };

  const handleDeletePaper = async () => {
    if (!window.confirm("Are you sure you want to delete this paper? This action cannot be undone.")) return;
    try {
      await deletePaper(id);
      navigate("/papers");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete paper");
    }
  };

  if (isLoading) {
    return (
      <Layout pageTitle="Paper Details">
        <div className="loading">Loading paper details...</div>
      </Layout>
    );
  }

  if (!paper) {
    return (
      <Layout pageTitle="Paper Details">
        <div className="alert alert-error">Paper not found</div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/papers")}
          style={{ marginTop: "20px" }}
        >
          Back to Papers
        </button>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={paper.title}>
      <div className="paper-details-container">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Paper Info Section */}
        <div className="paper-info-section">
          <div className="paper-info-header">
            <div>
              <h1>{paper.title}</h1>
              {paper.description && (
                <p className="paper-description">{paper.description}</p>
              )}
            </div>
            <div className="paper-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit"}
              </button>
              <button className="btn btn-danger" onClick={handleDeletePaper}>
                Delete
              </button>
              <button
                className={`btn favorite-btn ${isFavorite ? "active" : ""}`}
                onClick={handleToggleFavorite}
                title="Toggle favorite"
              >
                {isFavorite ? "❤️ Favorite" : "🤍 Add Favorite"}
              </button>
            </div>
          </div>

          {/* Paper Metadata Grid */}
          <div className="paper-info-grid">
            {paper.authors && paper.authors.length > 0 && (
              <div className="info-item">
                <div className="info-label">Authors</div>
                <div className="info-value">
                  {paper.authors.map((author, idx) => (
                    <span key={idx} className="author-tag">
                      {author}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {paper.publicationYear && (
              <div className="info-item">
                <div className="info-label">Year</div>
                <div className="info-value">{paper.publicationYear}</div>
              </div>
            )}
            {paper.journal && (
              <div className="info-item">
                <div className="info-label">Journal</div>
                <div className="info-value">{paper.journal}</div>
              </div>
            )}
            {paper.topics && paper.topics.length > 0 && (
              <div className="info-item">
                <div className="info-label">Topics</div>
                <div className="info-value">
                  {paper.topics.map((topic) => (
                    <span key={topic._id} className="topic-tag">
                      {topic.topicName || topic.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {paper.externalLink && (
              <div className="info-item">
                <div className="info-label">Link</div>
                <a href={paper.externalLink} target="_blank" rel="noopener noreferrer" className="external-link">
                  View PDF
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="edit-paper-section">
            <h3>Edit Paper</h3>
            <form onSubmit={handleUpdatePaper} className="edit-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Authors</label>
                  <input
                    type="text"
                    value={editData.authors}
                    onChange={(e) => setEditData({ ...editData, authors: e.target.value })}
                    placeholder="Author names (comma separated)"
                  />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    value={editData.publicationYear}
                    onChange={(e) => setEditData({ ...editData, publicationYear: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Journal</label>
                  <input
                    type="text"
                    value={editData.journal}
                    onChange={(e) => setEditData({ ...editData, journal: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Topics</label>
                  <select
                    multiple
                    value={editData.topics}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                      setEditData({ ...editData, topics: selected });
                    }}
                  >
                    {topics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.topicName || topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>External Link</label>
                <input
                  type="url"
                  value={editData.externalLink}
                  onChange={(e) => setEditData({ ...editData, externalLink: e.target.value })}
                  placeholder="https://example.com/paper.pdf"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes Section */}
        <div className="notes-section">
          <h3>📝 Notes</h3>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="add-note-form">
            <div className="form-group">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Note
            </button>
          </form>

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div key={note._id} className="note-item">
                  <div className="note-content">{note.content}</div>
                  <div className="note-meta">
                    <span className="note-date">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaperDetails;
