"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { FieldLabel } from "../FieldWrapper";

interface ArrayFieldProps {
  field: {
    type: "array";
    arrayFields: Record<string, unknown>;
    getItemSummary?: (item: unknown, index: number) => string;
    defaultItemProps?: Record<string, unknown> | ((index: number) => Record<string, unknown>);
    max?: number;
    min?: number;
  };
  value: unknown[];
  onChange: (value: unknown[]) => void;
  id?: string;
  readOnly?: boolean;
  label?: string;
  // Puck also passes renderItem for rendering nested fields
  renderItem?: (item: unknown, index: number) => React.ReactNode;
}

// array field — immediate onChange; each item is a collapsible card
export function ArrayField({ field, value = [], onChange, readOnly, label, renderItem }: ArrayFieldProps) {
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  const defaultItem = () => {
    if (!field.defaultItemProps) return {};
    return typeof field.defaultItemProps === "function"
      ? field.defaultItemProps(value.length)
      : field.defaultItemProps;
  };

  const addItem = () => {
    if (field.max !== undefined && value.length >= field.max) return;
    onChange([...value, defaultItem()]);
  };

  const removeItem = (i: number) => {
    if (field.min !== undefined && value.length <= field.min) return;
    const next = [...value];
    next.splice(i, 1);
    onChange(next);
  };

  const atMax = field.max !== undefined && value.length >= field.max;
  const atMin = field.min !== undefined && value.length <= field.min;

  return (
    <FieldLabel label={label ?? ""} readOnly={readOnly} el="div">
      <div className="flex flex-col gap-2">
        {value.map((item, i) => {
          const summary = field.getItemSummary
            ? field.getItemSummary(item, i)
            : `Item ${i + 1}`;
          const open = !!expanded[i];
          return (
            <Card key={i} className="overflow-hidden">
              <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggle(i)}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  <span className="truncate">{summary}</span>
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                    aria-label="Remove item"
                    disabled={atMin}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              {open && (
                <CardContent className="pt-0 pb-3 px-3 border-t">
                  {renderItem ? renderItem(item, i) : null}
                </CardContent>
              )}
            </Card>
          );
        })}
        {!readOnly && (
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="w-full gap-1.5"
            disabled={atMax}
          >
            <Plus className="h-3.5 w-3.5" />
            Add item
          </Button>
        )}
      </div>
    </FieldLabel>
  );
}
