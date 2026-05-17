"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Monitor, Palette, User, Info, Check, Image as ImageIcon, Sparkles } from "lucide-react";

export default function SettingsApp() {
  const {
    wallpaper,
    theme,
    accentColor,
    username,
    setWallpaper,
    setTheme,
    setAccentColor,
    setUsername,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<"identity" | "display" | "theme" | "about">("identity");
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState("");
  const [customHexColor, setCustomHexColor] = useState(accentColor);
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  // Sync avatar to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tyrex_avatar_index");
    if (saved) {
      setSelectedAvatar(parseInt(saved, 10));
    }
  }, []);

  const handleAvatarSelect = (idx: number) => {
    setSelectedAvatar(idx);
    localStorage.setItem("tyrex_avatar_index", idx.toString());
  };

  const handleApplyCustomWallpaper = () => {
    if (customWallpaperUrl.trim()) {
      setWallpaper(customWallpaperUrl.trim());
    }
  };

  const handleApplyCustomColor = () => {
    if (/^#[0-9A-F]{6}$/i.test(customHexColor)) {
      setAccentColor(customHexColor);
    }
  };

  const wallpapers = [
    { name: "Tyrex Cold", url: "/wallpapers/tyrex-cold.png", bg: "from-slate-900 via-violet-950 to-neutral-900" },
    { name: "Tokyo Neon", url: "/wallpapers/tokyo-neon.jpg", bg: "from-fuchsia-950 via-purple-900 to-indigo-950" },
    { name: "Cyber City", url: "/wallpapers/cyber-city.jpg", bg: "from-pink-950 via-slate-900 to-emerald-950" },
    { name: "Solar Core", url: "/wallpapers/solar-core.jpg", bg: "from-orange-950 via-stone-900 to-yellow-950" },
  ];

  const themes: Array<"light" | "dark" | "cyberpunk" | "holographic"> = [
    "light",
    "dark",
    "cyberpunk",
    "holographic",
  ];

  const accents = ["#7c5dfa", "#00f0ff", "#bd00ff", "#ff0055", "#00ff66"];

  const avatars = [
    { name: "Cyber Ninja", gradient: "from-cyan-500 to-blue-600" },
    { name: "Synth Wave", gradient: "from-fuchsia-500 to-pink-600" },
    { name: "Matrix Core", gradient: "from-emerald-400 to-teal-600" },
    { name: "Solar Flares", gradient: "from-amber-400 to-rose-600" },
  ];

  return (
    <div className="flex h-full bg-[var(--color-app-bg)] text-[var(--color-app-text)] rounded-b-lg overflow-hidden font-sans">
      {/* Settings Navigation Sidebar */}
      <div className="w-56 border-r border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/30 flex flex-col p-4 space-y-1.5">
        <span className="text-[10px] font-mono tracking-widest text-[var(--color-app-text-secondary)] uppercase pl-2 mb-2 block font-bold">
          Preference Panel
        </span>
        
        <button
          onClick={() => setActiveTab("identity")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === "identity"
              ? "bg-[var(--color-cyber-blue)]/15 text-[var(--color-cyber-blue)] border border-[var(--color-cyber-blue)]/20"
              : "hover:bg-[var(--color-input-bg)]/50 text-[var(--color-app-text-secondary)] border border-transparent"
          }`}
        >
          <User className="h-4 w-4" />
          <span>User Identity</span>
        </button>

        <button
          onClick={() => setActiveTab("display")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === "display"
              ? "bg-[var(--color-cyber-blue)]/15 text-[var(--color-cyber-blue)] border border-[var(--color-cyber-blue)]/20"
              : "hover:bg-[var(--color-input-bg)]/50 text-[var(--color-app-text-secondary)] border border-transparent"
          }`}
        >
          <Monitor className="h-4 w-4" />
          <span>Desktop Display</span>
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === "theme"
              ? "bg-[var(--color-cyber-blue)]/15 text-[var(--color-cyber-blue)] border border-[var(--color-cyber-blue)]/20"
              : "hover:bg-[var(--color-input-bg)]/50 text-[var(--color-app-text-secondary)] border border-transparent"
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>Theme & Accent</span>
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === "about"
              ? "bg-[var(--color-cyber-blue)]/15 text-[var(--color-cyber-blue)] border border-[var(--color-cyber-blue)]/20"
              : "hover:bg-[var(--color-input-bg)]/50 text-[var(--color-app-text-secondary)] border border-transparent"
          }`}
        >
          <Info className="h-4 w-4" />
          <span>About TyrexOS</span>
        </button>
      </div>

      {/* Settings Properties Panel Viewer */}
      <div className="flex-1 p-6 overflow-y-auto bg-[var(--color-input-bg)]/5 flex flex-col gap-6">
        {/* Tab 1: User Identity */}
        {activeTab === "identity" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--color-app-text)] font-sans">User Identity Profile</h3>
              <p className="text-xs text-[var(--color-app-text-secondary)] mt-1 font-mono">Configure your custom avatar badge and system administrator name.</p>
            </div>

            {/* Profile Avatar Selection Cards */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] font-semibold block">Select Neon Badge</span>
              <div className="grid grid-cols-4 gap-3">
                {avatars.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAvatarSelect(idx)}
                    className={`aspect-square w-full rounded-2xl border bg-gradient-to-br ${av.gradient} flex items-center justify-center p-2 transition-all relative group cursor-pointer active:scale-95 ${
                      selectedAvatar === idx
                        ? "border-[var(--color-app-text)] scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : "border-[var(--color-glass-border)] opacity-60 hover:opacity-100"
                    }`}
                  >
                    {selectedAvatar === idx && (
                      <div className="absolute top-2 right-2 bg-white/20 rounded-full p-0.5 border border-white/30 backdrop-blur">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-black/40 px-2 py-0.5 rounded text-white truncate max-w-full">
                      {av.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* User credentials */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] font-semibold block">Administrator Name</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full max-w-md bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-sm text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-cyber-blue)]/50 transition-colors shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Desktop Display */}
        {activeTab === "display" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--color-app-text)] font-sans">Desktop Display</h3>
              <p className="text-xs text-[var(--color-app-text-secondary)] mt-1 font-mono">Manage default wallpapers or load customized graphical display links.</p>
            </div>

            {/* Wallpaper selector grid */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] font-semibold block">Pre-installed Wallpapers</span>
              <div className="grid grid-cols-2 gap-4">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.url}
                    onClick={() => setWallpaper(wp.url)}
                    className={`aspect-video w-full rounded-2xl border flex flex-col justify-end p-3 transition-all overflow-hidden relative group cursor-pointer active:scale-[0.98] ${
                      wallpaper === wp.url
                        ? "border-[var(--color-cyber-blue)] shadow-[0_0_15px_rgba(0,183,255,0.15)]"
                        : "border-[var(--color-glass-border)] hover:border-[var(--color-app-text-secondary)]"
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${wp.bg} group-hover:scale-105 transition-transform -z-10`} />
                    {wallpaper === wp.url && (
                      <div className="absolute top-3 right-3 bg-[var(--color-cyber-blue)] rounded-full p-1 border border-white/20 shadow-md">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <span className="text-[10px] uppercase font-mono tracking-widest bg-black/60 px-2 py-0.5 rounded text-white truncate max-w-full">
                      {wp.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom online image wallpaper link */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] font-semibold block">Apply Custom Image Link (URL)</span>
              <div className="flex gap-3 max-w-lg">
                <input
                  type="text"
                  placeholder="https://example.com/wallpaper.jpg"
                  value={customWallpaperUrl}
                  onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                  className="flex-1 bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-xs text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-cyber-blue)]/50 shadow-inner"
                />
                <button
                  onClick={handleApplyCustomWallpaper}
                  disabled={!customWallpaperUrl.trim()}
                  className="px-4 py-2 bg-[var(--color-cyber-blue)] hover:bg-[var(--color-cyber-blue)]/80 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all cursor-pointer text-xs font-semibold flex items-center gap-1 active:scale-95 shadow-[0_0_10px_rgba(0,183,255,0.15)]"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Themes & Accents */}
        {activeTab === "theme" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--color-app-text)] font-sans">Themes & Custom Accents</h3>
              <p className="text-xs text-[var(--color-app-text-secondary)] mt-1 font-mono">Alter system layout themes and customize visual accents.</p>
            </div>

            {/* Theme cards selection */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] font-semibold block">Theme Signature</span>
              <div className="grid grid-cols-2 gap-4">
                {themes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`border p-4 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden group active:scale-[0.98] ${
                      theme === t
                        ? "border-[var(--color-cyber-blue)] bg-[var(--color-cyber-blue)]/10 text-[var(--color-cyber-blue)] shadow-[0_0_15px_rgba(0,183,255,0.1)]"
                        : "border-[var(--color-glass-border)] hover:bg-[var(--color-input-bg)]/40 hover:border-[var(--color-app-text-secondary)]"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold uppercase tracking-wider font-mono">
                        {t}
                      </span>
                      {theme === t && (
                        <div className="bg-[var(--color-cyber-blue)] rounded-full p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--color-app-text-secondary)] block font-mono">
                      {t === "light" && "Premium cold violet & soft lavender default template"}
                      {t === "dark" && "Classic neon space backdrops and dark surfaces"}
                      {t === "cyberpunk" && "Industrial high-contrast yellow & cyan accent styling"}
                      {t === "holographic" && "Translucent glass frosting and ambient backing glows"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Predefined Accents */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] font-semibold block">Accent Swatches</span>
              <div className="flex gap-4">
                {accents.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    style={{ backgroundColor: color }}
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer relative flex items-center justify-center ${
                      accentColor === color ? "border-[var(--color-app-text)] shadow-md" : "border-transparent"
                    }`}
                  >
                    {accentColor === color && (
                      <Check className="h-4 w-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom hex accent color */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] font-semibold block">Custom Accent Hex Code</span>
              <div className="flex gap-3 max-w-sm">
                <div 
                  style={{ backgroundColor: customHexColor }} 
                  className="h-9 w-9 rounded-xl border border-[var(--color-glass-border)] shadow"
                />
                <input
                  type="text"
                  maxLength={7}
                  placeholder="#00ffff"
                  value={customHexColor}
                  onChange={(e) => setCustomHexColor(e.target.value)}
                  className="flex-1 bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-xs text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-cyber-blue)]/50 shadow-inner font-mono"
                />
                <button
                  onClick={handleApplyCustomColor}
                  disabled={!/^#[0-9A-F]{6}$/i.test(customHexColor)}
                  className="px-4 py-2 bg-[var(--color-cyber-blue)] hover:bg-[var(--color-cyber-blue)]/80 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all cursor-pointer text-xs font-semibold flex items-center gap-1 active:scale-95 shadow-[0_0_10px_rgba(0,183,255,0.15)]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: About OS */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--color-app-text)] font-sans">About TyrexOS</h3>
              <p className="text-xs text-[var(--color-app-text-secondary)] mt-1 font-mono">Detailed system properties and diagnostic specifications.</p>
            </div>

            <div className="border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3 border-b border-[var(--color-glass-border)] pb-3">
                <Sparkles className="h-8 w-8 text-[var(--color-cyber-blue)] animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-base font-bold font-mono tracking-widest text-[var(--color-app-text)] uppercase">
                    TYREX OS
                  </span>
                  <span className="text-[10px] text-[var(--color-app-text-secondary)] font-mono">
                    Version 1.0.0 (Holographic Production Release)
                  </span>
                </div>
              </div>

              {/* Grid lists */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs font-mono">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--color-app-text-secondary)] uppercase font-bold tracking-wider">Kernels</span>
                  <span className="text-[var(--color-app-text)] font-medium">Zustand & Motion Hybrid</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--color-app-text-secondary)] uppercase font-bold tracking-wider">Platform</span>
                  <span className="text-[var(--color-app-text)] font-medium">Next.js App Router Node</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--color-app-text-secondary)] uppercase font-bold tracking-wider">Host Profile</span>
                  <span className="text-[var(--color-app-text)] font-medium">{username} (System Admin)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--color-app-text-secondary)] uppercase font-bold tracking-wider">Memory Allocation</span>
                  <span className="text-[var(--color-app-text)] font-medium">Virtual 1024 MB (Dynamic Spawning)</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-[10px] text-[var(--color-app-text-secondary)] uppercase font-bold tracking-wider">Credits & Copyright</span>
                  <span className="text-[var(--color-app-text-secondary)] mt-0.5 leading-relaxed">
                    Designed and built dynamically for Mangal Nath Yadav. Powered by framer-motion springs, Tailwind CSS, and custom lucide graphics components.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
