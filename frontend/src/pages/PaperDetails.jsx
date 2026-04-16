import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
getPaperById,
} from "../api/services/paperService";
import {
getNotes,
createNote,
updateNote,
deleteNote,
} from "../api/services/noteService";

const PaperDetails = () => {
const { id } = useParams();
const navigate = useNavigate();

const [paper, setPaper] = useState(null);
const [notes, setNotes] = useState([]);
const [newNote, setNewNote] = useState("");
const [editingNote, setEditingNote] = useState(null);
const [editContent, setEditContent] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");

// ================= FETCH =================
useEffect(() => {
fetchPaper();
fetchNotes();
}, [id]);

const fetchPaper = async () => {
try {
const res = await getPaperById(id);
setPaper(res?.data);
} catch (err) {
console.error(err);
setError("Failed to load paper");
} finally {
setIsLoading(false);
}
};

const fetchNotes = async () => {
try {
const res = await getNotes(id);
setNotes(res?.data || []);
} catch (err) {
console.error("Error fetching notes:", err);
}
};

// ================= ADD NOTE =================
const handleAddNote = async () => {
if (!newNote.trim() || isSubmitting) return;


try {
  setIsSubmitting(true);

  const res = await createNote({
    content: newNote.trim(),
    paper: id,
  });

  const createdNote = res?.data;

  setNotes((prev) => [createdNote, ...prev]); // instant update
  setNewNote("");

} catch (err) {
  console.error(err);
  setError("Failed to add note");
} finally {
  setIsSubmitting(false);
}


};

// ================= EDIT NOTE =================
const handleEditNote = (note) => {
setEditingNote(note._id);
setEditContent(note.content);
};

const handleSaveEdit = async () => {
if (!editContent.trim() || isSubmitting) return;


try {
  setIsSubmitting(true);

  const res = await updateNote(editingNote, {
    content: editContent.trim(),
  });

  const updated = res?.data;

  setNotes((prev) =>
    prev.map((n) => (n._id === editingNote ? updated : n))
  );

  setEditingNote(null);
  setEditContent("");

} catch (err) {
  console.error(err);
  setError("Failed to update note");
} finally {
  setIsSubmitting(false);
}


};

const handleCancelEdit = () => {
setEditingNote(null);
setEditContent("");
};

// ================= DELETE NOTE =================
const handleDeleteNote = async (noteId) => {
if (!window.confirm("Delete this note?")) return;


try {
  await deleteNote(noteId);
  setNotes((prev) => prev.filter((n) => n._id !== noteId));
} catch (err) {
  console.error(err);
  setError("Failed to delete note");
}


};

// ================= UI =================
if (isLoading) {
return ( <Layout pageTitle="Paper Details"> <div>Loading...</div> </Layout>
);
}

if (!paper) {
return ( <Layout pageTitle="Paper Details">
<div style={{ color: "red" }}>Paper not found</div>
<button onClick={() => navigate("/papers")}>
Back to Papers </button> </Layout>
);
}

return ( <Layout pageTitle={paper.title}>
<div style={{ padding: "20px" }}>


    {/* HEADER */}
    <h1>{paper.title}</h1>

    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "20px"
    }}>
      <p><strong>Authors:</strong> {paper.authors?.join(", ")}</p>
      <p><strong>Year:</strong> {paper.publicationYear}</p>
      <p><strong>Journal:</strong> {paper.journal}</p>
    </div>

    {/* TOPICS */}
    <div style={{ marginBottom: "20px" }}>
      <strong>Topics:</strong>
      <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
        {paper.topics?.length > 0 ? (
          paper.topics.map((t) => (
            <span key={t._id} style={{
              background: "#e6f4ea",
              padding: "5px 10px",
              borderRadius: "10px"
            }}>
              {t.topicName}
            </span>
          ))
        ) : (
          <span>No topics</span>
        )}
      </div>
    </div>

    {/* PDF + LINK */}
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

      <div style={{ flex: 1, background: "#fff", padding: "15px", borderRadius: "12px" }}>
        <h3>📄 PDF</h3>
        {paper.pdfPath ? (
          <a href={paper.pdfPath} target="_blank" rel="noopener noreferrer">
            Open PDF
          </a>
        ) : <p>No PDF</p>}
      </div>

      <div style={{ flex: 1, background: "#fff", padding: "15px", borderRadius: "12px" }}>
        <h3>🔗 Link</h3>
        {paper.externalLink ? (
          <a href={paper.externalLink} target="_blank" rel="noopener noreferrer">
            Visit Link
          </a>
        ) : <p>No link</p>}
      </div>

    </div>

    {/* NOTES */}
    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px" }}>
      <h3>📝 Notes ({notes.length})</h3>

      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Write note..."
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleAddNote} disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Note"}
      </button>

      <ul style={{ marginTop: "15px" }}>
        {notes.map((note) => (
          <li key={note._id} style={{ marginBottom: "10px" }}>
            {editingNote === note._id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {note.content}
                <button onClick={() => handleEditNote(note)}>✏️</button>
                <button onClick={() => handleDeleteNote(note._id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>

    <button onClick={() => navigate("/papers")} style={{ marginTop: "20px" }}>
      Back
    </button>

  </div>
</Layout>


);
};

export default PaperDetails;
