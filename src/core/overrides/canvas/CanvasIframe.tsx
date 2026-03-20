"use client";
import * as React from "react";
import { useThemeSync } from "@/features/theme/useThemeSync";
import { useCanvasLibraryDropBridge } from "@/hooks/use-canvas-library-drop-bridge";

// iframe override — Puck signature: { children: ReactNode; document?: Document }
export function CanvasIframe({
  children,
  document: iframeDoc,
}: {
  children: React.ReactNode;
  document?: Document;
}): React.ReactElement {
  useThemeSync({ document: iframeDoc, injectCanvasCss: true });
  useCanvasLibraryDropBridge(iframeDoc);

  return <>{children}</>;
}
