"use client";

import { useNotificationStore } from "@/store/useNotificationStore";
import { Info, CheckCircle, AlertTriangle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function NotificationSystem() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="absolute bottom-16 right-4 flex flex-col gap-2 z-[99999] pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-80 glass-panel p-4 rounded-lg flex items-start gap-3 border border-[var(--color-glass-border)] shadow-[0_5px_20px_rgba(0,0,0,0.3)]"
          >
            {/* Icon based on notification type */}
            <div className="mt-0.5">
              {n.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : n.type === "error" ? (
                <AlertTriangle className="h-4 w-4 text-[var(--color-cyber-pink)]" />
              ) : (
                <Info className="h-4 w-4 text-[var(--color-cyber-blue)]" />
              )}
            </div>

            <div className="flex-1">
              <p className="text-xs font-mono font-medium text-white tracking-wide leading-relaxed">
                {n.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
