import { useState, useEffect, useCallback, useRef } from "react";

interface NoteData {
  id: string;
  title: string;
  content: string;
}

const AUTOSAVE_MS = 1000;

export function useNotes(): {
  notes: NoteData[];
  activeNote: NoteData | null;
  activeId: string;
  setActiveId: (id: string) => void;
  updateContent: (content: string) => void;
  createNote: () => void;
  closeNote: (id: string) => void;
  renameNote: (id: string, title: string) => void;
} {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [activeId, setActiveId] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    window.numi.getNotes().then((loaded) => {
      setNotes(loaded);
      if (loaded.length > 0 && loaded[0]) {
        setActiveId(loaded[0].id);
      }
    });
  }, []);

  const activeNote = notes.find((n) => n.id === activeId) ?? null;

  const scheduleSave = useCallback((note: NoteData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      window.numi.saveNote(note);
    }, AUTOSAVE_MS);
  }, []);

  const updateContent = useCallback(
    (content: string) => {
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id === activeId) {
            const updated = { ...n, content };
            scheduleSave(updated);
            return updated;
          }
          return n;
        }),
      );
    },
    [activeId, scheduleSave],
  );

  const createNote = useCallback(() => {
    window.numi.createNote().then((note) => {
      setNotes((prev) => [...prev, note]);
      setActiveId(note.id);
    });
  }, []);

  const closeNote = useCallback(
    (id: string) => {
      window.numi.deleteNote(id);
      setNotes((prev) => {
        const remaining = prev.filter((n) => n.id !== id);
        if (activeId === id && remaining.length > 0 && remaining[0]) {
          setActiveId(remaining[0].id);
        }
        return remaining;
      });
    },
    [activeId],
  );

  const renameNote = useCallback((id: string, title: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, title };
          window.numi.saveNote(updated);
          return updated;
        }
        return n;
      }),
    );
  }, []);

  return { notes, activeNote, activeId, setActiveId, updateContent, createNote, closeNote, renameNote };
}
