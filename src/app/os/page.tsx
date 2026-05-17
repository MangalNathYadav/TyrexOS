"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useWindowStore } from "@/store/useWindowStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useDesktopStore } from "@/store/useDesktopStore";
import { auth } from "@/lib/firebase";
import { appRegistry } from "@/core/app-manager/appRegistry";
import Window from "@/components/window/Window";
import Launcher from "@/components/launcher/Launcher";
import NotificationSystem from "@/components/notifications/NotificationSystem";
import { AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  LayoutGrid, 
  RefreshCw, 
  SlidersHorizontal, 
  FileText, 
  Sparkles, 
  MonitorCheck, 
  Plus
} from "lucide-react";

export default function OSDesktop() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const { windows, openWindow, focusWindow, clearClosedWindows } = useWindowStore();
  const { wallpaper, theme, accentColor, username } = useSettingsStore();
  const { addNotification } = useNotificationStore();
  const { iconPositions, updateIconPosition, arrangeIcons, loadPositions } = useDesktopStore();

  const [time, setTime] = useState(new Date());
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Desktop container reference for absolute coordinates
  const desktopRef = useRef<HTMLDivElement>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
    targetId?: string; // App ID if clicked on icon
  }>({ x: 0, y: 0, visible: false });

  // Auth Protection Redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Welcome notification
  useEffect(() => {
    if (user) {
      addNotification(`Welcome back, ${username}! System initialized.`, "success");
    }
  }, [user, username, addNotification]);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load coordinates and arrange default icon grids on start
  useEffect(() => {
    loadPositions();
  }, []);

  useEffect(() => {
    if (desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();
      const height = rect.height || 650;
      
      const saved = localStorage.getItem("tyrex_desktop_icon_positions");
      if (!saved || Object.keys(JSON.parse(saved)).length === 0) {
        arrangeIcons(height);
      }
    }
  }, [desktopRef.current]);

  const handleLogout = () => {
    auth.signOut();
  };

  // Drag and drop mechanics for desktop icons
  const handleIconDragStart = (e: React.MouseEvent, appId: string) => {
    if (e.button !== 0) return; // Left click drag only
    e.stopPropagation();

    const rect = desktopRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const initialX = iconPositions[appId]?.x ?? 20;
    const initialY = iconPositions[appId]?.y ?? 20;

    document.body.style.cursor = "grabbing";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      // Keep inside desktop viewport boundaries
      newX = Math.max(10, Math.min(newX, rect.width - 102));
      newY = Math.max(10, Math.min(newY, rect.height - 110));

      updateIconPosition(appId, newX, newY);
    };

    const handleMouseUp = () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Dynamic system launcher launcher
  const handleAppOpen = (id: string, title: string) => {
    openWindow(id, title);
  };

  // Custom Context Menu actions
  const handleContextMenu = (e: React.MouseEvent, targetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
      targetId,
    });
  };

  const handleRefreshDesktop = () => {
    setIsRefreshing(true);
    addNotification("Refreshing workspace and clearing background app cache pool...", "success");
    clearClosedWindows();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSortIcons = () => {
    if (desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();
      arrangeIcons(rect.height || 650);
      addNotification("Sorted icons vertically in left-aligned columns.", "success");
    }
  };

  // Close context menu on clicking window
  useEffect(() => {
    const closeMenu = () => setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // Find theme-specific classes or styles
  const getThemeStyles = () => {
    switch (theme) {
      case "light":
        return {
          "--color-cyber-blue": "#8b5cf6", // premium cold violet
          "--color-cyber-pink": "#ec4899",
          "--color-cyber-purple": "#a78bfa", // lavender violet
          "--color-glass-surface": "rgba(42, 38, 59, 0.55)", // mid-dark cold violet glass
          "--color-glass-border": "rgba(139, 92, 246, 0.3)", // subtle violet border
          "--color-desktop-bg": "linear-gradient(135deg, #1b1926 0%, #29243a 50%, #1e1b29 100%)", // premium mid-dark cold violet/slate gradient
          "--color-app-bg": "rgba(35, 31, 48, 0.96)", // matte mid-dark cold violet slate background
          "--color-app-text": "#f1f3f9", // soft white/silver text (perfectly readable, zero glare!)
          "--color-app-text-secondary": "#9fa4b8", // cool silver secondary text
          "--color-titlebar-bg": "rgba(48, 44, 68, 0.95)", // dark slate-violet titlebar
          "--color-input-bg": "rgba(22, 20, 31, 0.7)", // deep input background
        } as React.CSSProperties;
      case "holographic":
        return {
          "--color-cyber-blue": "#00f0ff",
          "--color-cyber-pink": "#ff0055",
          "--color-cyber-purple": "#bd00ff",
          "--color-glass-surface": "rgba(10, 25, 40, 0.3)",
          "--color-glass-border": "rgba(0, 240, 255, 0.2)",
          "--color-desktop-bg": "linear-gradient(to bottom right, #050508, #100a1c, #0a1526)",
          "--color-app-bg": "rgba(10, 25, 40, 0.9)",
          "--color-app-text": "#ffffff",
          "--color-app-text-secondary": "#9ca3af",
          "--color-titlebar-bg": "rgba(0, 0, 0, 0.6)",
          "--color-input-bg": "rgba(0, 0, 0, 0.4)",
        } as React.CSSProperties;
      case "cyberpunk":
        return {
          "--color-cyber-blue": "#00f0ff",
          "--color-cyber-pink": "#ff0055",
          "--color-cyber-purple": "#bd00ff",
          "--color-glass-surface": "rgba(20, 10, 30, 0.4)",
          "--color-glass-border": "rgba(255, 0, 85, 0.15)",
          "--color-desktop-bg": "linear-gradient(to bottom right, #050508, #100a1c, #0a1526)",
          "--color-app-bg": "rgba(20, 10, 30, 0.9)",
          "--color-app-text": "#ffffff",
          "--color-app-text-secondary": "#9ca3af",
          "--color-titlebar-bg": "rgba(0, 0, 0, 0.6)",
          "--color-input-bg": "rgba(0, 0, 0, 0.4)",
        } as React.CSSProperties;
      case "dark":
      default:
        return {
          "--color-cyber-blue": "#ffffff",
          "--color-cyber-pink": "#333333",
          "--color-cyber-purple": "#666666",
          "--color-glass-surface": "rgba(20, 20, 20, 0.6)",
          "--color-glass-border": "rgba(255, 255, 255, 0.1)",
          "--color-desktop-bg": "linear-gradient(to bottom right, #050508, #100a1c, #0a1526)",
          "--color-app-bg": "rgba(20, 20, 20, 0.95)",
          "--color-app-text": "#ffffff",
          "--color-app-text-secondary": "#9ca3af",
          "--color-titlebar-bg": "rgba(0, 0, 0, 0.6)",
          "--color-input-bg": "rgba(0, 0, 0, 0.4)",
        } as React.CSSProperties;
    }
  };

  return (
    <div
      style={{
        ...getThemeStyles(),
        "--color-cyber-blue": accentColor,
        backgroundImage: wallpaper ? `url(${wallpaper})` : undefined,
      } as React.CSSProperties}
      className={`h-screen w-full overflow-hidden bg-cover bg-center relative select-none font-sans transition-all duration-300 ${
        isRefreshing ? "brightness-95 animate-pulse" : ""
      }`}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      {/* Wallpapers Background */}
      <div 
        style={{ background: "var(--color-desktop-bg)" }}
        className="absolute inset-0 -z-10 transition-all duration-500"
      ></div>
      
      {/* Decorative cyber grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] -z-10"></div>

      {/* Desktop Workspace Drag Area */}
      <div
        ref={desktopRef}
        onClick={() => setLauncherOpen(false)}
        className="h-[calc(100vh-48px)] w-full relative z-10 overflow-hidden"
      >
        {/* Desktop Icons */}
        {appRegistry.map((app) => {
          const Icon = app.icon;
          const pos = iconPositions[app.id] || { x: 20, y: 20 };
          return (
            <div
              key={app.id}
              style={{
                position: "absolute",
                left: `${pos.x}px`,
                top: `${pos.y}px`,
              }}
              onMouseDown={(e) => handleIconDragStart(e, app.id)}
              onDoubleClick={() => handleAppOpen(app.id, app.title)}
              onContextMenu={(e) => handleContextMenu(e, app.id)}
              className="w-[92px] h-[86px] flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 hover:backdrop-blur-sm border border-transparent hover:border-[var(--color-glass-border)]/30 hover:shadow-lg transition-all duration-150 cursor-pointer group text-center select-none"
            >
              <div className="p-3 rounded-2xl bg-black/45 border border-[var(--color-glass-border)] shadow-md flex items-center justify-center relative group-hover:scale-105 transition-transform group-hover:bg-[var(--color-cyber-blue)]/5 group-hover:border-[var(--color-cyber-blue)]/30 duration-200">
                <Icon className="h-5.5 w-5.5 text-[var(--color-cyber-blue)] group-hover:text-white transition-colors" />
                {app.status !== "active" && (
                  <div className="absolute -bottom-1 -right-1 text-[8px] bg-[var(--color-cyber-pink)] text-white px-1 py-0.5 rounded font-mono font-bold leading-none scale-75">
                    LOCK
                  </div>
                )}
              </div>
              <span className="text-[10px] leading-tight font-mono font-semibold text-gray-200 group-hover:text-white tracking-wide whitespace-normal break-words line-clamp-2 w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-0.5 select-none">
                {app.title}
              </span>
            </div>
          );
        })}

        {/* Windows Rendering */}
        <AnimatePresence>
          {windows.map((win) => {
            const registryApp = appRegistry.find((a) => a.id === win.appId);
            if (!registryApp) return null;
            const AppComponent = registryApp.component;

            return (
              <Window key={win.id} windowState={win}>
                <AppComponent />
              </Window>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Start Menu / App Launcher */}
      <Launcher isOpen={launcherOpen} onClose={() => setLauncherOpen(false)} />

      {/* Notification Toast Hub */}
      <NotificationSystem />

      {/* Custom Context Menu (Right Click System) */}
      {contextMenu.visible && (
        <div
          style={{
            position: "fixed",
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          className="w-48 bg-[var(--color-app-bg)]/95 backdrop-blur-xl border border-[var(--color-glass-border)] rounded-xl py-1.5 z-[999999] shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.targetId ? (
            // App-specific context options
            <>
              <button
                onClick={() => {
                  const app = appRegistry.find((a) => a.id === contextMenu.targetId);
                  if (app) handleAppOpen(app.id, app.title);
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[var(--color-app-text)] hover:bg-[var(--color-cyber-blue)] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Launch App node
              </button>
              <button
                onClick={() => {
                  const app = appRegistry.find((a) => a.id === contextMenu.targetId);
                  if (app) {
                    addNotification(`${app.title} module version v1.0.0. Spec: ${app.description}`, "success");
                  }
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[var(--color-app-text)] hover:bg-[var(--color-cyber-blue)] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MonitorCheck className="h-3.5 w-3.5" />
                App Specification
              </button>
            </>
          ) : (
            // Desktop context options
            <>
              <button
                onClick={() => {
                  handleRefreshDesktop();
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[var(--color-app-text)] hover:bg-[var(--color-cyber-blue)] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh Workspace
              </button>
              <button
                onClick={() => {
                  handleSortIcons();
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[var(--color-app-text)] hover:bg-[var(--color-cyber-blue)] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Sort Desktop Icons
              </button>
              <div className="border-t border-[var(--color-glass-border)]/50 my-1"></div>
              <button
                onClick={() => {
                  handleAppOpen("settings", "Settings");
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[var(--color-app-text)] hover:bg-[var(--color-cyber-blue)] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                System Environment
              </button>
              <button
                onClick={() => {
                  handleAppOpen("notes", "Notes");
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[var(--color-app-text)] hover:bg-[var(--color-cyber-blue)] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                Create New Notebook
              </button>
              <div className="border-t border-[var(--color-glass-border)]/50 my-1"></div>
              <button
                onClick={() => {
                  handleLogout();
                  setContextMenu((prev) => ({ ...prev, visible: false }));
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect Session
              </button>
            </>
          )}
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 w-full h-12 glass border-t border-[var(--color-glass-border)] flex items-center justify-between px-4 z-[99999]">
        {/* Launcher Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLauncherOpen(!launcherOpen);
          }}
          className={`h-8 w-8 rounded flex items-center justify-center hover:bg-white/10 transition-colors group ${
            launcherOpen ? "bg-[var(--color-cyber-blue)]/10 border border-[var(--color-cyber-blue)]/50" : ""
          }`}
        >
          <LayoutGrid className="text-[var(--color-app-text)] group-hover:text-[var(--color-cyber-blue)] transition-colors h-5 w-5" />
        </button>

        {/* Open Task Nodes Area */}
        <div className="flex-1 flex items-center justify-center gap-3 px-4 h-full">
          {windows.filter(win => !win.closed).map((win) => {
            const registryApp = appRegistry.find((a) => a.id === win.appId);
            if (!registryApp) return null;
            const Icon = registryApp.icon;

            return (
              <button
                key={win.id}
                onClick={() => focusWindow(win.id)}
                className={`h-9 w-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all relative border ${
                  win.focused
                    ? "border-[var(--color-cyber-blue)]/30 bg-[var(--color-cyber-blue)]/10"
                    : "border-transparent"
                }`}
                title={win.title}
              >
                <Icon className={`h-5 w-5 ${win.focused ? "text-[var(--color-app-text)]" : "text-[var(--color-app-text-secondary)] hover:text-[var(--color-app-text)]"}`} />
                <div
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all ${
                    win.minimized
                      ? "bg-gray-500 scale-75"
                      : "bg-[var(--color-cyber-blue)] shadow-[0_0_8px_rgba(124,93,250,0.8)]"
                  }`}
                ></div>
              </button>
            );
          })}
        </div>

        {/* Clock Tray */}
        <div className="flex items-center gap-5 text-sm text-[var(--color-app-text-secondary)]">
          <button
            onClick={handleLogout}
            className="hover:text-[var(--color-cyber-pink)] transition-colors p-1.5 rounded hover:bg-white/5 text-[var(--color-app-text)]"
            title="Disconnect Terminal session"
          >
            <LogOut className="h-4 w-4" />
          </button>
          
          <div className="flex flex-col items-end leading-none font-mono select-none">
            <span className="text-xs font-bold text-[var(--color-app-text)]">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[9px] text-[var(--color-app-text-secondary)] font-semibold mt-1">
              {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
