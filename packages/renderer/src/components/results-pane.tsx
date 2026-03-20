import { useRef, useEffect } from "react";
import type { LineResult } from "@engine/index";

interface ResultsPaneProps {
  results: LineResult[];
  scrollTop: number;
}

export function ResultsPane({ results, scrollTop }: ResultsPaneProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div
      ref={containerRef}
      className="flex-[0_0_40%] overflow-hidden"
      style={{
        background: "var(--bg-results)",
        borderLeft: "1px solid var(--border)",
      }}
    >
      <div style={{ padding: "16px", paddingBottom: "50vh" }}>
        {results.map((result) => (
          <div
            key={result.line}
            className="cursor-pointer select-none"
            style={{
              lineHeight: "1.6",
              minHeight: "1.6em",
              textAlign: "right",
              paddingRight: "8px",
            }}
            title={result.formatted || undefined}
            onClick={() => {
              if (result.formatted) {
                navigator.clipboard.writeText(result.formatted);
              }
            }}
          >
            {result.error ? (
              <span style={{ color: "var(--text-error)", fontSize: "12px", opacity: 0.7 }}>
                {result.error}
              </span>
            ) : (
              <span style={{ color: "var(--text-result)" }}>{result.formatted}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
