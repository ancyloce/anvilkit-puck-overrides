import type { EditorUiSliceCreator } from "../editor-ui.types";

export interface EditorOutlineSlice {
  outlineExpanded: Record<string, boolean>;
  toggleOutlineItem: (id: string) => void;
}

export const createEditorOutlineSlice: EditorUiSliceCreator<EditorOutlineSlice> = (set) => ({
  outlineExpanded: {},
  toggleOutlineItem: (id) =>
    set((state) => ({
      outlineExpanded: {
        ...state.outlineExpanded,
        [id]: !state.outlineExpanded[id],
      },
    })),
});
