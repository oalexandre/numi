import { useState, useEffect, useCallback } from "react";

export type Theme = "dark" | "light";

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    window.numi.getTheme().then(setTheme);
    window.numi.onThemeChanged(setTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    window.numi.toggleTheme().then(setTheme);
  }, []);

  return { theme, toggle };
}
