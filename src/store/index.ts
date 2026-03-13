import { createStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface DrawerSlice {
  drawerSearch: string;
  setDrawerSearch: (q: string) => void;
  drawerCollapsed: Record<string, boolean>;
  toggleDrawerGroup: (group: string) => void;
}

interface OutlineSlice {
  outlineExpanded: Record<string, boolean>;
  toggleOutlineItem: (id: string) => void;
}

type UIStore = DrawerSlice & OutlineSlice;

export const uiStore = createStore<UIStore>()(
  subscribeWithSelector((set) => ({
    drawerSearch: "",
    setDrawerSearch: (q) => set({ drawerSearch: q }),
    drawerCollapsed: {},
    toggleDrawerGroup: (group) =>
      set((s) => ({
        drawerCollapsed: {
          ...s.drawerCollapsed,
          [group]: !s.drawerCollapsed[group],
        },
      })),
    outlineExpanded: {},
    toggleOutlineItem: (id) =>
      set((s) => ({
        outlineExpanded: {
          ...s.outlineExpanded,
          [id]: !s.outlineExpanded[id],
        },
      })),
  }))
);

export type { UIStore };
