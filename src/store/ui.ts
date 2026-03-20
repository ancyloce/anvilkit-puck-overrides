import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import type { LibraryDragType } from "@/features/library-dnd/drop-contract";

export const ACTIVE_TABS = [
  "insert",
  "layer",
  "image",
  "text",
  "copilot",
] as const;

export type ActiveTab = (typeof ACTIVE_TABS)[number];
export const CANVAS_VIEWPORTS = ["mobile", "tablet", "desktop"] as const;

export type CanvasViewport = (typeof CANVAS_VIEWPORTS)[number];

const activeTabSet = new Set<string>(ACTIVE_TABS);
const canvasViewportSet = new Set<string>(CANVAS_VIEWPORTS);

export function isActiveTab(value: string): value is ActiveTab {
  return activeTabSet.has(value);
}

export function isCanvasViewport(value: string): value is CanvasViewport {
  return canvasViewportSet.has(value);
}

interface DrawerSlice {
  drawerSearch: string;
  setDrawerSearch: (q: string) => void;
  drawerCollapsed: Record<string, boolean>;
  toggleDrawerGroup: (group: string) => void;
}

interface AsideSlice {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

interface OutlineSlice {
  outlineExpanded: Record<string, boolean>;
  toggleOutlineItem: (id: string) => void;
}

interface ThemeSlice {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

interface CanvasSlice {
  canvasViewport: CanvasViewport;
  setCanvasViewport: (viewport: CanvasViewport) => void;
  canvasLibraryDragType: LibraryDragType | null;
  setCanvasLibraryDragType: (type: LibraryDragType | null) => void;
}

export type EditorUiStore = DrawerSlice &
  AsideSlice &
  OutlineSlice &
  ThemeSlice &
  CanvasSlice;

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
        canvasViewport: "desktop",
        setCanvasViewport: (canvasViewport) => set({ canvasViewport }),
        canvasLibraryDragType: null,
        setCanvasLibraryDragType: (canvasLibraryDragType) => set({ canvasLibraryDragType }),
        theme: "light",
        toggleTheme: () =>
          set((s) => {
            const next = s.theme === "light" ? "dark" : "light";
            return { theme: next };
          }),
      }),
      {
        name: `anvilkit-ui-${storeId}`,
        partialize: (s) => ({
          activeTab: s.activeTab,
          drawerCollapsed: s.drawerCollapsed,
          outlineExpanded: s.outlineExpanded,
          canvasViewport: s.canvasViewport,
          theme: s.theme,
          // drawerSearch intentionally excluded — transient input
        }),
      }
    )
  );
}
