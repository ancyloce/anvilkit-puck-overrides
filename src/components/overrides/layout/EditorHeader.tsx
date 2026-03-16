"use client";
import * as React from "react";
import { usePuck } from "@puckeditor/core";
import { Undo2, Redo2, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMsg } from "@/store/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// header override — Puck signature: { actions: ReactNode; children: ReactNode }
export function EditorHeader({
  actions,
  children,
}: {
  actions: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  const { history, appState } = usePuck();
  const undo = useMsg("header.undo");
  const undoTooltip = useMsg("header.undo.tooltip");
  const redo = useMsg("header.redo");
  const redoTooltip = useMsg("header.redo.tooltip");
  const exportLabel = useMsg("header.export");
  const exportJson = useMsg("header.export.json");

  return (
    <TooltipProvider>
      <header className="flex h-12 items-center justify-between border-b bg-background px-4 gap-2">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4"></ArrowLeft>
        </Button>

        <div className="flex items-center gap-1">
          {appState?.data?.root?.props?.title || ''}
        </div>

        <div className="flex items-center gap-2">
        <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!history.hasPast}
                onClick={() => history.back()}
                aria-label={undo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{undoTooltip}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!history.hasFuture}
                onClick={() => history.forward()}
                aria-label={redo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{redoTooltip}</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger aria-label={exportLabel} className="inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground">
                  <Download className="h-4 w-4" />
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>{exportLabel}</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{exportJson}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {actions}
          {/* {children} */}
        </div>
      </header>
    </TooltipProvider>
  );
}

// headerActions override — MUST render {children} (Puck's publish button)
export function EditorHeaderActions({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">{children}</div>
    </TooltipProvider>
  );
}
