"use client";
import * as React from "react";

// preview override — Puck signature: { children: ReactNode }
// Keep lightweight — no Radix components
export function CanvasPreview({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <div className="h-full w-full px-3 py-2">{children}</div>;
}
