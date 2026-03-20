import { useStore } from "zustand";
import { useEditorUiStoreApi } from "./editor-ui.context";

export function useActiveTab() {
  return useStore(useEditorUiStoreApi(), (state) => state.activeTab);
}

export function useSetActiveTab() {
  return useStore(useEditorUiStoreApi(), (state) => state.setActiveTab);
}

export function useDrawerSearch() {
  return useStore(useEditorUiStoreApi(), (state) => state.drawerSearch);
}

export function useSetDrawerSearch() {
  return useStore(useEditorUiStoreApi(), (state) => state.setDrawerSearch);
}

export function useDrawerCollapsed(group: string) {
  return useStore(useEditorUiStoreApi(), (state) => state.drawerCollapsed[group] ?? false);
}

export function useToggleDrawerGroup() {
  return useStore(useEditorUiStoreApi(), (state) => state.toggleDrawerGroup);
}

export function useOutlineExpanded(id: string) {
  return useStore(useEditorUiStoreApi(), (state) => state.outlineExpanded[id] ?? false);
}

export function useToggleOutlineItem() {
  return useStore(useEditorUiStoreApi(), (state) => state.toggleOutlineItem);
}

export function useCanvasViewport() {
  return useStore(useEditorUiStoreApi(), (state) => state.canvasViewport);
}

export function useSetCanvasViewport() {
  return useStore(useEditorUiStoreApi(), (state) => state.setCanvasViewport);
}

export function useCanvasLibraryDragType() {
  return useStore(useEditorUiStoreApi(), (state) => state.canvasLibraryDragType);
}

export function useSetCanvasLibraryDragType() {
  return useStore(useEditorUiStoreApi(), (state) => state.setCanvasLibraryDragType);
}

export function useTheme() {
  return useStore(useEditorUiStoreApi(), (state) => state.theme);
}

export function useToggleTheme() {
  return useStore(useEditorUiStoreApi(), (state) => state.toggleTheme);
}
