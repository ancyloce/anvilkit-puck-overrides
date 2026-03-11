"use client";

import React from "react";
import { FieldProps, TextField } from "@measured/puck";
import { Input } from "@/components/ui/input";

/**
 * TextInput — renders Puck's `text` field type using a Shadcn Input.
 */
export function TextInput({
  value,
  onChange,
  field,
  readOnly,
}: FieldProps<TextField>) {
  return (
    <Input
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder ?? ""}
      readOnly={readOnly}
      disabled={readOnly}
      className="h-8 text-sm"
    />
  );
}
