import type { EditorUiSliceCreator } from "../editor-ui.types";

export const EDITOR_SIDEBAR_TABS = [
  "insert",
  "layer",
  "image",
  "text",
  "copilot",
] as const;

export type EditorSidebarTab = (typeof EDITOR_SIDEBAR_TABS)[number];
export type ActiveTab = EditorSidebarTab;

const editorSidebarTabSet = new Set<string>(EDITOR_SIDEBAR_TABS);

export function isEditorSidebarTab(value: string): value is EditorSidebarTab {
  return editorSidebarTabSet.has(value);
}

export const ACTIVE_TABS = EDITOR_SIDEBAR_TABS;

export function isActiveTab(value: string): value is ActiveTab {
  return isEditorSidebarTab(value);
}

export interface EditorSidebarSlice {
  activeTab: EditorSidebarTab;
  setActiveTab: (tab: EditorSidebarTab) => void;
}

export const createEditorSidebarSlice: EditorUiSliceCreator<EditorSidebarSlice> = (set) => ({
  activeTab: "insert",
  setActiveTab: (activeTab) => set({ activeTab }),
});
