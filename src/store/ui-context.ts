import { getStrictContext } from "@/lib/get-strict-context";
import type { EditorUiStoreApi } from "./ui";

export const [EditorUiStoreProvider, useEditorUiStoreApi] =
  getStrictContext<EditorUiStoreApi>("EditorUiStoreProvider");
