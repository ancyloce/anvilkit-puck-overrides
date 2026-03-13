"use client";
import * as React from "react";
import { FieldLabel } from "../FieldWrapper";

interface ArrayFieldProps {
  field: {
    type: "array";
    arrayFields: Record<string, unknown>;
    getItemSummary?: (item: unknown, index: number) => string;
    defaultItemProps?: Record<string, unknown> | ((index: number) => Record<string, unknown>);
    max?: number;
    min?: number;
    label?: string;
  };
  value: unknown[];
  onChange: (value: unknown[]) => void;
  id?: string;
  readOnly?: boolean;
  label?: string;
  name?: string;
  // Puck renders the full array UI (items + add/remove controls) as children
  children?: React.ReactNode;
}

export function ArrayField({ field, label, readOnly, children }: ArrayFieldProps) {
  return (
    <FieldLabel label={label ?? field.label ?? ""} readOnly={readOnly} el="div">
      {children}
    </FieldLabel>
  );
}
