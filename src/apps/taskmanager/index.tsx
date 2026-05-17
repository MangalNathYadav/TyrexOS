"use client";

import { useState, useEffect } from "react";
import { useWindowStore } from "@/store/useWindowStore";
import { appRegistry } from "@/core/app-manager/appRegistry";
import { ShieldAlert, Play, Cpu, Server, XCircle, RefreshCw } from "lucide-react";

export default function TaskManagerApp() {
  const { windows, closeWindow, openWindow } = useWindowStore();
  const [selectedAppToLaunch, setSelectedAppToLaunch] = useState("");
  const [simulatedCpu, setSimulatedCpu] = useState(1.2);

  // Fluctuating simulated CPU ticks based on active count of windows
  useEffect(() => {
    const interval = setInterval(() => {
      const activeCount = windows.length;
      const base = activeCount * 2.5 + 1.2;
      const noise = (Math.random() - 0.5) * 1.5;
      setSimulatedCpu(Math.max(0.5, parseFloat((base + noise).toFixed(1))));
    }, 1500);

    return () => clearInterval(interval);
  }, [windows]);

  const handleLaunch = () => {
    if (!selectedAppToLaunch) return;
    const app = appRegistry.find((a) => a.id === selectedAppToLaunch);
    if (app) {
      openWindow(app.id, app.title);
    }
  };

  const getAppIcon = (appId: string) => {
    const app = appRegistry.find((a) => a.id === appId);
    if (app) {
      const Icon = app.icon;
      return <Icon className="h-4 w-4 text-[var(--color-cyber-blue)]" />;
    }
    return <Play className="h-4 w-4 text-[var(--color-cyber-blue)]" />;
  };

  const activeCount = windows.length;
  const memoryUsed = 124 + activeCount * 42;
  const memoryPercent = (memoryUsed / 1024) * 100;

  return (
    <div className="flex flex-col h-full bg-[var(--color-app-bg)] text-[var(--color-app-text)] font-sans rounded-b-lg overflow-hidden select-none p-5">
      {/* Top dashboard panels */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* CPU Card */}
        <div className="bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--color-cyber-blue)] to-[var(--color-cyber-purple)]" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-app-text-secondary)] font-mono uppercase tracking-widest">
              <Cpu className="h-3.5 w-3.5 text-[var(--color-cyber-blue)]" />
              <span>CPU Utilization</span>
            </div>
            <span className="text-2xl font-bold font-mono tracking-tight">
              {simulatedCpu}%
            </span>
          </div>
          {/* Progress ring or status bar */}
          <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              style={{ width: `${Math.min(100, simulatedCpu * 3.5)}%` }} 
              className="h-full bg-gradient-to-r from-[var(--color-cyber-blue)] to-[var(--color-cyber-purple)] transition-all duration-500"
            />
          </div>
        </div>

        {/* RAM Card */}
        <div className="bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--color-cyber-purple)] to-[var(--color-cyber-pink)]" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-app-text-secondary)] font-mono uppercase tracking-widest">
              <Server className="h-3.5 w-3.5 text-[var(--color-cyber-purple)]" />
              <span>Virtual RAM</span>
            </div>
            <span className="text-2xl font-bold font-mono tracking-tight">
              {memoryUsed} MB <span className="text-xs text-[var(--color-app-text-secondary)]">/ 1024 MB</span>
            </span>
          </div>
          <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              style={{ width: `${memoryPercent}%` }} 
              className="h-full bg-gradient-to-r from-[var(--color-cyber-purple)] to-[var(--color-cyber-pink)] transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Main Process List Grid */}
      <div className="flex-1 flex flex-col min-h-0 border border-[var(--color-glass-border)] bg-[var(--color-input-bg)]/20 rounded-2xl p-4 relative overflow-hidden mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] font-bold">
            Active System Tasks ({activeCount})
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System Secure
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {activeCount === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-xs text-[var(--color-app-text-secondary)]/50 gap-2">
              <ShieldAlert className="h-8 w-8 text-[var(--color-app-text-secondary)]/30" />
              <span>No running application windows found.</span>
            </div>
          ) : (
            windows.map((win) => (
              <div 
                key={win.id} 
                className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-150 bg-[var(--color-input-bg)]/40 ${
                  win.focused 
                    ? "border-[var(--color-cyber-blue)]/40 shadow-[0_0_12px_rgba(0,183,255,0.04)]" 
                    : "border-[var(--color-glass-border)]"
                }`}
              >
                <div className="flex items-center gap-3 pr-4 truncate">
                  {getAppIcon(win.appId)}
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold truncate text-[var(--color-app-text)]">
                      {win.title}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--color-app-text-secondary)]">
                      App ID: {win.appId} | XY: {Math.round(win.x)},{Math.round(win.y)} | Size: {win.width}x{win.height}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {win.focused && (
                    <span className="text-[9px] font-mono uppercase bg-[var(--color-cyber-blue)]/20 text-[var(--color-cyber-blue)] px-2 py-0.5 rounded border border-[var(--color-cyber-blue)]/30">
                      Focus
                    </span>
                  )}
                  <button
                    onClick={() => closeWindow(win.id)}
                    className="p-1.5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg border border-transparent hover:border-rose-500/30 transition-all cursor-pointer flex items-center gap-1 text-xs"
                    title="Terminate Process"
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="text-[10px] font-semibold hidden md:inline font-mono">End Task</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Launch Panel */}
      <div className="border-t border-[var(--color-glass-border)] pt-4 flex items-center gap-3 bg-[var(--color-app-bg)]/60">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)]">
          Spawn Task:
        </span>
        <select
          value={selectedAppToLaunch}
          onChange={(e) => setSelectedAppToLaunch(e.target.value)}
          className="flex-1 bg-[var(--color-input-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-cyber-blue)]/40 cursor-pointer"
        >
          <option value="">-- Choose system app --</option>
          {appRegistry.map((app) => (
            <option key={app.id} value={app.id}>
              {app.title} ({app.id})
            </option>
          ))}
        </select>
        <button
          onClick={handleLaunch}
          disabled={!selectedAppToLaunch}
          className="px-4 py-1.5 bg-[var(--color-cyber-blue)] hover:bg-[var(--color-cyber-blue)]/80 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all cursor-pointer text-xs font-semibold flex items-center gap-1 shadow-[0_0_12px_rgba(0,183,255,0.2)] active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Launch Process
        </button>
      </div>
    </div>
  );
}
