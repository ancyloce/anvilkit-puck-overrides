"use client";

import React from "react";
import { FieldProps, RadioField } from "@measured/puck";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/**
 * RadioInput — renders Puck's `radio` field type using a Shadcn RadioGroup.
 */
export function RadioInput({
  value,
  onChange,
  field,
  readOnly,
}: FieldProps<RadioField>) {
  return (
    <RadioGroup
      value={(value as string) ?? ""}
      onValueChange={(v) => onChange(v)}
      disabled={readOnly}
      className="gap-2"
    >
      {field.options.map((opt) => (
        <div key={String(opt.value)} className="flex items-center gap-2">
          <RadioGroupItem
            value={String(opt.value)}
            id={`radio-${String(opt.value)}`}
          />
          <Label
            htmlFor={`radio-${String(opt.value)}`}
            className="text-sm font-normal cursor-pointer"
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
