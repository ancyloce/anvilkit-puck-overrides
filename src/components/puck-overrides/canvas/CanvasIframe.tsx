"use client";

import React, { ReactNode } from "react";

interface CanvasIframeProps {
  children: ReactNode;
  document?: Document;
}

/**
 * CanvasIframe — overrides the `iframe` slot of Puck.
 *
 * Copies all `<link rel="stylesheet">` and `<style>` tags from the host
 * document into the iframe's `<head>` so that Tailwind utility classes
 * and global CSS variables resolve correctly inside the sandboxed canvas.
 *
 * This avoids hard-coding build-output paths and works correctly in both
 * development and production.
 */
export function CanvasIframe({ children, document: iframeDoc }: CanvasIframeProps) {
  React.useEffect(() => {
    if (!iframeDoc || typeof window === "undefined") return;

    // Mark injected nodes so we don't duplicate them on re-renders.
    const MARKER = "data-puck-injected";

    const hostNodes = Array.from(
      document.querySelectorAll(`link[rel="stylesheet"], style`)
    );

    for (const node of hostNodes) {
      const key = (node as HTMLLinkElement).href ?? (node as HTMLStyleElement).textContent?.slice(0, 60);
      const alreadyInjected = Array.from(
        iframeDoc.head.querySelectorAll(`[${MARKER}]`)
      ).some((el) => el.getAttribute(MARKER) === key);

      if (alreadyInjected) continue;

      const clone = node.cloneNode(true) as HTMLElement;
      clone.setAttribute(MARKER, key ?? "");
      iframeDoc.head.appendChild(clone);
    }
  }, [iframeDoc]);

  return <>{children}</>;
}
