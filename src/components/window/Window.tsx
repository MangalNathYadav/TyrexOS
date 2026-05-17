"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { Minus, Square, X, Copy } from "lucide-react";
import { WindowState, useWindowStore } from "@/store/useWindowStore";
import { useSettingsStore } from "@/store/useSettingsStore";

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

export default function Window({ windowState, children }: WindowProps) {
  const { accentColor } = useSettingsStore();
  const {
    id,
    title,
    x,
    y,
    width,
    height,
    minimized,
    maximized,
    focused,
    zIndex,
    closed,
  } = windowState;

  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();

  const dragControls = useDragControls();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Responsive Screen Coordinates to direct minimized dock animations
  const [screenSize, setScreenSize] = useState({ width: 800, height: 600 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resizing mouse move drag logic
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = width;
    const initialHeight = height;
    const initialX = x;
    const initialY = y;

    const minWidth = 280;
    const minHeight = 180;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newX = initialX;
      let newY = initialY;

      // Vertical calculations
      if (direction.includes("n")) {
        const potentialHeight = initialHeight - deltaY;
        if (potentialHeight >= minHeight) {
          newHeight = potentialHeight;
          newY = initialY + deltaY;
        }
      } else if (direction.includes("s")) {
        const potentialHeight = initialHeight + deltaY;
        if (potentialHeight >= minHeight) {
          newHeight = potentialHeight;
        }
      }

      // Horizontal calculations
      if (direction.includes("w")) {
        const potentialWidth = initialWidth - deltaX;
        if (potentialWidth >= minWidth) {
          newWidth = potentialWidth;
          newX = initialX + deltaX;
        }
      } else if (direction.includes("e")) {
        const potentialWidth = initialWidth + deltaX;
        if (potentialWidth >= minWidth) {
          newWidth = potentialWidth;
        }
      }

      updateWindowSize(id, newWidth, newHeight);
      updateWindowPosition(id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <motion.div
      ref={windowRef}
      // macOS Launch - Spring scale-up and fade-in from center/launch point
      initial={{ 
        scale: 0.35, 
        opacity: 0,
        x: x + width / 4,
        y: y + height / 4,
      }}
      animate={{
        // macOS Genie effect - Scale down and slide to bottom center taskbar when minimized or closed
        scale: closed ? 0 : (minimized ? 0.05 : 1),
        opacity: closed ? 0 : (minimized ? 0 : 1),
        x: closed ? (screenSize.width / 2 - width / 2) : (minimized ? (screenSize.width / 2 - width / 2) : (maximized ? 0 : x)),
        y: closed ? screenSize.height : (minimized ? (screenSize.height - 10) : (maximized ? 0 : y)),
        width: maximized ? "100%" : width,
        height: maximized ? "100%" : height,
      }}
      // macOS Exit - Smooth slide-out scale-down and fade-out
      exit={{ 
        scale: 0.82, 
        opacity: 0,
        transition: { duration: 0.16, ease: "easeIn" }
      }}
      // Bouncy, organic macOS Spring transition physics
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 28,
        mass: 0.85
      }}
      drag={!maximized && !minimized && !closed}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        if (!maximized) {
          updateWindowPosition(id, x + info.offset.x, y + info.offset.y);
        }
      }}
      onPointerDown={() => !closed && focusWindow(id)}
      style={{ 
        zIndex,
        pointerEvents: (minimized || closed) ? "none" : "auto",
        boxShadow: focused && !closed
          ? `0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 25px ${accentColor}25` 
          : "0 15px 35px -15px rgba(0, 0, 0, 0.5)",
      }}
      className={`absolute rounded-t-xl rounded-b-lg overflow-hidden flex flex-col glass border transition-shadow duration-300 ${
        focused && !closed
          ? "border-[var(--color-cyber-blue)]/50"
          : "border-[var(--color-glass-border)]"
      }`}
    >
      {/* 8-Way Absolute Window Resize Handles (Only show when not maximized and not minimized) */}
      {!maximized && !minimized && (
        <>
          {/* Edges */}
          <div 
            className="absolute top-0 left-2 right-2 h-1 cursor-n-resize z-[9999]"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div 
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-s-resize z-[9999]"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div 
            className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize z-[9999]"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div 
            className="absolute right-0 top-2 bottom-2 w-1.5 cursor-e-resize z-[9999]"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />

          {/* Corners */}
          <div 
            className="absolute top-0 left-0 w-2.5 h-2.5 cursor-nw-resize z-[99999]"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div 
            className="absolute top-0 right-0 w-2.5 h-2.5 cursor-ne-resize z-[99999]"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div 
            className="absolute bottom-0 left-0 w-2.5 h-2.5 cursor-sw-resize z-[99999]"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div 
            className="absolute bottom-0 right-0 w-2.5 h-2.5 cursor-se-resize z-[99999]"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
        </>
      )}

      {/* Title Bar */}
      <div
        onPointerDown={(e) => {
          if (!maximized && !minimized) {
            dragControls.start(e);
          }
        }}
        className={`window-titlebar h-10 px-4 flex items-center justify-between cursor-move select-none border-b border-[var(--color-glass-border)] ${
          focused ? "bg-[var(--color-titlebar-bg)]" : "bg-[var(--color-titlebar-bg)]/80"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs uppercase font-mono tracking-widest ${
              focused ? "text-[var(--color-cyber-blue)]" : "text-[var(--color-app-text-secondary)]"
            }`}
          >
            {title}
          </span>
        </div>

        {/* Window Controls */}
        <div 
          onPointerDown={(e) => e.stopPropagation()} 
          className="flex items-center gap-3"
        >
          <button
            onClick={() => minimizeWindow(id)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-[var(--color-app-text-secondary)] hover:text-[var(--color-app-text)] cursor-pointer"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => maximizeWindow(id)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-[var(--color-app-text-secondary)] hover:text-[var(--color-app-text)] cursor-pointer"
          >
            {maximized ? <Copy className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => closeWindow(id)}
            className="p-1 hover:bg-[var(--color-cyber-pink)]/20 rounded transition-colors text-[var(--color-app-text-secondary)] hover:text-[var(--color-cyber-pink)] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative rounded-b-lg">
        {/* Iframe Event Interception Shield */}
        {(isDragging || isResizing) && (
          <div className="absolute inset-0 bg-transparent z-[9999] pointer-events-auto" />
        )}
        {children}
      </div>
    </motion.div>
  );
}
