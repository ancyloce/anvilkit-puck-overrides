"use client";

import React from "react";
import { FieldProps, TextareaField } from "@measured/puck";
import { Textarea } from "@/components/ui/textarea";

/**
 * TextareaInput — renders Puck's `textarea` field type using a Shadcn Textarea.
 */
export function TextareaInput({
  value,
  onChange,
  field,
  readOnly,
}: FieldProps<TextareaField>) {
  return (
    <Textarea
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder ?? ""}
      readOnly={readOnly}
      disabled={readOnly}
      className="min-h-[80px] text-sm resize-y"
    />
  );
}
