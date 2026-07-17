import { create } from "zustand";

interface UIState {
  mobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
}

/**
 * Purely presentational, cross-component UI state — the mobile sidebar
 * drawer is the first consumer. Keep domain data (auth, learning session,
 * settings) in their own slices rather than growing this one.
 */
export const useUIStore = create<UIState>((set) => ({
  mobileSidebarOpen: false,
  openMobileSidebar: () => set({ mobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  toggleMobileSidebar: () =>
    set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
}));
