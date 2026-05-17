import { create } from "zustand";

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  zIndex: number;
  closed?: boolean;
}

interface WindowStore {
  windows: WindowState[];
  maxZIndex: number;
  openWindow: (appId: string, title: string) => void;
  closeWindow: (id: string) => void;
  clearClosedWindows: () => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  maxZIndex: 10,

  openWindow: (appId, title) => {
    const { windows, maxZIndex } = get();
    // Check if window is already open or cached in memory
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      // If minimized or closed, restore it. Always focus it.
      get().focusWindow(existing.id);
      set({
        windows: windows.map((w) =>
          w.id === existing.id ? { ...w, closed: false, minimized: false } : w
        ),
      });
      return;
    }

    const nextZ = maxZIndex + 1;
    
    let defaultWidth = 600;
    let defaultHeight = 400;

    if (appId === "calculator") {
      defaultWidth = 320;
      defaultHeight = 460;
    } else if (appId === "taskmanager") {
      defaultWidth = 550;
      defaultHeight = 420;
    } else if (appId === "notes") {
      defaultWidth = 780;
      defaultHeight = 480;
    } else if (appId === "terminal") {
      defaultWidth = 650;
      defaultHeight = 420;
    }

    const newWindow: WindowState = {
      id: `${appId}_${Date.now()}`,
      appId,
      title,
      x: 100 + (windows.length * 35) % 220,
      y: 80 + (windows.length * 35) % 170,
      width: defaultWidth,
      height: defaultHeight,
      minimized: false,
      maximized: false,
      focused: true,
      zIndex: nextZ,
      closed: false,
    };

    set({
      windows: [...windows.map((w) => ({ ...w, focused: false })), newWindow],
      maxZIndex: nextZ,
    });
  },

  closeWindow: (id) => {
    // Instead of filtering it out, we mark it as closed: true to cache its DOM and iframe state
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, closed: true, focused: false } : w
      ),
    }));
  },

  clearClosedWindows: () => {
    // Hard refresh to fully clear the DOM app cache pool
    set((state) => ({
      windows: state.windows.filter((w) => !w.closed),
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true, focused: false } : w
      ),
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    }));
  },

  focusWindow: (id) => {
    const { windows, maxZIndex } = get();
    const target = windows.find((w) => w.id === id);
    if (!target || (target.focused && !target.closed)) return;

    const nextZ = maxZIndex + 1;
    set({
      windows: windows.map((w) =>
        w.id === id
          ? { ...w, focused: true, minimized: false, closed: false, zIndex: nextZ }
          : { ...w, focused: false }
      ),
      maxZIndex: nextZ,
    });
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  },

  updateWindowSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, width, height } : w)),
    }));
  },
}));
