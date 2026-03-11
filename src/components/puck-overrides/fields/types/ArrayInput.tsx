"use client";

import React, { ReactNode } from "react";
import { FieldProps, ArrayField } from "@measured/puck";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";

interface ArrayInputProps extends FieldProps<ArrayField> {
  children: ReactNode;
}

/**
 * ArrayInput — renders Puck's `array` field type.
 *
 * Each array item is wrapped in a collapsible Accordion card.  An "Add item"
 * button appends a new entry with default values; a delete icon removes the
 * corresponding item.
 */
export function ArrayInput({
  value,
  onChange,
  field,
  children,
}: ArrayInputProps) {
  const items = (value as Record<string, unknown>[]) ?? [];

  function addItem() {
    const defaultItem: Record<string, unknown> = {};
    if (field.arrayFields) {
      for (const [key, fieldDef] of Object.entries(field.arrayFields)) {
        defaultItem[key] = (fieldDef as { defaultValue?: unknown }).defaultValue ?? "";
      }
    }
    onChange([...items, defaultItem]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      {items.length > 0 ? (
        <Accordion type="multiple" className="space-y-1">
          {items.map((_, index) => (
            <AccordionItem
              key={index}
              value={String(index)}
              className="rounded-md border"
            >
              <div className="flex items-center pr-2">
                <AccordionTrigger className="flex-1 px-3 py-2 text-xs hover:no-underline">
                  Item {index + 1}
                </AccordionTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(index);
                  }}
                  aria-label={`Remove item ${index + 1}`}
                  type="button"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <AccordionContent>
                <CardContent className="px-3 pb-3 pt-0">
                  {/* Puck renders the nested fields as children at the correct index */}
                  {children}
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-6 text-xs text-muted-foreground">
            No items yet
          </CardContent>
        </Card>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={addItem}
        type="button"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add item
      </Button>
    </div>
  );
}
