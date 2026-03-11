"use client";

import React from "react";
import { usePuck } from "@measured/puck";
import { ChevronRight, Layers } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * EditorOutline — overrides the `outline` slot of Puck.
 *
 * Renders a hierarchical tree of all components in the current page data,
 * allowing quick navigation and selection from the inspector panel.
 */
export function EditorOutline() {
  const { appState, dispatch } = usePuck();
  const { data, ui } = appState;

  const selectedId = ui.itemSelector
    ? data.content[ui.itemSelector.index]?.props?.id
    : null;

  return (
    <div className="flex h-full flex-col">
      {/* Panel header */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Outline
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {data.content.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              No components yet
            </p>
          ) : (
            data.content.map((item, index) => {
              const id = item.props?.id as string | undefined;
              const isSelected = id != null && id === selectedId;

              return (
                <button
                  key={id ?? index}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground text-foreground"
                  )}
                  onClick={() =>
                    dispatch({
                      type: "setUi",
                      ui: { itemSelector: { index, zone: "default-zone" } },
                    })
                  }
                  aria-pressed={isSelected}
                >
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                  <span className="truncate">{item.type as string}</span>
                  {id && (
                    <span className="ml-auto truncate text-[10px] opacity-50">
                      #{id.slice(-6)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
