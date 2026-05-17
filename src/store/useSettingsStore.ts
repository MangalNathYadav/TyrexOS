import { create } from "zustand";

interface SettingsState {
  wallpaper: string;
  theme: "light" | "dark" | "cyberpunk" | "holographic";
  accentColor: string;
  username: string;
  setWallpaper: (wallpaper: string) => void;
  setTheme: (theme: "light" | "dark" | "cyberpunk" | "holographic") => void;
  setAccentColor: (color: string) => void;
  setUsername: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  wallpaper: "/wallpapers/tyrex-cold.png",
  theme: "light",
  accentColor: "#7c5dfa",
  username: "Tyrex User",

  setWallpaper: (wallpaper) => set({ wallpaper }),
  setTheme: (theme) => set({ theme }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setUsername: (username) => set({ username }),
}));
