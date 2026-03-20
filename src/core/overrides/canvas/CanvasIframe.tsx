"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/components/ui/utils";
import { useThemeSync } from "@/features/theme/useThemeSync";
import { usePuckSelector } from "@/lib/use-puck-selector";
import { useCanvasViewport, useMsg, useSetCanvasViewport } from "@/store/hooks";
import { useReportStudioAction } from "@/core/studio/useReportStudioAction";
import { Redo2, Undo2 } from "lucide-react";
import {
  canvasViewportOrder,
  canvasViewportPresets,
  getCanvasViewportWidth,
} from "./viewports";
import { useLibraryDropBridge } from "./useLibraryDropBridge";

// iframe override — Puck signature: { children: ReactNode; document?: Document }
export function CanvasIframe({
  children,
  document: iframeDoc,
}: {
  children: React.ReactNode;
  document?: Document;
}): React.ReactElement {
  useThemeSync({ document: iframeDoc, injectCanvasCss: true });
  useLibraryDropBridge(iframeDoc);

  const history = usePuckSelector((state) => state.history);
  const canvasViewport = useCanvasViewport();
  const setCanvasViewport = useSetCanvasViewport();
  const reportStudioAction = useReportStudioAction();

  const undo = useMsg("header.undo");
  const undoTooltip = useMsg("header.undo.tooltip");
  const redo = useMsg("header.redo");
  const redoTooltip = useMsg("header.redo.tooltip");
  const mobileLabel = useMsg("canvas.viewport.mobile");
  const mobileTooltip = useMsg("canvas.viewport.mobile.tooltip");
  const tabletLabel = useMsg("canvas.viewport.tablet");
  const tabletTooltip = useMsg("canvas.viewport.tablet.tooltip");
  const desktopLabel = useMsg("canvas.viewport.desktop");
  const desktopTooltip = useMsg("canvas.viewport.desktop.tooltip");

  const viewportLabels = React.useMemo(
    () => ({
      mobile: { label: mobileLabel, tooltip: mobileTooltip },
      tablet: { label: tabletLabel, tooltip: tabletTooltip },
      desktop: { label: desktopLabel, tooltip: desktopTooltip },
    }),
    [
      desktopLabel,
      desktopTooltip,
      mobileLabel,
      mobileTooltip,
      tabletLabel,
      tabletTooltip,
    ],
  );

  const handleToolbarMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // Keep focus from jumping into the iframe chrome before the history action runs.
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  const handleUndo = React.useCallback(() => {
    history.back();
    reportStudioAction("undo");
  }, [history, reportStudioAction]);

  const handleRedo = React.useCallback(() => {
    history.forward();
    reportStudioAction("redo");
  }, [history, reportStudioAction]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-neutral-100/70 text-foreground dark:bg-neutral-950/90">
        <div className="sticky top-0 z-50 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/88">
          <div className="flex items-center justify-between gap-3 px-3 py-2">
            <ButtonGroup className="rounded-xl shadow-xs">
              {canvasViewportOrder.map((viewport) => {
                const preset = canvasViewportPresets[viewport];
                const { label, tooltip } = viewportLabels[viewport];
                const isActive = viewport === canvasViewport;
                const Icon = preset.icon;

                return (
                  <Tooltip key={preset.value}>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          aria-label={label}
                          aria-pressed={isActive}
                          onClick={() => {
                            if (!isActive) {
                              setCanvasViewport(viewport);
                            }
                          }}
                          className={cn(
                            "h-8 gap-1.5 px-2.5 text-xs",
                            isActive &&
                              "bg-muted text-foreground dark:border-input dark:bg-input/50",
                            !isActive && "text-muted-foreground",
                          )}
                        />
                      }
                    >
                      <Icon className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>{tooltip}</TooltipContent>
                  </Tooltip>
                );
              })}
            </ButtonGroup>

            <ButtonGroup>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={!history.hasPast}
                      onMouseDown={handleToolbarMouseDown}
                      onClick={handleUndo}
                      aria-label={undo}
                    />
                  }
                >
                  <Undo2 className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>{undoTooltip}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={!history.hasFuture}
                      onMouseDown={handleToolbarMouseDown}
                      onClick={handleRedo}
                      aria-label={redo}
                    />
                  }
                >
                  <Redo2 className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>{redoTooltip}</TooltipContent>
              </Tooltip>
            </ButtonGroup>
          </div>
        </div>

        <div className="px-3 py-2 md:px-2 md:py-2">
          <div
            className="mx-auto w-full transition-[width] duration-200 ease-out rounded-md overflow-hidden"
            style={{ width: getCanvasViewportWidth(canvasViewport) }}
          >
            {children}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
