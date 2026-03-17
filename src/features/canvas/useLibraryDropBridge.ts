"use client";
import * as React from "react";
import { useGetPuck } from "@puckeditor/core";
import {
  LIBRARY_DRAG_START,
  IMAGE_DROP,
  TEXT_DROP,
} from "@/features/library-dnd/drop-contract";
import type {
  LibraryDragType,
  LibraryDragStartDetail,
  ImageDropDetail,
  TextDropDetail,
} from "@/features/library-dnd/drop-contract";
import {
  replaceImageInProps,
  replaceTextInProps,
} from "@/features/library-dnd/replace-props";

/**
 * Bridges library drag events to Puck prop-replacement dispatches.
 * Handles hit-testing inside the iframe, highlight feedback, and cleanup.
 * All global listeners are deterministically removed on unmount or iframeDoc change.
 */
export function useLibraryDropBridge(iframeDoc: Document | undefined): void {
  const getPuck = useGetPuck();

  React.useEffect(() => {
    if (!iframeDoc) return;
    const iframeEl = iframeDoc.defaultView?.frameElement as HTMLIFrameElement | null;
    if (!iframeEl) return;

    let highlightedEl: HTMLElement | null = null;
    let activeLibrary: LibraryDragType | null = null;

    // ── Coordinate helpers ──────────────────────────────────────────────────

    function iframeCoords(
      clientX: number,
      clientY: number,
    ): { x: number; y: number } | null {
      const rect = iframeEl!.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
      return { x, y };
    }

    function getComponentElAt(
      clientX: number,
      clientY: number,
    ): HTMLElement | null {
      const coords = iframeCoords(clientX, clientY);
      if (!coords) return null;
      const el = iframeDoc!.elementFromPoint(coords.x, coords.y);
      if (!el) return null;
      return el.closest("[data-puck-component]") as HTMLElement | null;
    }

    // ── Element finders ─────────────────────────────────────────────────────

    function getImgInComponent(
      compEl: HTMLElement,
      clientX: number,
      clientY: number,
    ): HTMLImageElement | null {
      const imgs = Array.from(compEl.querySelectorAll("img"));
      if (!imgs.length) return null;
      if (imgs.length === 1) return imgs[0] as HTMLImageElement;
      const rect = iframeEl!.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      let closest: HTMLImageElement | null = null;
      let minDist = Infinity;
      for (const img of imgs) {
        const r = img.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(cx - x, cy - y);
        if (dist < minDist) {
          minDist = dist;
          closest = img as HTMLImageElement;
        }
      }
      return closest;
    }

    const TEXT_TAGS = new Set([
      "P", "H1", "H2", "H3", "H4", "H5", "H6",
      "SPAN", "A", "LI", "BUTTON", "LABEL",
    ]);

    function getTextElInComponent(
      compEl: HTMLElement,
      clientX: number,
      clientY: number,
    ): HTMLElement | null {
      const coords = iframeCoords(clientX, clientY);
      if (!coords) return null;
      const el = iframeDoc!.elementFromPoint(coords.x, coords.y);
      if (el && compEl.contains(el)) {
        let cur: Element | null = el;
        while (cur && cur !== iframeDoc!.body) {
          if (TEXT_TAGS.has(cur.tagName) && cur.textContent?.trim())
            return cur as HTMLElement;
          cur = cur.parentElement;
        }
      }
      for (const tag of TEXT_TAGS) {
        const found = compEl.querySelector(tag.toLowerCase());
        if (found?.textContent?.trim()) return found as HTMLElement;
      }
      return null;
    }

    // ── Highlight helpers ───────────────────────────────────────────────────

    function setHighlight(el: HTMLElement | null, color: string): void {
      if (highlightedEl && highlightedEl !== el) {
        highlightedEl.style.outline = "";
        highlightedEl.style.outlineOffset = "";
      }
      if (el) {
        el.style.outline = `2px solid ${color}`;
        el.style.outlineOffset = "2px";
      }
      highlightedEl = el;
    }

    function clearHighlight(): void {
      setHighlight(null, "");
    }

    // ── Puck dispatch ───────────────────────────────────────────────────────

    function dispatchReplace(
      componentId: string,
      updatedProps: Record<string, unknown>,
    ): boolean {
      const { dispatch, getItemById, getSelectorForId } = getPuck();
      const item = getItemById(componentId);
      const selector = getSelectorForId(componentId);
      if (!item || !selector) return false;
      dispatch({
        type: "replace",
        destinationIndex: selector.index,
        destinationZone: selector.zone,
        data: {
          ...item,
          props: { ...item.props, ...updatedProps } as typeof item.props,
        },
      });
      return true;
    }

    // ── Event handlers ──────────────────────────────────────────────────────

    function onLibraryDragStart(e: Event): void {
      activeLibrary = (e as CustomEvent<LibraryDragStartDetail>).detail.type;
    }

    function onPointerMove(e: PointerEvent): void {
      if (!activeLibrary) return;
      const compEl = getComponentElAt(e.clientX, e.clientY);
      if (!compEl) {
        clearHighlight();
        return;
      }
      if (activeLibrary === "image") {
        setHighlight(getImgInComponent(compEl, e.clientX, e.clientY), "#6366f1");
      } else {
        setHighlight(getTextElInComponent(compEl, e.clientX, e.clientY), "#f59e0b");
      }
    }

    function onPointerUp(): void {
      activeLibrary = null;
      clearHighlight();
    }

    function onImageDrop(e: Event): void {
      const { src, clientX, clientY } = (e as CustomEvent<ImageDropDetail>).detail;
      clearHighlight();
      activeLibrary = null;
      if (!src) return;
      const compEl = getComponentElAt(clientX, clientY);
      if (!compEl) return;
      const componentId = compEl.getAttribute("data-puck-component")!;
      const item = getPuck().getItemById(componentId);
      if (!item) return;
      const updatedProps = replaceImageInProps(
        item.props as Record<string, unknown>,
        src,
      );
      dispatchReplace(componentId, updatedProps);
    }

    function onTextDrop(e: Event): void {
      const { text, clientX, clientY } = (e as CustomEvent<TextDropDetail>).detail;
      clearHighlight();
      activeLibrary = null;
      if (!text) return;
      const compEl = getComponentElAt(clientX, clientY);
      if (!compEl) return;
      const componentId = compEl.getAttribute("data-puck-component")!;
      const textEl = getTextElInComponent(compEl, clientX, clientY);
      const targetText = textEl?.textContent?.trim() ?? "";
      const item = getPuck().getItemById(componentId);
      if (!item) return;
      const { result: updatedProps, replaced } = replaceTextInProps(
        item.props as Record<string, unknown>,
        text,
        targetText,
      );
      if (replaced) dispatchReplace(componentId, updatedProps);
    }

    // ── Register / cleanup ──────────────────────────────────────────────────

    window.addEventListener(LIBRARY_DRAG_START, onLibraryDragStart);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener(IMAGE_DROP, onImageDrop);
    window.addEventListener(TEXT_DROP, onTextDrop);

    return () => {
      window.removeEventListener(LIBRARY_DRAG_START, onLibraryDragStart);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener(IMAGE_DROP, onImageDrop);
      window.removeEventListener(TEXT_DROP, onTextDrop);
      clearHighlight();
    };
  }, [iframeDoc, getPuck]);
}
