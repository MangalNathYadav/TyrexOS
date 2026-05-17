"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Loading TyrexOS...");

  const statusMessages = [
    { threshold: 0, text: "Initializing kernel..." },
    { threshold: 25, text: "Loading graphical engine modules..." },
    { threshold: 55, text: "Securing cloud gate authentication..." },
    { threshold: 80, text: "Starting workspace desktop shell..." },
    { threshold: 100, text: "Ready." }
  ];

  useEffect(() => {
    // Check if user already booted during this tab session
    const hasBooted = sessionStorage.getItem("tyrex_booted");
    if (hasBooted) {
      if (!loading) {
        if (user) {
          router.push("/os");
        } else {
          router.push("/login");
        }
      }
      return;
    }

    // Smooth, organic progress animation
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Create slight variations in progress speed for organic feeling
      const increment = Math.floor(Math.random() * 8) + 4;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      // Update status message based on threshold
      const matchedStatus = statusMessages
        .slice()
        .reverse()
        .find((m) => currentProgress >= m.threshold);
      if (matchedStatus) {
        setStatus(matchedStatus.text);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        sessionStorage.setItem("tyrex_booted", "true");
        
        // Redirect with a beautiful fade-out window timing
        setTimeout(() => {
          if (user) {
            router.push("/os");
          } else {
            router.push("/login");
          }
        }, 600);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black relative select-none">
      {/* Background radial gradient overlay for premium depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,93,250,0.08)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="flex flex-col items-center gap-10 z-10">
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
