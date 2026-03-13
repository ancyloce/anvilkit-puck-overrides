"use client";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

// fields override — exact Puck signature: { children, isLoading, itemSelector }
export function FieldWrapper({
  children,
}: {
  children?: React.ReactNode;
  isLoading?: boolean;
  itemSelector?: unknown;
}): React.ReactElement {
  console.log(" the FieldWrapper is called");
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4">{children}</div>
    </ScrollArea>
  );
}

// fieldLabel override — exact Puck signature: { children?, icon?, label, el?, readOnly?, className? }
export function FieldLabel({
  children,
  label,
  icon,
  el,
  readOnly,
  className,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  label: string;
  el?: "label" | "div";
  readOnly?: boolean;
  className?: string;
}): React.ReactElement {
  console.log(" the label is ", label);
  const El = el ?? "div";
  console.log("label", label);
  return (
    <TooltipProvider>
      <El className={`flex flex-col gap-1.5 ${className ?? ""}`}>
        <div className="flex items-center gap-1">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
          {label && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          )}
          {readOnly && (
            <span className="ml-auto text-xs text-muted-foreground/50">Read only</span>
          )}
        </div>
        {children}
      </El>
    </TooltipProvider>
  );
}
