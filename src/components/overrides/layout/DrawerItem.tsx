"use client";
import * as React from "react";

// drawerItem + componentItem override
// Puck signature: { children: ReactNode; name: string }
// CRITICAL: must return ReactElement (not undefined/null)
// Puck handles drag internally — we just render the visual
export function DrawerItem({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-2 rounded-md border border-transparent bg-muted/40 px-3 py-2 text-sm cursor-grab select-none transition-colors hover:bg-muted hover:border-border active:cursor-grabbing mb-1">
      <span className="truncate font-medium">{name ?? children}</span>
    </div>
  );
}
