"use client";

import React from "react";
import { FieldProps, NumberField } from "@measured/puck";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

/**
 * NumberInput — renders Puck's `number` field type using a Shadcn Input with
 * increment / decrement stepper buttons.
 */
export function NumberInput({
  value,
  onChange,
  field,
  readOnly,
}: FieldProps<NumberField>) {
  const numVal = (value as number) ?? 0;
  const step = field.step ?? 1;
  const min = field.min ?? -Infinity;
  const max = field.max ?? Infinity;

  function clamp(v: number) {
    return Math.min(max, Math.max(min, v));
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onChange(clamp(numVal - step))}
        disabled={readOnly || numVal <= min}
        aria-label="Decrease"
        type="button"
      >
        <Minus className="h-3 w-3" />
      </Button>

      <Input
        type="number"
        value={numVal}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        min={field.min}
        max={field.max}
        step={step}
        readOnly={readOnly}
        disabled={readOnly}
        className="h-8 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onChange(clamp(numVal + step))}
        disabled={readOnly || numVal >= max}
        aria-label="Increase"
        type="button"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
