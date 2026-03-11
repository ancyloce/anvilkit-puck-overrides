"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CanvasPreviewProps {
  children?: ReactNode;
}

/**
 * CanvasPreview — overrides the `preview` slot of Puck.
 *
 * Provides a styled wrapper around the live canvas area.  A subtle ring and
 * rounded corners help visually delineate the editing surface.
 */
export function CanvasPreview({ children }: CanvasPreviewProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-start justify-center overflow-auto bg-muted p-4"
      )}
    >
      <div className="relative w-full overflow-hidden rounded-md border bg-background shadow-sm transition-all">
        {children}
      </div>
    </div>
  );
}
