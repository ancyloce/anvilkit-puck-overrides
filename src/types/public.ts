/**
 * Stable public types for @anvilkit/puck-studio.
 * All consumer-facing types are re-exported from here so internal paths
 * can be refactored without breaking the public API.
 */

// Component prop types
export type { StudioProps } from "@/components/editor/Studio";
export type { ImagesProps, ImageItem } from "@/components/layout/sidebar/library/ImageLibrary";
export type { CopywritingProps, CopywritingItem } from "@/components/layout/sidebar/library/CopyLibrary";

// Store types
export type {
  EditorUiStore,
  EditorUiStoreApi,
  ActiveTab,
} from "@/store/ui";

export type {
  EditorI18nStoreApi,
  Locale,
  Messages,
} from "@/store/i18n";
