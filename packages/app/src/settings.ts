import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

import { app } from "electron";

export interface AppSettings {
  theme?: "auto" | "dark" | "light";
}

function getSettingsPath(): string {
  return join(app.getPath("userData"), "settings.json");
}

export function loadSettings(): AppSettings {
  const path = getSettingsPath();
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf-8")) as AppSettings;
    }
  } catch {
    // Corrupted settings — return defaults
  }
  return {};
}

export function saveSettings(settings: AppSettings): void {
  const path = getSettingsPath();
  try {
    const dir = dirname(path);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(path, JSON.stringify(settings, null, 2), "utf-8");
  } catch {
    // Cannot save — ignore
  }
}

export function saveSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
  const settings = loadSettings();
  settings[key] = value;
  saveSettings(settings);
}
