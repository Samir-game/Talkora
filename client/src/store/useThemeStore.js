import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Talkora-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Talkora-theme", theme);
    set({ theme });
  },
}));