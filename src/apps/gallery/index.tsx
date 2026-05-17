"use client";

import { useWindowStore } from "@/store/useWindowStore";
import { appRegistry } from "@/core/app-manager/appRegistry";
import { FolderGit2, Play } from "lucide-react";

export default function GalleryApp() {
  const { openWindow } = useWindowStore();

  // Exclude the gallery itself from the projects listing
  const projects = appRegistry.filter((app) => app.id !== "gallery");

  // Dynamic border color mapping helper
  const getBannerColor = (id: string, index: number): string => {
    const colors = [
      "var(--color-cyber-purple)",
      "var(--color-cyber-blue)",
      "var(--color-cyber-pink)",
      "#00ff66",
      "#f59e0b",
      "#ec4899",
      "#3b82f6",
      "#10b981",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex h-full bg-[var(--color-app-bg)] text-[var(--color-app-text)] rounded-b-lg overflow-hidden font-sans p-6 flex-col overflow-y-auto space-y-6 custom-scrollbar">
      <div className="flex items-center gap-2 border-b border-[var(--color-glass-border)] pb-2">
        <FolderGit2 className="h-5 w-5 text-[var(--color-cyber-blue)]" />
        <h2 className="text-holo text-xl font-bold tracking-widest uppercase">
          Projects Gallery
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj, idx) => {
          const IconComponent = proj.icon;
          return (
            <div
              key={proj.id}
              className="border border-[var(--color-glass-border)] bg-[var(--color-input-bg)] rounded-lg p-4 relative group flex flex-col justify-between hover:border-[var(--color-cyber-blue)]/50 transition-all overflow-hidden"
            >
              {/* Top decorative banner */}
              <div
                className="absolute top-0 left-0 w-full h-[2px] transition-all group-hover:h-1"
                style={{ backgroundColor: getBannerColor(proj.id, idx) }}
              ></div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-[var(--color-app-text-secondary)] group-hover:text-white transition-colors" />
                    <h3 className="font-bold tracking-wider text-sm">{proj.title}</h3>
                  </div>
                  <span className="text-[9px] font-mono opacity-50">v1.0.0</span>
                </div>
                <p className="text-xs text-[var(--color-app-text-secondary)] font-mono mb-4 leading-relaxed min-h-8">
                  {proj.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--color-glass-border)]/50">
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}
                >
                  {proj.status}
                </span>

                <button
                  onClick={() => openWindow(proj.id, proj.title)}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-400 hover:text-white transition-colors"
                >
                  <span>Launch</span>
                  <Play className="h-3 w-3 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
