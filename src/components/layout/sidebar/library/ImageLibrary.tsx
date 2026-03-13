"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "../../../ui/input";
import { ScrollArea } from "../../../ui/scroll-area";

// Module-level variable shared with CanvasIframe (same bundle, same origin)
export let pendingImageSrc: string | null = null;

const DEFAULT_SEEDS = [
  "forest", "ocean", "mountain", "city",
  "food", "travel", "abstract", "people",
  "architecture", "animals", "technology", "minimal",
];

function picsumUrl(seed: string, w = 200, h = 150): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

function getDefaultImages(): { src: string; alt: string }[] {
  return DEFAULT_SEEDS.map((seed) => ({ src: picsumUrl(seed), alt: seed }));
}

function getSearchImages(query: string): { src: string; alt: string }[] {
  return Array.from({ length: 12 }, (_, i) => ({
    src: picsumUrl(`${query}-${i}`),
    alt: `${query} ${i + 1}`,
  }));
}

// Ghost element shown while dragging
let ghostEl: HTMLDivElement | null = null;

function createGhost(src: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = `
    position: fixed; top: -9999px; left: -9999px; z-index: 99999;
    width: 80px; height: 60px; border-radius: 6px; overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); pointer-events: none;
  `;
  const img = document.createElement("img");
  img.src = src;
  img.style.cssText = "width:100%;height:100%;object-fit:cover;";
  el.appendChild(img);
  document.body.appendChild(el);
  return el;
}

function moveGhost(x: number, y: number) {
  if (!ghostEl) return;
  ghostEl.style.left = `${x + 12}px`;
  ghostEl.style.top = `${y + 12}px`;
}

function removeGhost() {
  ghostEl?.remove();
  ghostEl = null;
}

export function ImageLibrary(): React.ReactElement {
  const [query, setQuery] = React.useState("");
  const [committed, setCommitted] = React.useState("");
  const [images, setImages] = React.useState<{ src: string; alt: string }[]>(getDefaultImages);

  React.useEffect(() => {
    const t = setTimeout(() => setCommitted(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  React.useEffect(() => {
    setImages(committed ? getSearchImages(committed) : getDefaultImages());
  }, [committed]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>, src: string) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    pendingImageSrc = src;
    ghostEl = createGhost(src);
    moveGhost(e.clientX, e.clientY);
    window.dispatchEvent(new CustomEvent("anvilkit:librarydragstart", { detail: { type: "image" } }));

    function onMove(ev: PointerEvent) {
      moveGhost(ev.clientX, ev.clientY);
    }

    function onUp(ev: PointerEvent) {
      removeGhost();
      pendingImageSrc = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.dispatchEvent(new CustomEvent("anvilkit:imagedrop", {
        detail: { src, clientX: ev.clientX, clientY: ev.clientY },
      }));
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Image Library
      </div>
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 grid grid-cols-2 gap-2">
          {images.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              onPointerDown={(e) => handlePointerDown(e, img.src)}
              className="rounded-md overflow-hidden border border-border bg-muted/40 cursor-grab select-none hover:ring-2 hover:ring-primary/50 active:cursor-grabbing transition-all"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-20 object-cover pointer-events-none"
                loading="lazy"
              />
              <div className="px-1.5 py-1 text-xs text-muted-foreground truncate capitalize">
                {img.alt}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
