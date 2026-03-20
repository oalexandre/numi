import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";

interface EditorPaneProps {
  onChange: (text: string) => void;
  onScroll: (scrollTop: number) => void;
}

export function EditorPane({ onChange, onScroll }: EditorPaneProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleUpdate = useCallback(
    (update: { docChanged: boolean; state: EditorState; view: EditorView }) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
      const scrollTop = update.view.scrollDOM.scrollTop;
      onScroll(scrollTop);
    },
    [onChange, onScroll],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: "",
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of(handleUpdate),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    const scroller = view.scrollDOM;
    const scrollHandler = () => onScroll(scroller.scrollTop);
    scroller.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      scroller.removeEventListener("scroll", scrollHandler);
      view.destroy();
    };
  }, [handleUpdate, onScroll]);

  return (
    <div
      ref={containerRef}
      className="flex-[0_0_60%] overflow-hidden"
      style={{ background: "var(--bg-editor)" }}
    />
  );
}
