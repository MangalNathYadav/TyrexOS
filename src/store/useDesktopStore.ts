import { create } from "zustand";
import { appRegistry } from "@/core/app-manager/appRegistry";

interface IconPosition {
  x: number;
  y: number;
}

interface DesktopState {
  iconPositions: Record<string, IconPosition>;
  updateIconPosition: (id: string, x: number, y: number) => void;
  arrangeIcons: (containerHeight?: number) => void;
  loadPositions: () => void;
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  iconPositions: {},

  updateIconPosition: (id, x, y) => {
    set((state) => {
      const updated = {
        ...state.iconPositions,
        [id]: { x: Math.round(x), y: Math.round(y) },
      };
      // Persist to local storage
      localStorage.setItem("tyrex_desktop_icon_positions", JSON.stringify(updated));
      return { iconPositions: updated };
    });
  },

  arrangeIcons: (containerHeight = 700) => {
    const startX = 20;
    const startY = 20;
    const itemWidth = 104; // w-24 (96px) + gap
    const itemHeight = 96; // icon height + gap
    const maxRows = Math.max(1, Math.floor((containerHeight - 40) / itemHeight));

    const newPositions: Record<string, IconPosition> = {};
    
    appRegistry.forEach((app, idx) => {
      const col = Math.floor(idx / maxRows);
      const row = idx % maxRows;
      newPositions[app.id] = {
        x: startX + col * itemWidth,
        y: startY + row * itemHeight,
      };
    });

    localStorage.setItem("tyrex_desktop_icon_positions", JSON.stringify(newPositions));
    set({ iconPositions: newPositions });
  },

  loadPositions: () => {
    const saved = localStorage.getItem("tyrex_desktop_icon_positions");
    if (saved) {
      try {
        set({ iconPositions: JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse desktop icon positions", e);
      }
    }
  },
}));
