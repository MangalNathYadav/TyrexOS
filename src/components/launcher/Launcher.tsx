"use client";

import { useState } from "react";
import { Search, LogOut, Power, User } from "lucide-react";
import { appRegistry } from "@/core/app-manager/appRegistry";
import { useWindowStore } from "@/store/useWindowStore";
import { useSettingsStore } from "@/store/useSettingsStore";

interface LauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Launcher({ isOpen, onClose }: LauncherProps) {
  const [search, setSearch] = useState("");
  const { openWindow } = useWindowStore();
  const { username } = useSettingsStore();

  if (!isOpen) return null;

  const filteredApps = appRegistry.filter((app) =>
    app.title.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    if (!name) return "TX";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleAppLaunch = (id: string, title: string) => {
    openWindow(id, title);
    onClose();
  };

  const handleSystemShutdown = () => {
    // Clear credentials and force page reload to trigger login
    localStorage.removeItem("tyrex_auth_bypass");
    window.location.reload();
  };

  return (
    <div 
      className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[520px] max-h-[540px] glass-panel rounded-2xl flex flex-col z-[9999] shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-[var(--color-glass-border)] animate-in slide-in-from-bottom-8 fade-in duration-300"
      onClick={(e) => e.stopPropagation()} // Prevent clicking launcher itself from closing it
    >
      {/* Top ambient color bar matching settings accent */}
      <div className="absolute top-0 left-0 w-full h-[3px] rounded-t-2xl bg-gradient-to-r from-[var(--color-cyber-purple)] via-[var(--color-cyber-blue)] to-[var(--color-cyber-pink)]"></div>

      {/* Floating Accent Ring Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-cyber-blue)]/5 via-transparent to-transparent pointer-events-none rounded-2xl"></div>

      {/* Drawer Header & Search Bar */}
      <div className="p-5 pb-3 flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-app-text-secondary)] font-bold">
            TyrexOS App Drawer
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="System Nodes Online"></span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-app-text-secondary)] h-4 w-4" />
          <input
            type="text"
            placeholder="Search apps, files, profile modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-cyber-blue)] focus:ring-1 focus:ring-[var(--color-cyber-blue)]/30 transition-all placeholder:text-[var(--color-app-text-secondary)]/60 font-mono shadow-inner"
            autoFocus
          />
        </div>
      </div>

      {/* Pinned Applications Grid - Windows 11 / Mac Launchpad Style */}
      <div className="flex-1 overflow-y-auto px-5 py-2 custom-scrollbar relative z-10 max-h-[350px]">
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-4 gap-y-6 gap-x-2 py-2">
            {filteredApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => handleAppLaunch(app.id, app.title)}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl border border-transparent hover:bg-white/5 hover:border-[var(--color-glass-border)] transition-all group text-center cursor-pointer relative"
                >
                  {/* Glassmorphic Icon Casing */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-[var(--color-glass-border)] group-hover:bg-[var(--color-cyber-blue)]/10 group-hover:border-[var(--color-cyber-blue)]/40 transition-all shadow-md group-hover:shadow-[var(--color-cyber-blue)]/5 relative group-hover:scale-105 duration-200">
                    <Icon className="h-5 w-5 text-[var(--color-cyber-blue)] group-hover:text-white transition-colors" />
                  </div>
                  
                  {/* Label */}
                  <span className="text-[10px] font-sans font-semibold tracking-wide text-gray-200 group-hover:text-white whitespace-normal break-words line-clamp-2 leading-tight px-1 select-none">
                    {app.title}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--color-app-text-secondary)] font-mono text-xs uppercase tracking-widest relative z-10">
            No system nodes found
          </div>
        )}
      </div>

      {/* Footer Segment: User Profile Bar matching Windows 11 Start */}
      <div className="bg-black/35 border-t border-[var(--color-glass-border)] px-6 py-3.5 rounded-b-2xl flex items-center justify-between relative z-10 select-none">
        <div className="flex items-center gap-3">
          {/* Avatar with dynamic initials */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-cyber-purple)] to-[var(--color-cyber-blue)] flex items-center justify-center border border-white/10 shadow shadow-black/40 text-[11px] font-bold text-white font-mono uppercase">
            {getInitials(username)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-[var(--color-app-text)] font-sans">
              {username || "Tyrex User"}
            </span>
            <span className="text-[9px] font-mono text-[var(--color-app-text-secondary)] uppercase tracking-wider leading-none mt-0.5">
              Active Session
            </span>
          </div>
        </div>

        {/* Action Tray */}
        <div className="flex items-center gap-1">
          <button 
            onClick={handleSystemShutdown}
            className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-[var(--color-app-text-secondary)] hover:border hover:border-red-500/20 transition-all cursor-pointer"
            title="System Logout (Shutdown)"
          >
            <Power className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
