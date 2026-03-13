"use client";
import * as React from "react";

// iframe override — Puck signature: { children: ReactNode; document?: Document }
// CRITICAL: inject CSS into the document prop Puck passes directly
const CANVAS_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }
  body { margin: 0; font-family: system-ui, sans-serif; }
`;

export function CanvasIframe({
  children,
  document: iframeDoc,
}: {
  children: React.ReactNode;
  document?: Document;
}): React.ReactElement {
  React.useEffect(() => {
    if (!iframeDoc) return;
    const existing = iframeDoc.getElementById("__anvilkit_styles__");
    if (existing) existing.remove();
    const style = iframeDoc.createElement("style");
    style.id = "__anvilkit_styles__";
    style.textContent = CANVAS_CSS;
    iframeDoc.head.appendChild(style);
  }, [iframeDoc]);

  return <>{children}</>;
}
