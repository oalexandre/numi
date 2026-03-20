import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { app } from "electron";

export interface NoteData {
  id: string;
  title: string;
  content: string;
}

function getNotesDir(): string {
  return join(app.getPath("userData"), "notes");
}

function ensureNotesDir(): void {
  const dir = getNotesDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function loadAllNotes(): NoteData[] {
  ensureNotesDir();
  const dir = getNotesDir();
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    const defaultNote: NoteData = { id: generateId(), title: "Untitled", content: "" };
    saveNote(defaultNote);
    return [defaultNote];
  }

  return files
    .map((file) => {
      try {
        const data = readFileSync(join(dir, file), "utf-8");
        return JSON.parse(data) as NoteData;
      } catch {
        return null;
      }
    })
    .filter((n): n is NoteData => n !== null);
}

export function saveNote(note: NoteData): void {
  ensureNotesDir();
  const filePath = join(getNotesDir(), `${note.id}.json`);
  writeFileSync(filePath, JSON.stringify(note, null, 2), "utf-8");
}

export function deleteNote(id: string): void {
  const filePath = join(getNotesDir(), `${id}.json`);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export { generateId };
