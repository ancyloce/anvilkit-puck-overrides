"use client";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import {
  getClippingAncestors,
  getScrollableAncestors,
  getVisibleBounds,
} from "@/lib/canvas/action-bar";
import { useCanvasZoom } from "@/store/editor-ui";

const ACTION_BAR_EDGE_PADDING = 8;

// actionBar override — Puck signature: { children: ReactNode; label?: string; parentAction: ReactNode }
// We render Puck's built-in children (which include delete/duplicate) + label + parentAction
export function ActionBar({
  children,
  label,
  parentAction,
}: {
  children: React.ReactNode;
  label?: string;
  parentAction: React.ReactNode;
}): React.ReactElement {
  const canvasZoom = useCanvasZoom();
  const actionBarShellRef = React.useRef<HTMLDivElement | null>(null);
  const actionBarRef = React.useRef<HTMLDivElement | null>(null);
  const [translateX, setTranslateX] = React.useState(0);

  React.useLayoutEffect(() => {
    const actionBarShellElement = actionBarShellRef.current;
    const actionBarElement = actionBarRef.current;
    if (!actionBarShellElement || !actionBarElement) return;

    const ownerWindow = actionBarElement.ownerDocument.defaultView;
    if (!ownerWindow) return;

    const clippingAncestors = getClippingAncestors(actionBarElement);
    const scrollableAncestors = getScrollableAncestors(actionBarElement);
    let animationFrameId = 0;

    const updatePosition = () => {
      const previousTransform = actionBarShellElement.style.transform;
      actionBarShellElement.style.transform = "translateX(0px)";

      const actionBarRect = actionBarElement.getBoundingClientRect();
      const visibleBounds = getVisibleBounds(actionBarElement);

      actionBarShellElement.style.transform = previousTransform;

      if (!visibleBounds) {
        setTranslateX(0);
        return;
      }

      const minLeft = visibleBounds.left + ACTION_BAR_EDGE_PADDING;
      const maxRight = visibleBounds.right - ACTION_BAR_EDGE_PADDING;
      const availableWidth = Math.max(maxRight - minLeft, 0);

      let nextTranslateX = 0;

      if (availableWidth <= 0) {
        nextTranslateX = 0;
      } else if (actionBarRect.width > availableWidth) {
        nextTranslateX = maxRight - actionBarRect.right;
      } else {
        if (actionBarRect.right > maxRight) {
          nextTranslateX += maxRight - actionBarRect.right;
        }

        if (actionBarRect.left + nextTranslateX < minLeft) {
          nextTranslateX += minLeft - (actionBarRect.left + nextTranslateX);
        }
      }

      if (Math.abs(nextTranslateX) < 0.5) {
        nextTranslateX = 0;
      }

      setTranslateX((previousTranslateX) =>
        Math.abs(previousTranslateX - nextTranslateX) < 0.5
          ? previousTranslateX
          : nextTranslateX,
      );
    };

    const scheduleUpdatePosition = () => {
      if (animationFrameId !== 0) return;

      animationFrameId = ownerWindow.requestAnimationFrame(() => {
        animationFrameId = 0;
        updatePosition();
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdatePosition();
    });

    resizeObserver.observe(actionBarShellElement);
    resizeObserver.observe(actionBarElement);
    clippingAncestors.forEach((ancestorElement) => {
      resizeObserver.observe(ancestorElement);
    });

    scrollableAncestors.forEach((ancestorElement) => {
      ancestorElement.addEventListener("scroll", scheduleUpdatePosition, {
        passive: true,
      });
    });

    ownerWindow.addEventListener("resize", scheduleUpdatePosition);

    scheduleUpdatePosition();

    return () => {
      if (animationFrameId !== 0) {
        ownerWindow.cancelAnimationFrame(animationFrameId);
      }

      ownerWindow.removeEventListener("resize", scheduleUpdatePosition);
      scrollableAncestors.forEach((ancestorElement) => {
        ancestorElement.removeEventListener("scroll", scheduleUpdatePosition);
      });
      resizeObserver.disconnect();
    };
  }, [canvasZoom, children, label, parentAction]);

  return (
    <div
      ref={actionBarShellRef}
      className="inline-block"
      style={{
        transform: translateX === 0 ? undefined : `translateX(${translateX}px)`,
      }}
    >
      <div
        ref={actionBarRef}
        className="flex items-center gap-0.5 rounded-sm border border-border bg-background px-1 py-0.5"
        style={{
          transform: canvasZoom === 1 ? undefined : `scale(${1 / canvasZoom})`,
          transformOrigin: "top",
        }}
      >
        {label && (
          <>
            <span className="px-2 text-xs font-medium text-muted-foreground truncate max-w-[120px]">
              {label}
            </span>
            <Separator orientation="vertical" className="h-5" />
          </>
        )}

        {parentAction && (
          <>
            {parentAction}
            <Separator orientation="vertical" className="h-5" />
          </>
        )}

        {/* Puck's built-in action buttons (duplicate, delete, move) */}
        {children}
      </div>
    </div>
  );
}
