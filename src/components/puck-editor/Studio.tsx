"use client";

import React from "react";
import { Puck, Data, Config, Overrides } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckOverrides } from "@/components/puck-overrides";

interface StudioProps {
  /** Puck component configuration */
  config: Config;
  /** Initial page data to load into the editor */
  initialData?: Data;
  /** Called when the user saves; receives the current page data */
  onPublish?: (data: Data) => void | Promise<void>;
  /** Selectively override individual Puck UI slots */
  overrides?: Partial<Overrides>;
}

/**
 * Studio — the top-level Puck editor wrapper.
 *
 * Combines the Puck `<Puck>` component with the full Shadcn UI override set
 * from `puck-overrides`.  Consumer-provided `overrides` are merged on top of
 * the default set, so individual slots can be swapped out without losing the
 * rest of the theme.
 *
 * @example
 * ```tsx
 * import { Studio } from "@/components/puck-editor/Studio";
 *
 * const config: Config = { components: { Hero: { ... } } };
 *
 * export default function EditorPage() {
 *   return (
 *     <Studio
 *       config={config}
 *       onPublish={(data) => saveToAPI(data)}
 *     />
 *   );
 * }
 * ```
 */
export function Studio({
  config,
  initialData,
  onPublish,
  overrides,
}: StudioProps) {
  const mergedOverrides: Partial<Overrides> = {
    ...puckOverrides,
    ...overrides,
    // headerActions: render consumer-supplied overrides on top of Puck's
    // default actions (which already include the Publish button when
    // `onPublish` is passed to `<Puck>`).
    headerActions: ({ children }) => (
      <div className="flex items-center gap-2">{children}</div>
    ),
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      <Puck
        config={config}
        data={initialData ?? { content: [], root: { props: {} } }}
        onPublish={onPublish}
        overrides={mergedOverrides}
      />
    </div>
  );
}
