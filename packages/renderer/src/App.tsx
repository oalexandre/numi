import { useState, useCallback } from "react";
import type { LineResult } from "@engine/index";

import { EditorPane } from "./components/editor-pane";
import { ResultsPane } from "./components/results-pane";

export function App(): React.JSX.Element {
  const [results, setResults] = useState<LineResult[]>([]);
  const [scrollTop, setScrollTop] = useState(0);

  const handleChange = useCallback(async (text: string) => {
    const evaluated = await window.numi.evaluate(text);
    setResults(evaluated);
  }, []);

  const handleScroll = useCallback((top: number) => {
    setScrollTop(top);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <EditorPane onChange={handleChange} onScroll={handleScroll} />
      <ResultsPane results={results} scrollTop={scrollTop} />
    </div>
  );
}
