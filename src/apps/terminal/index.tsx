"use client";

import { useState, useRef, useEffect } from "react";
import { useWindowStore } from "@/store/useWindowStore";
import { useSettingsStore } from "@/store/useSettingsStore";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "system" | "success";
}

export default function TerminalApp() {
  const { windows, closeWindow } = useWindowStore();
  const { theme, accentColor, username, setTheme, setAccentColor, setUsername } = useSettingsStore();

  const [history, setHistory] = useState<TerminalLine[]>([
    { text: "TYREX OS v1.0.0 Terminal System Shell initialized.", type: "system" },
    { text: "Type 'help' to review available operating system commands.", type: "system" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newHistory = [...history, { text: `${username.toLowerCase()}@tyrexos:~$ ${trimmed}`, type: "input" as const }];

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let response: TerminalLine[] = [];

    switch (command) {
      case "help":
        response = [
          { text: "Available System Commands:", type: "system" },
          { text: "  help              - Show this command reference dashboard", type: "output" },
          { text: "  neofetch          - Print system parameters & active Task Manager stats", type: "output" },
          { text: "  ps / tasks        - List all running window processes (active Task Manager)", type: "output" },
          { text: "  kill [id]         - Close/terminate a running process by its Application ID", type: "output" },
          { text: "  theme [name]      - Change UI theme (light / dark / cyberpunk / holographic)", type: "output" },
          { text: "  accent [hex]      - Update system neon glow accent color (e.g. #00ffff)", type: "output" },
          { text: "  username [name]   - Update your profile system username", type: "output" },
          { text: "  date              - Output system chronometer state", type: "output" },
          { text: "  echo [string]     - Print a target string on the CLI output stream", type: "output" },
          { text: "  clear             - Clear all shell logger logs", type: "output" },
        ];
        break;

      case "neofetch": {
        const activeCount = windows.length;
        response = [
          { text: "  /\\_/\\     TyrexOS kernel v1.0.0-holographic", type: "system" },
          { text: " ( o.o )    OS Model: Cybernetic Next.js Desktop Shell", type: "output" },
          { text: "  > ^ <     System Host: " + username + " (Admin)", type: "output" },
          { text: "            Active Theme: " + theme.toUpperCase(), type: "output" },
          { text: "            Accent Hex: " + accentColor, type: "output" },
          { text: "            --------------------------------------------", type: "system" },
          { text: "            [📟 ACTIVE TASK MANAGER STATS]", type: "success" },
          { text: "            Running Processes: " + activeCount + " tasks active", type: "output" },
          { text: "            Simulated CPU Load: " + (activeCount * 2.4 + 1.2).toFixed(1) + "% load", type: "output" },
          { text: "            Virtual Memory Allocated: " + (124 + activeCount * 42) + " MB / 1024 MB", type: "output" },
          { text: "            Shell Connection: Stable Node Process (Zustand)", type: "output" },
        ];
        break;
      }

      case "ps":
      case "tasks": {
        if (windows.length === 0) {
          response = [{ text: "No active system window tasks running currently.", type: "output" }];
        } else {
          response = [
            { text: "PID   | APP ID          | Z-INDEX | STATE", type: "system" },
            { text: "------------------------------------------------", type: "system" },
            ...windows.map((win) => ({
              text: `${win.id.slice(0, 5)} | ${win.appId.padEnd(14)} | ${win.zIndex.toString().padEnd(7)} | ${win.focused ? "FOCUS (Active)" : "Background"}`,
              type: "success" as const,
            })),
          ];
        }
        break;
      }

      case "kill": {
        if (args.length === 0) {
          response = [{ text: "Usage error: kill [appId | partialPID]. E.g. 'kill terminal'", type: "error" }];
        } else {
          const target = args[0].toLowerCase();
          // Find window matching appId or partial window ID
          const match = windows.find(
            (w) => w.appId.toLowerCase() === target || w.id.toLowerCase().startsWith(target)
          );

          if (match) {
            closeWindow(match.id);
            response = [{ text: `Success: Process '${match.appId}' (ID: ${match.id.slice(0, 5)}) terminated successfully.`, type: "success" }];
          } else {
            response = [{ text: `Process termination failed: No active window matching '${target}'.`, type: "error" }];
          }
        }
        break;
      }

      case "theme": {
        if (args.length === 0) {
          response = [{ text: `Current Theme: ${theme}. Usage: theme [light | dark | cyberpunk | holographic]`, type: "output" }];
        } else {
          const newTheme = args[0].toLowerCase();
          if (["light", "dark", "cyberpunk", "holographic"].includes(newTheme)) {
            setTheme(newTheme as any);
            response = [{ text: `System Theme set to: '${newTheme}' successfully.`, type: "success" }];
          } else {
            response = [{ text: `Invalid theme parameter. Choose: light, dark, cyberpunk, or holographic.`, type: "error" }];
          }
        }
        break;
      }

      case "accent": {
        if (args.length === 0) {
          response = [{ text: `Current Accent Glow: ${accentColor}. Usage: accent [#00ffff]`, type: "output" }];
        } else {
          const newAccent = args[0];
          if (/^#[0-9A-F]{6}$/i.test(newAccent)) {
            setAccentColor(newAccent);
            response = [{ text: `Accent Color set to: '${newAccent}' successfully.`, type: "success" }];
          } else {
            response = [{ text: `Format error: Accent color must match hex format (e.g. #00ffff).`, type: "error" }];
          }
        }
        break;
      }

      case "username": {
        if (args.length === 0) {
          response = [{ text: `Current User: ${username}. Usage: username [new_name]`, type: "output" }];
        } else {
          const newName = args.join(" ");
          setUsername(newName);
          response = [{ text: `System profile username updated to: '${newName}'.`, type: "success" }];
        }
        break;
      }

      case "date":
        response = [{ text: "Chronometer State: " + new Date().toLocaleString(), type: "output" }];
        break;

      case "echo":
        response = [{ text: args.join(" "), type: "output" }];
        break;

      case "clear":
        setHistory([]);
        setInputValue("");
        return;

      default:
        response = [{ text: `Command not found: '${command}'. Type 'help' for support.`, type: "error" }];
    }

    setHistory([...newHistory, ...response]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-app-bg)] p-4 text-[var(--color-app-text)] font-mono text-xs leading-relaxed overflow-hidden rounded-b-lg select-text">
      {/* Scrollable history logs */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 pr-1 custom-scrollbar">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.type === "input"
                ? "text-[var(--color-app-text)] font-semibold"
                : line.type === "error"
                ? "text-rose-400 font-bold"
                : line.type === "system"
                ? "text-[var(--color-cyber-blue)]"
                : line.type === "success"
                ? "text-emerald-400 font-medium"
                : "text-[var(--color-app-text-secondary)]"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Inputs bar */}
      <div className="flex items-center border-t border-[var(--color-glass-border)] pt-2 bg-[var(--color-app-bg)]/60">
        <span className="text-[var(--color-cyber-blue)] font-bold mr-2">{username.toLowerCase()}@tyrexos:~$</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommand(inputValue);
            }
          }}
          placeholder="Enter command (e.g. neofetch, ps, theme)..."
          className="flex-1 bg-transparent focus:outline-none text-[var(--color-app-text)] caret-[var(--color-cyber-blue)] font-mono text-xs"
          autoFocus
        />
      </div>
    </div>
  );
}
