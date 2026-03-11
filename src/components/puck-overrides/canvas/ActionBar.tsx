"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionBarProps {
  label?: string;
  children: ReactNode;
  parentAction: ReactNode;
}

/**
 * ActionBar — overrides the `actionBar` slot of Puck.
 *
 * The floating toolbar that appears above a selected component on the canvas.
 * It exposes the component label, the default Puck actions (drag handle,
 * duplicate, delete, etc.) via `children`, and an optional parent-select
 * action via `parentAction`.
 */
export function ActionBar({ label, children, parentAction }: ActionBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-md border bg-background shadow-md px-1 py-0.5 text-xs"
      )}
      role="toolbar"
      aria-label={label ? `Actions for ${label}` : "Component actions"}
    >
      {/* Component type label */}
      {label && (
        <span className="px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground border-r mr-0.5">
          {label}
        </span>
      )}

      {/* Parent selection */}
      {parentAction && (
        <div className="flex items-center border-r pr-0.5 mr-0.5">
          {parentAction}
        </div>
      )}

      {/* Default Puck actions (drag, duplicate, delete) */}
      <div className="flex items-center gap-0.5">{children}</div>
    </div>
  );
}
