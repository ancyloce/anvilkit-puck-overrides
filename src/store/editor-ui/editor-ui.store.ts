import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { createEditorCanvasSlice } from "./slices/editor-canvas.slice";
import { createEditorDrawerSlice } from "./slices/editor-drawer.slice";
import { createEditorOutlineSlice } from "./slices/editor-outline.slice";
import { createEditorSidebarSlice } from "./slices/editor-sidebar.slice";
import { createEditorThemeSlice } from "./slices/editor-theme.slice";
import type { EditorUiStore } from "./editor-ui.types";

export type { EditorUiStore } from "./editor-ui.types";

export type EditorUiStoreApi = ReturnType<typeof createEditorUiStore>;

export function createEditorUiStore(storeId: string) {
  return createStore<EditorUiStore>()(
    persist(
      (...storeArgs) => ({
        ...createEditorSidebarSlice(...storeArgs),
        ...createEditorDrawerSlice(...storeArgs),
        ...createEditorOutlineSlice(...storeArgs),
        ...createEditorCanvasSlice(...storeArgs),
        ...createEditorThemeSlice(...storeArgs),
      }),
      {
        name: `anvilkit-ui-${storeId}`,
        partialize: (state) => ({
          activeTab: state.activeTab,
          drawerCollapsed: state.drawerCollapsed,
          outlineExpanded: state.outlineExpanded,
          canvasViewport: state.canvasViewport,
          theme: state.theme,
          // drawerSearch intentionally excluded — transient input
        }),
      },
    ),
  );
}
