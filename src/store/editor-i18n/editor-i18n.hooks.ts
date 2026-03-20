import { useStore } from "zustand";
import { useEditorI18nStoreApi } from "./editor-i18n.context";

export function useMsg(key: string): string {
  return useStore(useEditorI18nStoreApi(), (state) => state.messages[key] ?? key);
}

export function useLocale() {
  return useStore(useEditorI18nStoreApi(), (state) => state.locale);
}

export function useSetLocale() {
  return useStore(useEditorI18nStoreApi(), (state) => state.setLocale);
}
