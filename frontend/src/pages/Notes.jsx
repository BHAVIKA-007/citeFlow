import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getAllPapers } from "../api/services/paperService";
import { getNotes, createNote, deleteNote } from "../api/services/noteService";

const Notes = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPapers = async () => {
    try {
      const res = await getAllPapers();
      setPapers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching papers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPaper = async (paperId) => {
    setSelectedPaper(paperId);
    try {
      const res = await getNotes(paperId);
      setNotes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedPaper || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createNote({
        content: newNote.trim(),
        paper: selectedPaper,
      });
      setNewNote("");
      await handleSelectPaper(selectedPaper); // Refresh notes
    } catch (err) {
      console.error("Error adding note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id);
      await handleSelectPaper(selectedPaper); // Refresh notes
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  if (isLoading) {
    return (
      <Layout pageTitle="Notes">
        <div className="loading">Loading notes...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Notes">
      <div className="notes-container">
        <div className="notes-header">
          <h1>📝 Research Notes</h1>
          <p>Organize and manage your research notes by paper</p>
        </div>

        <div className="notes-content">
          {/* Papers Sidebar */}
          <div className="papers-sidebar">
            <h3 className="sidebar-title">📄 Papers</h3>
            <div className="papers-list">
              {papers.length > 0 ? (
                papers.map((paper) => (
                  <div
                    key={paper._id}
                    onClick={() => handleSelectPaper(paper._id)}
                    className={`paper-item ${selectedPaper === paper._id ? 'active' : ''}`}
                  >
                    <div className="paper-item-title">{paper.title}</div>
                    <div className="paper-item-meta">
                      {paper.authors?.length > 0 && (
                        <span className="paper-authors">
                          {paper.authors.slice(0, 2).join(", ")}
                          {paper.authors.length > 2 && "..."}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-papers">
                  <p>No papers found. Add some papers first!</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes Panel */}
          <div className="notes-panel">
            {selectedPaper ? (
              <>
                <div className="notes-panel-header">
                  <h3>Notes for Selected Paper</h3>
                </div>

                {/* Add Note Form */}
                <div className="add-note-section">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write a new note..."
                    className="note-input"
                    rows="4"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSubmitting}
                    className="btn btn-primary"
                  >
                    {isSubmitting ? "Adding..." : "➕ Add Note"}
                  </button>
                </div>

                {/* Notes List */}
                <div className="notes-list-section">
                  <h4>Notes ({notes.length})</h4>
                  {notes.length > 0 ? (
                    <div className="notes-list">
                      {notes.map((note) => (
                        <div key={note._id} className="note-card">
                          <div className="note-content">
                            <p>{note.content}</p>
                            <div className="note-footer">
                              <span className="note-date">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => handleDelete(note._id)}
                                className="btn-icon btn-danger"
                                title="Delete note"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-notes-state">
                      <div className="empty-icon">📝</div>
                      <p>No notes yet for this paper. Add your first note above!</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="select-paper-prompt">
                <div className="empty-icon">👆</div>
                <h3>Select a Paper</h3>
                <p>Choose a paper from the sidebar to view and manage its notes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notes;