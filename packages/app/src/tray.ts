import { join } from "node:path";

import { Tray, Menu, app, BrowserWindow, nativeImage } from "electron";

let tray: Tray | null = null;

function getTrayIconPath(): string {
  // Use a template image on macOS (automatically adapts to dark/light menu bar)
  const iconName = process.platform === "darwin" ? "tray-icon-Template.png" : "tray-icon.png";
  return join(import.meta.dirname, "../../resources", iconName);
}

export function createTray(getWindow: () => BrowserWindow | null): void {
  const iconPath = getTrayIconPath();
  let icon: Electron.NativeImage;

  try {
    icon = nativeImage.createFromPath(iconPath);
  } catch {
    // No icon file yet — create a simple empty icon
    icon = nativeImage.createEmpty();
  }

  if (icon.isEmpty()) {
    // Create a minimal 16x16 icon
    icon = nativeImage.createFromBuffer(Buffer.alloc(16 * 16 * 4, 0), {
      width: 16,
      height: 16,
    });
  }

  tray = new Tray(icon);
  tray.setToolTip("Numi Calculator");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        const win = getWindow();
        if (win) {
          win.show();
          win.focus();
        }
      },
    },
    {
      label: "Hide",
      click: () => {
        const win = getWindow();
        if (win) win.hide();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    const win = getWindow();
    if (win) {
      if (win.isVisible()) {
        win.focus();
      } else {
        win.show();
        win.focus();
      }
    }
  });
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
