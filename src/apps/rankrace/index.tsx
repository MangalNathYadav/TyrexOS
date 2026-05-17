"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Trophy, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Calendar, 
  Hourglass, 
  Flame, 
  CheckCircle,
  GraduationCap
} from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNotificationStore } from "@/store/useNotificationStore";

interface LeaderboardUser {
  rank: number;
  name: string;
  subject: string;
  hours: number;
  isSelf?: boolean;
}

interface StudyLog {
  id: string;
  subject: string;
  minutes: number;
  date: string;
}

export default function RankRaceApp() {
  const { username } = useSettingsStore();
  const { addNotification } = useNotificationStore();

  // --- Pomodoro Timer State ---
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"study" | "break">("study");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Study Tracker State ---
  const [streak, setStreak] = useState(3); // Start with a motivation streak of 3 days
  const [selectedSubject, setSelectedSubject] = useState("Computer Science");
  const [logMinutes, setLogMinutes] = useState("");
  const [studyHistory, setStudyHistory] = useState<StudyLog[]>([]);

  // Default leaderboard users
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([
    { rank: 1, name: "Aria Chen", subject: "Computer Science", hours: 28.5 },
    { rank: 2, name: "Lucas Vance", subject: "Mathematics", hours: 24.2 },
    { rank: 3, name: "Sophia Martinez", subject: "Physics", hours: 19.8 },
    { rank: 4, name: username || "Tyrex User", subject: "Computer Science", hours: 14.5, isSelf: true },
    { rank: 5, name: "Devin Cole", subject: "Chemistry", hours: 11.2 },
  ]);

  // Load local state
  useEffect(() => {
    const savedLogs = localStorage.getItem("tyrex_study_history");
    const savedHours = localStorage.getItem("tyrex_total_hours");
    const savedStreak = localStorage.getItem("tyrex_study_streak");

    if (savedLogs) {
      try {
        setStudyHistory(JSON.parse(savedLogs));
      } catch (e) {
        console.error(e);
      }
    }

    if (savedHours && username) {
      const hours = parseFloat(savedHours);
      updateSelfHours(hours);
    }

    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  // Update username if store changes
  useEffect(() => {
    setLeaderboard(prev => 
      prev.map(user => 
        user.isSelf ? { ...user, name: username || "Tyrex User" } : user
      )
    );
  }, [username]);

  // Save history state
  const saveToLocalStorage = (logs: StudyLog[], hours: number, newStreak: number) => {
    localStorage.setItem("tyrex_study_history", JSON.stringify(logs));
    localStorage.setItem("tyrex_total_hours", hours.toString());
    localStorage.setItem("tyrex_study_streak", newStreak.toString());
  };

  const updateSelfHours = (hours: number) => {
    setLeaderboard(prev => {
      const updated = prev.map(user => 
        user.isSelf ? { ...user, hours: parseFloat(hours.toFixed(1)) } : user
      );
      
      // Re-rank items based on total study hours
      const sorted = [...updated].sort((a, b) => b.hours - a.hours);
      return sorted.map((user, idx) => ({ ...user, rank: idx + 1 }));
    });
  };

  // --- Beep Sound Generator using Web Audio API ---
  const playSoundEffect = (type: "work" | "break") => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === "work") {
        osc.frequency.setValueAtTime(600, ctx.currentTime); // Crisp double high notes for work finish
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(400, ctx.currentTime); // Relaxed deep chime for break finish
        osc.frequency.setValueAtTime(500, ctx.currentTime + 0.2);
      }
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("AudioContext failed to start.", e);
    }
  };

  // --- Pomodoro Logic ---
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(prev => prev - 1);
        } else if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            // Timer complete!
            if (mode === "study") {
              playSoundEffect("work");
              addNotification("🍅 Session Complete! Take a 5-minute break.", "success");
              // Auto-log 25 minutes to tracker
              logSessionDirect(25);
              setMode("break");
              setTimerMinutes(5);
            } else {
              playSoundEffect("break");
              addNotification("⚡ Break Finished! Ready to track some more focus?", "success");
              setMode("study");
              setTimerMinutes(25);
            }
            setIsActive(false);
          } else {
            setTimerMinutes(prev => prev - 1);
            setTimerSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timerMinutes, timerSeconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("study");
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  // --- Logging Utilities ---
  const logSessionDirect = (minutes: number) => {
    const newLog: StudyLog = {
      id: Math.random().toString(36).substring(2, 9),
      subject: selectedSubject,
      minutes: minutes,
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    };

    const newHistory = [newLog, ...studyHistory];
    setStudyHistory(newHistory);

    // Calculate new total hours
    const selfUser = leaderboard.find(u => u.isSelf);
    const currentSelfHours = selfUser ? selfUser.hours : 14.5;
    const addedHours = minutes / 60;
    const newHours = currentSelfHours + addedHours;

    // Check if new streak should increment
    const newStreak = streak + 1;
    setStreak(newStreak);

    updateSelfHours(newHours);
    saveToLocalStorage(newHistory, newHours, newStreak);
  };

  const handleLogManual = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(logMinutes);
    if (isNaN(mins) || mins <= 0 || mins > 480) {
      addNotification("Please enter a valid duration (1 to 480 minutes).", "error");
      return;
    }

    logSessionDirect(mins);
    addNotification(`Logged ${mins} mins of study for ${selectedSubject}!`, "success");
    setLogMinutes("");
  };

  // Calculated totals
  const totalLoggedMins = studyHistory.reduce((sum, item) => sum + item.minutes, 0);
  const selfHours = leaderboard.find(u => u.isSelf)?.hours || 14.5;
  const selfRank = leaderboard.find(u => u.isSelf)?.rank || 4;

  return (
    <div className="flex h-full bg-[var(--color-app-bg)] text-[var(--color-app-text)] rounded-b-lg overflow-hidden font-sans p-4 flex-col lg:flex-row gap-4 overflow-y-auto custom-scrollbar">
      
      {/* LEFT COLUMN: Controls & Pomodoro */}
      <div className="flex-1 flex flex-col gap-4 min-w-[280px]">
        
        {/* Timer Chime Window */}
        <div className="border border-[var(--color-glass-border)] bg-[var(--color-input-bg)] rounded-xl p-5 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-3 right-4 flex items-center gap-1 text-[10px] font-mono text-[var(--color-cyber-blue)]">
            <Flame className="h-3 w-3 text-orange-500 animate-pulse fill-current" />
            <span>STREAK: {streak} DAYS</span>
          </div>

          <h3 className="text-holo text-sm font-bold uppercase tracking-widest mb-6 mt-1 flex items-center gap-2">
            <Hourglass className="h-4 w-4 text-[var(--color-cyber-purple)]" />
            Study Pomodoro
          </h3>

          {/* Circle Progress Timer */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 rounded-full bg-[var(--color-cyber-blue)]/5 blur-md"></div>
            
            {/* Visual Progress Arc */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="var(--color-cyber-blue)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="402"
                strokeDashoffset={402 - (402 * ((timerMinutes * 60 + timerSeconds) / (mode === "study" ? 1500 : 300)))}
                className="transition-all duration-1000"
              />
            </svg>

            {/* Timer digits */}
            <div className="absolute flex flex-col items-center leading-none">
              <span className="text-3xl font-mono font-bold tracking-tight">
                {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-app-text-secondary)] mt-1.5">
                {mode === "study" ? "Focus Session" : "Rest Break"}
              </span>
            </div>
          </div>

          {/* Timer Action row */}
          <div className="flex gap-4 mb-2">
            <button
              onClick={toggleTimer}
              className={`px-6 py-2 rounded-lg font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                isActive 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20" 
                  : "bg-[var(--color-cyber-blue)] text-white hover:opacity-90 shadow-md shadow-[var(--color-cyber-blue)]/10"
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="h-3 w-3" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  Focus
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 border border-[var(--color-glass-border)] hover:bg-white/5 rounded-lg text-[var(--color-app-text-secondary)] transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Tracker Logger */}
        <div className="border border-[var(--color-glass-border)] bg-[var(--color-input-bg)] rounded-xl p-5 flex flex-col">
          <h3 className="text-holo text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-[var(--color-cyber-blue)]" />
            Log Focus Session
          </h3>

          <form onSubmit={handleLogManual} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] mb-1">
                Subject Nodes
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-[var(--color-app-bg)] border border-[var(--color-glass-border)] rounded-lg py-2 px-3 text-xs text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-cyber-blue)] font-mono"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--color-app-text-secondary)] mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                placeholder="E.g., 45"
                value={logMinutes}
                onChange={(e) => setLogMinutes(e.target.value)}
                className="w-full bg-[var(--color-app-bg)] border border-[var(--color-glass-border)] rounded-lg py-2 px-3 text-xs text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-cyber-blue)] font-mono placeholder:text-[var(--color-app-text-secondary)]/50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-cyber-blue)] text-white text-xs font-bold font-mono py-2 rounded-lg hover:opacity-90 transition-opacity uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md shadow-[var(--color-cyber-blue)]/10"
            >
              <Plus className="h-3 w-3" />
              Add to Tracker
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Competitive Leaderboard & History */}
      <div className="flex-1 flex flex-col gap-4 min-w-[280px]">
        
        {/* Global Leaderboard Panel */}
        <div className="border border-[var(--color-glass-border)] bg-[var(--color-input-bg)] rounded-xl p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-holo text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500 fill-current" />
              Leaderboard Nodes
            </h3>
            <span className="text-[10px] font-mono text-[var(--color-cyber-purple)] bg-[var(--color-cyber-purple)]/10 border border-[var(--color-cyber-purple)]/20 px-2 py-0.5 rounded uppercase font-bold">
              RANK #{selfRank}
            </span>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {leaderboard.map((user) => (
              <div
                key={user.name}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  user.isSelf 
                    ? "bg-[var(--color-cyber-blue)]/15 border-[var(--color-cyber-blue)]/40 shadow-sm" 
                    : "bg-[var(--color-app-bg)]/50 border-[var(--color-glass-border)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank bubble */}
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] leading-none ${
                    user.rank === 1 
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                      : user.rank === 2
                      ? "bg-slate-400/20 text-slate-300 border border-slate-400/30"
                      : user.rank === 3
                      ? "bg-amber-600/20 text-amber-500 border border-amber-600/30"
                      : "bg-white/5 text-[var(--color-app-text-secondary)] border border-transparent"
                  }`}>
                    {user.rank}
                  </span>

                  <div className="flex flex-col">
                    <span className={`text-xs font-bold tracking-wide font-sans ${user.isSelf ? "text-[var(--color-cyber-blue)]" : ""}`}>
                      {user.name} {user.isSelf && "(You)"}
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-[var(--color-app-text-secondary)] opacity-80 mt-0.5">
                      {user.subject}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-center items-end">
                  <span className="text-xs font-mono font-bold">
                    {user.hours} hrs
                  </span>
                  {user.isSelf && (
                    <span className="text-[8px] font-mono text-[var(--color-cyber-blue)] animate-pulse uppercase tracking-wider font-bold">
                      ACTIVE LOGGING
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs & Progress Feed */}
        <div className="border border-[var(--color-glass-border)] bg-[var(--color-input-bg)] rounded-xl p-5 flex-1 flex flex-col justify-between min-h-[180px]">
          <div>
            <h3 className="text-holo text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--color-cyber-purple)]" />
              Focus Logs
            </h3>

            <div className="space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
              {studyHistory.length > 0 ? (
                studyHistory.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex justify-between items-center p-2 rounded bg-[var(--color-app-bg)]/30 border border-[var(--color-glass-border)]/50 font-mono text-[10px]"
                  >
                    <div className="flex items-center gap-2 text-[var(--color-app-text)]">
                      <CheckCircle className="h-3.5 w-3.5 text-[var(--color-cyber-blue)]" />
                      <div className="flex flex-col leading-none">
                        <span className="font-semibold text-white">{log.subject}</span>
                        <span className="text-[8px] text-[var(--color-app-text-secondary)] mt-0.5">{log.date}</span>
                      </div>
                    </div>
                    <span className="text-[var(--color-cyber-purple)] font-bold">{log.minutes} Mins</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[var(--color-app-text-secondary)] text-[10px] font-mono uppercase tracking-wider">
                  No focus history detected.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[var(--color-glass-border)]/50 pt-3 mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--color-app-text-secondary)] uppercase tracking-wider text-[9px]">TOTAL STUDY NODE TIME</span>
            <span className="text-white font-bold text-sm tracking-wide bg-[var(--color-cyber-blue)]/10 px-2.5 py-0.5 rounded border border-[var(--color-cyber-blue)]/20">
              {totalLoggedMins} Mins
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
