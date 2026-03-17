"use client";
import * as React from "react";
import { useCanvasThemeSync } from "@/features/canvas/useCanvasThemeSync";
import { useLibraryDropBridge } from "@/features/canvas/useLibraryDropBridge";

// iframe override — Puck signature: { children: ReactNode; document?: Document }
export function CanvasIframe({
  children,
  document: iframeDoc,
}: {
  children: React.ReactNode;
  document?: Document;
}): React.ReactElement {
  useCanvasThemeSync(iframeDoc);
  useLibraryDropBridge(iframeDoc);
  return <>{children}</>;
}
