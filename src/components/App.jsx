import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import NoteDialog from "./NoteDialog";
import { notesService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Alert, CircularProgress, Box } from "@mui/material";

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
    return () => {
      // Cleanup any pending requests
    };
  }, [isAuthenticated]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesService.getNotes();
      setNotes(response.data.notes || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (newNote) => {
    try {
      const response = await notesService.createNote(newNote.title, newNote.content);
      const note = response.data.note;
      setNotes(prevNotes => [note, ...prevNotes]);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create note");
      console.error("Error adding note:", err);
    }
  };

  const openNote = (note) => {
    setSelectedNote(note);
  };

  const closeNote = () => setSelectedNote(null);

  const updateNote = async (id, title, content) => {
    try {
      const response = await notesService.updateNote(id, title, content);
      const updated = response.data.note;
      setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
      setError("");
      closeNote();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update note");
      console.error("Error updating note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await notesService.deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note");
      console.error("Error deleting note:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Header />
      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            onOpen={openNote}
          />
        );
      })}
      <NoteDialog open={!!selectedNote} note={selectedNote} onClose={closeNote} onSave={updateNote} />
      <Footer />
    </div>
  );
}

export default NotesApp;
