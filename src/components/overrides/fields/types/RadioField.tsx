"use client";
import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FieldLabel } from "../FieldWrapper";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioFieldProps {
  value: string;
  onChange: (value: string) => void;
  options?: RadioOption[];
  readOnly?: boolean;
  label?: string;
}

// radio field — immediate onChange
export function RadioField({ value, onChange, options = [], readOnly, label }: RadioFieldProps) {
  return (
    <FieldLabel label={label ?? ""} readOnly={readOnly}>
      <RadioGroup value={value} onValueChange={onChange} disabled={readOnly} className="gap-2">
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={`radio-${opt.value}`} />
            <Label htmlFor={`radio-${opt.value}`} className="text-sm font-normal cursor-pointer">
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FieldLabel>
  );
}
