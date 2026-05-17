"use client";

import { useEffect, useRef } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNotificationStore } from "@/store/useNotificationStore";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
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

  const isInitialLoad = useRef(true);

  // 1. Fetch settings from Firebase Realtime Database on Auth
  useEffect(() => {
    if (!user) {
      isInitialLoad.current = true;
      return;
    }

    const settingsRef = ref(db, `users/${user.uid}/settings`);
    
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.wallpaper) setWallpaper(data.wallpaper);
        if (data.theme) setTheme(data.theme);
        if (data.accentColor) setAccentColor(data.accentColor);
        if (data.username) setUsername(data.username);

        if (isInitialLoad.current) {
          addNotification("System settings synced from cloud.", "success");
          isInitialLoad.current = false;
        }
      } else {
        // No settings exist yet in the database, write defaults
        set(settingsRef, {
          wallpaper,
          theme,
          accentColor,
          username,
        });
        isInitialLoad.current = false;
      }
    });

    return () => unsubscribe();
  }, [user, setWallpaper, setTheme, setAccentColor, setUsername, addNotification]);

  // 2. Sync local settings back to DB when they change (only after initial load has completed)
  useEffect(() => {
    if (!user || isInitialLoad.current) return;

    const settingsRef = ref(db, `users/${user.uid}/settings`);
    
    // We debounce slightly to avoid writing on every keypress of username
    const timeout = setTimeout(() => {
      set(settingsRef, {
        wallpaper,
        theme,
        accentColor,
        username,
      });
      addNotification("Cloud backup synced.", "info");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [user, wallpaper, theme, accentColor, username, addNotification]);

  return <>{children}</>;
}
