import { createStore } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = string;
export type Messages = Record<string, string>;

export interface I18nState {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale, messages: Messages) => void;
}

export type EditorI18nStore = I18nState;

export type EditorI18nStoreApi = ReturnType<typeof createEditorI18nStore>;

export function createEditorI18nStore(initial: { locale: Locale; messages: Messages }) {
  return createStore<I18nState>()(
    persist(
      (set) => ({
        locale: initial.locale,
        messages: initial.messages,
        setLocale: (locale, messages) => set({ locale, messages }),
      }),
      {
        name: "anvilkit-i18n",
        // Only persist locale — messages are re-loaded from props on mount
        partialize: (s) => ({ locale: s.locale }),
      }
    )
  );
}
