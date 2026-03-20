import { createEditorUiStore as _createEditorUiStore } from "./ui";

// Store factories
export { createEditorUiStore } from "./ui";
export type { EditorUiStore, EditorUiStoreApi } from "./ui";

export { createEditorI18nStore } from "./i18n";
export type { EditorI18nStore, EditorI18nStoreApi, Locale, Messages } from "./i18n";

// Context providers + hooks that return the store API
export { EditorUiStoreProvider, useEditorUiStoreApi } from "./ui-context";
export { EditorI18nStoreProvider, useEditorI18nStoreApi } from "./i18n-context";

// Named component hooks
export {
  useActiveTab,
  useSetActiveTab,
  useDrawerSearch,
  useSetDrawerSearch,
  useDrawerCollapsed,
  useToggleDrawerGroup,
  useOutlineExpanded,
  useToggleOutlineItem,
  useCanvasViewport,
  useSetCanvasViewport,
  useCanvasLibraryDragType,
  useSetCanvasLibraryDragType,
  useMsg,
  useLocale,
  useSetLocale,
} from "./hooks";

// Default messages
export { defaultMessages } from "./i18n-defaults";

/**
 * @deprecated Use createEditorUiStore() via EditorUiStoreProvider instead.
 * This singleton will be removed in the next minor version.
 */
export const uiStore = _createEditorUiStore("default");

/** @deprecated Use EditorUiStore instead. */
export type { EditorUiStore as UIStore } from "./ui";
