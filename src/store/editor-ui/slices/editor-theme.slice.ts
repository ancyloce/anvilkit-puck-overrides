import type { EditorUiSliceCreator } from "../editor-ui.types";

export type EditorTheme = "light" | "dark";

export interface EditorThemeSlice {
  theme: EditorTheme;
  toggleTheme: () => void;
}

export const createEditorThemeSlice: EditorUiSliceCreator<EditorThemeSlice> = (set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
});
