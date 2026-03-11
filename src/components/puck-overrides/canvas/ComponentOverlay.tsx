"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ComponentOverlayProps {
  children: ReactNode;
  hover: boolean;
  isSelected: boolean;
  componentId: string;
  componentType: string;
}

/**
 * ComponentOverlay — overrides the `componentOverlay` slot of Puck.
 *
 * Renders the interactive overlay that appears over each component on the
 * canvas during hover and selection states.  Uses Shadcn-compatible colour
 * tokens so the overlay blends with the editor theme.
 */
export function ComponentOverlay({
  children,
  hover,
  isSelected,
  componentType,
}: ComponentOverlayProps) {
  return (
    <div
      className={cn(
        "relative group",
        hover && !isSelected && "outline outline-2 outline-primary/30 rounded-sm",
        isSelected &&
          "outline outline-2 outline-primary rounded-sm"
      )}
      data-component-type={componentType}
    >
      {/* Selected / hovered label badge */}
      {(hover || isSelected) && (
        <div
          className={cn(
            "pointer-events-none absolute -top-5 left-0 z-50 flex items-center gap-1 rounded-t px-1.5 py-0.5 text-[10px] font-medium leading-none",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-primary/20 text-primary"
          )}
        >
          {componentType}
        </div>
      )}

      {children}
    </div>
  );
}
