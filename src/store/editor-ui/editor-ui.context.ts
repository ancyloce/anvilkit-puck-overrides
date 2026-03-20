import { getStrictContext } from "@/lib/get-strict-context";
import type { EditorUiStoreApi } from "./editor-ui.store";

export const [EditorUiStoreProvider, useEditorUiStoreApi] =
  getStrictContext<EditorUiStoreApi>("EditorUiStoreProvider");
