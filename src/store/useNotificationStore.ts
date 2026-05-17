import { create } from "zustand";

export interface SystemNotification {
  id: string;
  message: string;
  type: "info" | "success" | "error";
}

interface NotificationStore {
  notifications: SystemNotification[];
  addNotification: (message: string, type?: "info" | "success" | "error") => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (message, type = "info") => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));

    // Auto-remove after 4 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000);
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
