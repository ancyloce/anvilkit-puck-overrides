import type { EditorUiSliceCreator } from "../editor-ui.types";

export interface EditorDrawerSlice {
  drawerSearch: string;
  setDrawerSearch: (query: string) => void;
  drawerCollapsed: Record<string, boolean>;
  toggleDrawerGroup: (group: string) => void;
}

export const createEditorDrawerSlice: EditorUiSliceCreator<EditorDrawerSlice> = (set) => ({
  drawerSearch: "",
  setDrawerSearch: (drawerSearch) => set({ drawerSearch }),
  drawerCollapsed: {},
  toggleDrawerGroup: (group) =>
    set((state) => ({
      drawerCollapsed: {
        ...state.drawerCollapsed,
        [group]: !state.drawerCollapsed[group],
      },
    })),
});
