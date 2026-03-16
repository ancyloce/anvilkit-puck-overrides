import { createStore } from "zustand";
import { persist } from "zustand/middleware";

interface DrawerSlice {
  drawerSearch: string;
  setDrawerSearch: (q: string) => void;
  drawerCollapsed: Record<string, boolean>;
  toggleDrawerGroup: (group: string) => void;
}

interface AsideSlice {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface OutlineSlice {
  outlineExpanded: Record<string, boolean>;
  toggleOutlineItem: (id: string) => void;
}

export type EditorUiStore = DrawerSlice & AsideSlice & OutlineSlice;

export type EditorUiStoreApi = ReturnType<typeof createEditorUiStore>;

export function createEditorUiStore(storeId: string) {
  return createStore<EditorUiStore>()(
    persist(
      (set) => ({
        drawerSearch: "",
        setDrawerSearch: (q) => set({ drawerSearch: q }),
        drawerCollapsed: {},
        toggleDrawerGroup: (group) =>
          set((s) => ({
            drawerCollapsed: { ...s.drawerCollapsed, [group]: !s.drawerCollapsed[group] },
          })),
        activeTab: "insert",
        setActiveTab: (tab) => set({ activeTab: tab }),
        outlineExpanded: {},
        toggleOutlineItem: (id) =>
          set((s) => ({
            outlineExpanded: { ...s.outlineExpanded, [id]: !s.outlineExpanded[id] },
          })),
      }),
      {
        name: `anvilkit-ui-${storeId}`,
        partialize: (s) => ({
          activeTab: s.activeTab,
          drawerCollapsed: s.drawerCollapsed,
          outlineExpanded: s.outlineExpanded,
          // drawerSearch intentionally excluded — transient input
        }),
      }
    )
  );
}
