"use client";

import React from "react";
import { FieldProps, SelectField } from "@measured/puck";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * SelectInput — renders Puck's `select` field type using a Shadcn Select.
 */
export function SelectInput({
  value,
  onChange,
  field,
  readOnly,
}: FieldProps<SelectField>) {
  return (
    <Select
      value={(value as string) ?? ""}
      onValueChange={(v) => onChange(v)}
      disabled={readOnly}
    >
      <SelectTrigger className="h-8 text-sm">
        <SelectValue placeholder="Select an option…" />
      </SelectTrigger>
      <SelectContent>
        {field.options.map((opt) => (
          <SelectItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
