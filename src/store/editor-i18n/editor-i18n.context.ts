import { getStrictContext } from "@/lib/get-strict-context";
import type { EditorI18nStoreApi } from "./editor-i18n.store";

export const [EditorI18nStoreProvider, useEditorI18nStoreApi] =
  getStrictContext<EditorI18nStoreApi>("EditorI18nStoreProvider");
