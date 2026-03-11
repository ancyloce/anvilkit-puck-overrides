"use client";

import React, { ReactNode } from "react";
import { Undo2, Redo2, Monitor, Tablet, Smartphone } from "lucide-react";
import { usePuck } from "@measured/puck";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorHeaderProps {
  actions: ReactNode;
  children: ReactNode;
}

/** Viewport preset widths */
const VIEWPORT_WIDTHS = { desktop: 1280, tablet: 768, mobile: 390 } as const;
type ViewportId = keyof typeof VIEWPORT_WIDTHS;

/**
 * EditorHeader — overrides the `header` slot of Puck.
 *
 * Provides undo/redo controls, viewport switching buttons, and a right-side
 * actions area (publish button, export menu, etc.) styled with Shadcn UI.
 */
export function EditorHeader({ actions, children }: EditorHeaderProps) {
  const { history, appState, dispatch } = usePuck();

  const currentWidth = appState.ui.viewports.current.width;

  const viewports = [
    { id: "desktop" as ViewportId, label: "Desktop", icon: <Monitor className="h-4 w-4" /> },
    { id: "tablet" as ViewportId, label: "Tablet", icon: <Tablet className="h-4 w-4" /> },
    { id: "mobile" as ViewportId, label: "Mobile", icon: <Smartphone className="h-4 w-4" /> },
  ];

  return (
    <TooltipProvider>
      <header className="flex h-14 items-center justify-between border-b bg-background px-4 shadow-sm">
        {/* Left — editor title / logo area */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">
            Puck Editor
          </span>
          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Undo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => history.back()}
                disabled={!history.hasPast}
                aria-label="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Undo</TooltipContent>
          </Tooltip>

          {/* Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => history.forward()}
                disabled={!history.hasFuture}
                aria-label="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Redo</TooltipContent>
          </Tooltip>
        </div>

        {/* Centre — viewport switcher */}
        <div className="flex items-center gap-1 rounded-md border p-1">
          {viewports.map((vp) => (
            <Tooltip key={vp.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={currentWidth === VIEWPORT_WIDTHS[vp.id] ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    dispatch({
                      type: "setUi",
                      ui: {
                        viewports: {
                          ...appState.ui.viewports,
                          current: {
                            width: VIEWPORT_WIDTHS[vp.id],
                            height: "auto",
                          },
                        },
                      },
                    })
                  }
                  aria-label={vp.label}
                >
                  {vp.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{vp.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Right — injected action buttons (publish, export, etc.) */}
        <div className="flex items-center gap-2">
          {actions}
          {children}
        </div>
      </header>
    </TooltipProvider>
  );
}
