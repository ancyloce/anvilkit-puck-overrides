"use client";

import React, { ReactNode } from "react";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  children?: ReactNode;
  icon?: ReactNode;
  label: string;
  el?: "label" | "div";
  readOnly?: boolean;
  className?: string;
}

/**
 * FieldWrapper — overrides the `fieldLabel` slot of Puck.
 *
 * Wraps every field in the inspector panel with a styled label, an optional
 * icon, and a read-only badge when the field is not editable.
 */
export function FieldWrapper({
  children,
  icon,
  label,
  el = "div",
  readOnly = false,
  className,
}: FieldWrapperProps) {
  const labelText = (
    <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
      {icon && (
        <span className="text-muted-foreground [&_svg]:h-3.5 [&_svg]:w-3.5">
          {icon}
        </span>
      )}
      {label}
      {readOnly && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Info className="h-3 w-3 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">This field is read-only</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </span>
  );

  return (
    <div className={cn("flex flex-col gap-1.5 py-1.5", className)}>
      {el === "label" ? (
        <Label
          className={cn(
            "flex flex-col gap-1.5",
            readOnly && "opacity-60 cursor-not-allowed"
          )}
        >
          {labelText}
          {children}
        </Label>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-1.5",
            readOnly && "opacity-60 cursor-not-allowed pointer-events-none"
          )}
        >
          {labelText}
          {children}
        </div>
      )}
    </div>
  );
}
