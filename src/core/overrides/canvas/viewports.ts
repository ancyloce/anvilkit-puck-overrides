import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CanvasViewport } from "@/store/ui";

interface CanvasViewportPreset {
  icon: LucideIcon;
  labelKey: string;
  tooltipKey: string;
  value: CanvasViewport;
  width: number;
}

export const canvasViewportOrder: CanvasViewport[] = [
  "mobile",
  "tablet",
  "desktop",
];

export const canvasViewportPresets: Record<CanvasViewport, CanvasViewportPreset> =
  {
    mobile: {
      icon: Smartphone,
      labelKey: "canvas.viewport.mobile",
      tooltipKey: "canvas.viewport.mobile.tooltip",
      value: "mobile",
      width: 390,
    },
    tablet: {
      icon: Tablet,
      labelKey: "canvas.viewport.tablet",
      tooltipKey: "canvas.viewport.tablet.tooltip",
      value: "tablet",
      width: 768,
    },
    desktop: {
      icon: Monitor,
      labelKey: "canvas.viewport.desktop",
      tooltipKey: "canvas.viewport.desktop.tooltip",
      value: "desktop",
      width: 1280,
    },
  };

export function getCanvasViewportWidth(viewport: CanvasViewport): string {
  return `min(100%, ${canvasViewportPresets[viewport].width}px)`;
}
