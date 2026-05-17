"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Lock, User, Terminal } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // OS Boot Loading Transition states
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing user profile...");

  const statusMessages = [
    { threshold: 0, text: "Authenticating security credentials..." },
    { threshold: 25, text: "Loading user environment configurations..." },
    { threshold: 55, text: "Syncing workspace database tables..." },
    { threshold: 80, text: "Launching desktop UI graphics shell..." },
    { threshold: 100, text: "Welcome to TyrexOS." }
  ];

  const startBootLoading = () => {
    setShowLoadingScreen(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8) + 5;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      const matchedStatus = statusMessages
        .slice()
        .reverse()
        .find((m) => currentProgress >= m.threshold);
      if (matchedStatus) {
        setStatus(matchedStatus.text);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/os");
        }, 500);
      }
    }, 110);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      startBootLoading();
    } catch (err: any) {
      setError(err.message || "Failed to login");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      startBootLoading();
    } catch (err: any) {
      setError(err.message || "Failed Google login");
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInAnonymously(auth);
      startBootLoading();
    } catch (err: any) {
      setError("Anonymous auth not enabled in Firebase. Creating simulated local session...");
      setTimeout(() => {
        startBootLoading();
      }, 1000);
    }
  };

  // Render Graphical Boot Loading Screen if triggered on successful authentication
  if (showLoadingScreen) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black relative select-none">
        {/* Background radial gradient overlay for premium depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,93,250,0.08)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="flex flex-col items-center gap-10 z-10 animate-fade-in">
          {/* Sleek Glowing Modern Tyrex "T" Vector Shield Logo */}
          <div className="relative group">
            {/* Breathing ambient back-glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-cyber-blue)] to-[var(--color-cyber-pink)] rounded-full opacity-30 blur-2xl group-hover:opacity-40 transition-opacity duration-1000 animate-pulse"></div>
            
            <svg
              className="w-24 h-24 text-[var(--color-cyber-blue)] drop-shadow-[0_0_15px_rgba(124,93,250,0.6)] relative z-10"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 15H85V32H59V85H41V32H15V15Z"
                fill="currentColor"
                className="animate-pulse"
                style={{ animationDuration: "3s" }}
              />
            </svg>
          </div>

          {/* Operating System Name */}
          <div className="flex flex-col items-center gap-1.5 text-center mt-2">
            <h1 className="text-white text-2xl font-semibold tracking-[0.35em] uppercase font-sans drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] pl-[0.35em]">
              TyrexOS
            </h1>
            <span className="text-[var(--color-app-text-secondary)] text-[10px] tracking-[0.4em] uppercase font-medium pl-[0.4em] opacity-80">
              Powered by AI Core
            </span>
          </div>

          {/* Apple/Windows Style Smooth loading container */}
          <div className="flex flex-col items-center gap-3.5 mt-4">
            <div className="h-1 w-52 bg-white/10 rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
              <div
                className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-app-text-secondary)] uppercase opacity-70 animate-pulse pl-[0.25em]">
              {status}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black bg-[url('/grid.svg')] bg-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[var(--color-cyber-purple)] rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[var(--color-cyber-blue)] rounded-full blur-[150px] opacity-20"></div>
      
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md z-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-cyber-blue)] to-transparent"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-holo text-3xl font-bold tracking-wider mb-2">TyrexOS</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">System Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                placeholder="User Identifier (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-[var(--color-glass-border)] rounded-lg py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[var(--color-cyber-blue)] transition-colors"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                placeholder="Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-[var(--color-glass-border)] rounded-lg py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[var(--color-cyber-blue)] transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-[var(--color-cyber-pink)] text-xs text-center bg-[var(--color-cyber-pink)]/10 p-2.5 rounded font-mono border border-[var(--color-cyber-pink)]/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-transparent border border-[var(--color-cyber-blue)] text-[var(--color-cyber-blue)] hover:bg-[var(--color-cyber-blue)] hover:text-black transition-all duration-300 py-3 rounded-lg font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Initialize Connection"}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-mono tracking-widest uppercase">Or Bypass Connection</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/30 text-white transition-all py-2.5 rounded-lg text-xs font-semibold font-mono disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-[var(--color-cyber-blue)]/50 text-white transition-all py-2.5 rounded-lg text-xs font-semibold font-mono disabled:opacity-50 shadow-[0_0_10px_rgba(0,240,255,0.05)]"
          >
            <Terminal className="h-4 w-4 text-[var(--color-cyber-blue)]" />
            Guest/Demo
          </button>
        </div>
      </div>
    </div>
  );
}
