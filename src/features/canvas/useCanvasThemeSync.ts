"use client";
import * as React from "react";
import { useTheme } from "@/store/hooks";

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
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border: 217.2 32.6% 17.5%;
  }
  body { margin: 0; font-family: system-ui, sans-serif; }
`;

/**
 * Injects base CSS into the Puck iframe document and keeps the dark-mode
 * class in sync with the editor theme store.
 */
export function useCanvasThemeSync(iframeDoc: Document | undefined): void {
  // Inject styles once per iframeDoc instance
  React.useEffect(() => {
    if (!iframeDoc) return;
    const existing = iframeDoc.getElementById("__anvilkit_styles__");
    if (existing) existing.remove();
    const style = iframeDoc.createElement("style");
    style.id = "__anvilkit_styles__";
    style.textContent = CANVAS_CSS;
    iframeDoc.head.appendChild(style);
  }, [iframeDoc]);

  // Keep dark class in sync with store theme
  const theme = useTheme();
  React.useEffect(() => {
    if (!iframeDoc) return;
    iframeDoc.documentElement.classList.toggle("dark", theme === "dark");
  }, [iframeDoc, theme]);
}
