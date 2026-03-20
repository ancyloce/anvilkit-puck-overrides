import type { StateCreator } from "zustand";
import type { EditorCanvasSlice } from "./slices/editor-canvas.slice";
import type { EditorDrawerSlice } from "./slices/editor-drawer.slice";
import type { EditorOutlineSlice } from "./slices/editor-outline.slice";
import type { EditorSidebarSlice } from "./slices/editor-sidebar.slice";
import type { EditorThemeSlice } from "./slices/editor-theme.slice";

export type EditorUiStore = EditorDrawerSlice &
  EditorSidebarSlice &
  EditorOutlineSlice &
  EditorThemeSlice &
  EditorCanvasSlice;

export type EditorUiStoreMutators = [["zustand/persist", unknown]];

export type EditorUiSliceCreator<TSlice> = StateCreator<
  EditorUiStore,
  EditorUiStoreMutators,
  [],
  TSlice
>;
