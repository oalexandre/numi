import { useState, useCallback } from "react";

interface NoteTab {
  id: string;
  title: string;
}

interface TabBarProps {
  notes: NoteTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onClose: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function TabBar({
  notes,
  activeId,
  onSelect,
  onCreate,
  onClose,
  onRename,
}: TabBarProps): React.JSX.Element {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startRename = useCallback(
    (id: string, currentTitle: string) => {
      setEditingId(id);
      setEditValue(currentTitle);
    },
    [],
  );

  const finishRename = useCallback(() => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  }, [editingId, editValue, onRename]);

  return (
    <div
      className="flex items-center gap-0.5 overflow-x-auto px-2"
      style={{
        height: "32px",
        background: "var(--bg-results)",
        borderTop: "1px solid var(--border)",
        fontSize: "12px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex items-center gap-1 shrink-0 cursor-pointer select-none"
          style={{
            padding: "4px 10px",
            borderRadius: "4px 4px 0 0",
            background: note.id === activeId ? "var(--bg-primary)" : "transparent",
            color: note.id === activeId ? "var(--text-primary)" : "var(--text-muted)",
          }}
          onClick={() => onSelect(note.id)}
          onDoubleClick={() => startRename(note.id, note.title)}
          onAuxClick={(e) => {
            if (e.button === 1 && notes.length > 1) onClose(note.id);
          }}
        >
          {editingId === note.id ? (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={finishRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") finishRename();
                if (e.key === "Escape") setEditingId(null);
              }}
              autoFocus
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "inherit",
                fontSize: "inherit",
                fontFamily: "inherit",
                width: "80px",
              }}
            />
          ) : (
            <span>{note.title}</span>
          )}
          {notes.length > 1 && (
            <span
              className="opacity-0 hover:opacity-100"
              style={{ marginLeft: "4px", fontSize: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                onClose(note.id);
              }}
            >
              ×
            </span>
          )}
        </div>
      ))}
      <button
        onClick={onCreate}
        className="shrink-0 cursor-pointer"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          fontSize: "16px",
          padding: "2px 8px",
          lineHeight: 1,
        }}
        title="New note"
      >
        +
      </button>
    </div>
  );
}
