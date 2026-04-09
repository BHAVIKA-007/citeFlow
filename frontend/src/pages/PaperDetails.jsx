import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getPaperById,
  toggleFavorite,
  updatePaper,
  uploadPaperPDF,
  deletePaper,
} from "../api/services/paperService";
import { getTopics } from "../api/services/researchTopicService";
import {
  addNote,
  getNotes,
  deleteNote,
} from "../api/services/noteService";
import {
  addHighlight,
  getHighlights,
  deleteHighlight,
} from "../api/services/highlightService";

const PaperDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [notes, setNotes] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    authors: "",
    publicationYear: "",
    journal: "",
    topic: "",
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Form states
  const [newNote, setNewNote] = useState("");
  const [newHighlight, setNewHighlight] = useState({ text: "", color: "yellow" });

  useEffect(() => {
    fetchTopics();
    fetchPaperData();
  }, [id]);

  const fetchTopics = async () => {
    try {
      const topicList = await getTopics();
      setTopics(topicList || []);
    } catch (err) {
      console.error("Failed to load topics", err);
    }
  };

  const fetchPaperData = async () => {
    try {
      setIsLoading(true);
      const [paperRes, notesRes, highlightsRes] = await Promise.all([
        getPaperById(id),
        getNotes(id),
        getHighlights(id),
      ]);
      const paperData = paperRes.data || null;
      setPaper(paperData);
      setNotes(notesRes.data || []);
      setHighlights(highlightsRes.data || []);
      setIsFavorite(paperData?.isFavorite || false);
      setEditData({
        title: paperData?.title || "",
        authors: paperData?.authors || "",
        publicationYear: paperData?.publicationYear || "",
        journal: paperData?.journal || "",
        topic: paperData?.topic?._id || paperData?.topic || "",
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
    } catch (err) {
      setError("Failed to update favorite");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addNote({ content: newNote, paper: id });
      setNewNote("");
      fetchPaperData();
    } catch (err) {
      setError("Failed to add note");
    }
  };

  const handleAddHighlight = async (e) => {
    e.preventDefault();
    if (!newHighlight.text.trim()) return;

    try {
      await addHighlight({ ...newHighlight, paper: id });
      setNewHighlight({ text: "", color: "yellow" });
      fetchPaperData();
    } catch (err) {
      setError("Failed to add highlight");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(noteId);
      fetchPaperData();
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  const handleDeleteHighlight = async (highlightId) => {
    if (!window.confirm("Delete this highlight?")) return;
    try {
      await deleteHighlight(highlightId);
      fetchPaperData();
    } catch (err) {
      setError("Failed to delete highlight");
    }
  };

  const handleUpdatePaper = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const response = await updatePaper(id, {
        title: editData.title,
        authors: editData.authors,
        publicationYear: editData.publicationYear ? Number(editData.publicationYear) : undefined,
        journal: editData.journal,
        topic: editData.topic || undefined,
      });
      const updatedPaper = response.data;
      setPaper(updatedPaper);
      setSuccess("Paper updated successfully.");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update paper");
    }
  };

  const handleUploadPdf = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setError("Please choose a PDF to upload.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setUploadingPdf(true);
      const response = await uploadPaperPDF(id, uploadFile);
      const uploadedPaper = response.data;
      setPaper(uploadedPaper);
      setSuccess("PDF uploaded successfully.");
      setUploadFile(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload PDF");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleDeletePaper = async () => {
    if (!window.confirm("Delete this paper?")) return;
    try {
      await deletePaper(id);
      navigate("/papers");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete paper");
    }
  };

  const pdfUrl =
    paper?.pdfPath ||
    paper?.pdf_url ||
    paper?.pdfUrl ||
    paper?.pdfpath ||
    "";
  
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

        {/* Paper Info Section */}
        <div className="paper-info-section">
          <div className="paper-info-header">
            <h1>{paper.title}</h1>
            <div className="paper-actions-row">
              <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel Edit" : "Edit Paper"}
              </button>
              <button className="btn-danger" onClick={handleDeletePaper}>
                Delete Paper
              </button>
              <div
                className="favorite-toggle"
                onClick={handleToggleFavorite}
                style={{ cursor: "pointer" }}
              >
                {isFavorite ? "❤️" : "🤍"}
              </div>
            </div>
          </div>

          <div className="paper-info-grid">
            <div className="info-item">
              <div className="info-label">Authors</div>
              <div className="info-value">{paper.authors || "Unknown"}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Year</div>
              <div className="info-value">{paper.publicationYear || paper.year || "N/A"}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Journal</div>
              <div className="info-value">{paper.journal || "N/A"}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Topic</div>
              <div className="info-value">
                {paper.topic?.topicName || paper.topic?.name || paper.topic || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {isEditing && (
          <div className="paper-edit-section">
            <h3>Edit Paper</h3>
            <form onSubmit={handleUpdatePaper} className="edit-paper-form">
              <input
                type="text"
                placeholder="Title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Authors"
                value={editData.authors}
                onChange={(e) => setEditData({ ...editData, authors: e.target.value })}
              />
              <input
                type="text"
                placeholder="Publication Year"
                value={editData.publicationYear}
                onChange={(e) => setEditData({ ...editData, publicationYear: e.target.value })}
              />
              <input
                type="text"
                placeholder="Journal"
                value={editData.journal}
                onChange={(e) => setEditData({ ...editData, journal: e.target.value })}
              />
              <select
                value={editData.topic}
                onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
              >
                <option value="">Select Topic</option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.topicName || topic.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </form>
          </div>
        )}

        <div className="pdf-section">
          <h3>📑 PDF Document</h3>
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-open-pdf"
            >
              🔗 Open PDF
            </a>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">No PDF uploaded yet.</div>
            </div>
          )}
          <form onSubmit={handleUploadPdf} className="upload-pdf-form">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setUploadFile(e.target.files[0] || null)}
            />
            <button type="submit" className="btn-primary" disabled={uploadingPdf}>
              {uploadingPdf ? "Uploading..." : paper.pdfPath ? "Replace PDF" : "Upload PDF"}
            </button>
          </form>
        </div>

        {/* Notes and Highlights */}
        <div className="notes-highlights-section">
          {/* Notes Section */}
          <div className="notes-section">
            <h3 className="section-title">📝 Notes</h3>
            <form onSubmit={handleAddNote} className="add-note-form">
              <textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button type="submit" className="btn-add-note">
                ➕ Add Note
              </button>
            </form>

            <div className="notes-list">
              {notes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-text">No notes yet</div>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className="note-item">
                    <div className="note-text">{note.content}</div>
                    <div className="note-time">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      className="btn-delete-note"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Highlights Section */}
          <div className="highlights-section">
            <h3 className="section-title">✨ Highlights</h3>
            <form onSubmit={handleAddHighlight} className="add-highlight-form">
              <input
                type="text"
                placeholder="Add a highlight..."
                value={newHighlight.text}
                onChange={(e) =>
                  setNewHighlight({ ...newHighlight, text: e.target.value })
                }
              />
              <button type="submit" className="btn-add-highlight">
                ⭐ Add Highlight
              </button>
            </form>

            <div className="highlights-list">
              {highlights.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-text">No highlights yet</div>
                </div>
              ) : (
                highlights.map((highlight) => (
                  <div key={highlight._id} className="highlight-item">
                    <div className="highlight-text">{highlight.text}</div>
                    <div className="highlight-time">
                      {new Date(highlight.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      className="btn-delete-highlight"
                      onClick={() => handleDeleteHighlight(highlight._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaperDetails;