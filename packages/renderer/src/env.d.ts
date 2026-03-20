import type { LineResult } from "@engine/index";

interface NumiApi {
  evaluate: (document: string) => Promise<LineResult[]>;
  getTheme: () => Promise<"dark" | "light">;
  setTheme: (theme: "auto" | "dark" | "light") => Promise<"dark" | "light">;
  toggleTheme: () => Promise<"dark" | "light">;
  onThemeChanged: (callback: (theme: "dark" | "light") => void) => void;
}

declare global {
  interface Window {
    numi: NumiApi;
  }
}
