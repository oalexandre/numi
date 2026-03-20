import { contextBridge, ipcRenderer } from "electron";
import type { LineResult } from "@engine/index";

export const numiApi = {
  evaluate: (document: string): Promise<LineResult[]> => {
    return ipcRenderer.invoke("numi:evaluate", document);
  },
  getTheme: (): Promise<"dark" | "light"> => {
    return ipcRenderer.invoke("numi:getTheme");
  },
  setTheme: (theme: "auto" | "dark" | "light"): Promise<"dark" | "light"> => {
    return ipcRenderer.invoke("numi:setTheme", theme);
  },
  toggleTheme: (): Promise<"dark" | "light"> => {
    return ipcRenderer.invoke("numi:toggleTheme");
  },
  onThemeChanged: (callback: (theme: "dark" | "light") => void): void => {
    ipcRenderer.on("numi:themeChanged", (_event, theme: "dark" | "light") => {
      callback(theme);
    });
  },
};

contextBridge.exposeInMainWorld("numi", numiApi);
