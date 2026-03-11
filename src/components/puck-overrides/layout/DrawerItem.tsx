"use client";

import React, { ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerItemProps {
  children: ReactNode;
  name: string;
}

/**
 * DrawerItem — overrides the `drawerItem` slot of Puck.
 *
 * Each entry in the component drawer is wrapped in a styled card that shows the
 * component name and a drag handle icon.  The inner `children` element provided
 * by Puck carries the actual drag behaviour; this wrapper adds visual polish.
 */
export function DrawerItem({ children, name }: DrawerItemProps) {
  return (
    <div
      className={cn(
        "group flex cursor-grab items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-card-foreground shadow-sm",
        "transition-colors hover:border-primary/50 hover:bg-accent hover:text-accent-foreground",
        "active:cursor-grabbing active:opacity-75"
      )}
      title={`Drag ${name} onto the canvas`}
    >
      <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
      {/* Puck's inner drag wrapper */}
      <span className="flex-1 truncate">{children}</span>
    </div>
  );
}
