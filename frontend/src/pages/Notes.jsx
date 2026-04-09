import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getAllPapers } from "../api/services/paperService";
import { getNotes, createNote, deleteNote } from "../api/services/noteService";

const Notes = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const fetchPapers = async () => {
    const res = await getAllPapers();
    setPapers(res.data.data);
  };

  const handleSelectPaper = async (paperId) => {
    setSelectedPaper(paperId);
    const res = await getNotes(paperId);
    setNotes(res.data.data);
  };

  const handleAddNote = async () => {
    if (!newNote || !selectedPaper) return;

    await createNote({
      content: newNote,
      paper: selectedPaper,
    });

    setNewNote("");
    handleSelectPaper(selectedPaper);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    handleSelectPaper(selectedPaper);
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  return (
    <Layout>
      <h1>Notes</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* LEFT */}
        <div style={{ width: "30%" }}>
          <h3>Papers</h3>
          <ul>
            {papers.map((paper) => (
              <li
                key={paper._id}
                onClick={() => handleSelectPaper(paper._id)}
                style={{ cursor: "pointer", marginBottom: "10px" }}
              >
                {paper.title}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div style={{ width: "70%" }}>
          {selectedPaper && (
            <>
              <h3>Notes</h3>

              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write note..."
              />
              <button onClick={handleAddNote}>Add</button>

              <ul>
                {notes.map((note) => (
                  <li key={note._id}>
                    {note.content}
                    <button onClick={() => handleDelete(note._id)}>❌</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notes;