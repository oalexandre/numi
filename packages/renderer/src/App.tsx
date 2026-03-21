import { useState, useCallback, useEffect, useRef } from "react";

import { toPng } from "html-to-image";

import logoSvg from "../../../assets/logo.svg";

import { EditorPane } from "./components/editor-pane";
import { HelpPanel } from "./components/help-panel";
import { ResultsPane } from "./components/results-pane";
import { SettingsPanel } from "./components/settings-panel";
import { TabBar } from "./components/tab-bar";
import { useEngine } from "./hooks/use-engine";
import { useNotes } from "./hooks/use-notes";
import { useTheme } from "./hooks/use-theme";

export function App(): React.JSX.Element {
  const { toggle } = useTheme();
  const { results, evaluate } = useEngine();
  const { notes, activeNote, activeId, setActiveId, updateContent, createNote, closeNote, renameNote } =
    useNotes();
  const [scrollTop, setScrollTop] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Capture initial content only when switching notes — not on every keystroke
  const initialContentRef = useRef(activeNote?.content ?? "");
  const prevActiveIdRef = useRef(activeId);
  if (prevActiveIdRef.current !== activeId) {
    initialContentRef.current = activeNote?.content ?? "";
    prevActiveIdRef.current = activeId;
  }

  const handleChange = useCallback(
    (text: string) => {
      updateContent(text);
      evaluate(text);
    },
    [updateContent, evaluate],
  );

  const handleScroll = useCallback((top: number) => {
    setScrollTop(top);
  }, []);

  const handleShare = useCallback(async () => {
    const node = contentRef.current;
    if (!node) return;

    const pixelRatio = 2;
    const dataUrl = await toPng(node, { pixelRatio });

    // Load captured image
    const img = new Image();
    img.src = dataUrl;
    await new Promise((r) => (img.onload = r));

    // Load logo
    const logo = new Image();
    logo.src = logoSvg;
    await new Promise((r) => (logo.onload = r));

    // Draw on canvas with branding
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    // Branding on the gray titlebar strip, vertically centered
    const stripHeight = 38 * pixelRatio;
    const logoSize = 16 * pixelRatio;
    const marginLeft = 80 * pixelRatio; // past macOS traffic lights
    const gap = 6 * pixelRatio;
    const fontSize = 11 * pixelRatio;

    const x = marginLeft;
    const y = (stripHeight - logoSize) / 2;

    // Draw logo
    ctx.drawImage(logo, x, y, logoSize, logoSize);

    // Draw text — dark color to match the gray strip
    ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
    ctx.fillStyle = "rgba(30, 30, 50, 0.7)";
    ctx.textBaseline = "middle";
    ctx.fillText("Created by Ilumi", x + logoSize + gap, y + logoSize / 2);

    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (!blob) return;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  }, []);

  // Menu keyboard shortcut handlers
  useEffect(() => {
    window.numi.onNewNote(() => createNote());
    window.numi.onCloseNote(() => {
      if (notes.length > 1) closeNote(activeId);
    });
    window.numi.onToggleTheme(() => toggle());
    window.numi.onCopyAllResults(() => {
      const text = results
        .filter((r) => r.formatted)
        .map((r) => r.formatted)
        .join("\n");
      if (text) navigator.clipboard.writeText(text);
    });
  }, [createNote, closeNote, activeId, notes.length, toggle, results]);

  // Cmd/Ctrl+, for settings
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        setShowSettings((v) => !v);
      }
      if (e.key === "Escape") {
        if (showSettings) setShowSettings(false);
        if (showHelp) setShowHelp(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showSettings, showHelp]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div className="titlebar-drag-region" />
      <div ref={contentRef} className="flex flex-1 overflow-hidden app-content">
        <EditorPane
          key={activeId}
          initialContent={initialContentRef.current}
          onChange={handleChange}
          onScroll={handleScroll}
        />
        <ResultsPane results={results} scrollTop={scrollTop} />
      </div>
      <TabBar
        notes={notes}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createNote}
        onClose={closeNote}
        onRename={renameNote}
        onShare={handleShare}
        onHelp={() => setShowHelp(true)}
      />
      <SettingsPanel visible={showSettings} onClose={() => setShowSettings(false)} />
      <HelpPanel visible={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
