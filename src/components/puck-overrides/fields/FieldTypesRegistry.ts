/**
 * FieldTypesRegistry
 *
 * Maps every built-in Puck field type to a Shadcn UI-based React component.
 * Pass this object to the `overrides.fieldTypes` prop of the `<Puck>` component
 * to globally replace the default field renderers.
 *
 * Usage:
 * ```tsx
 * import { fieldTypesRegistry } from "@/components/puck-overrides/fields/FieldTypesRegistry";
 *
 * <Puck overrides={{ fieldTypes: fieldTypesRegistry }} ... />
 * ```
 */

import React from "react";
import type { Overrides, FieldProps } from "@measured/puck";
import { TextInput } from "./types/TextInput";
import { TextareaInput } from "./types/TextareaInput";
import { NumberInput } from "./types/NumberInput";
import { SelectInput } from "./types/SelectInput";
import { RadioInput } from "./types/RadioInput";

// Puck's generic fieldTypes signature requires components that accept the
// union of all field shapes.  We cast each specialised renderer to satisfy
// the wider type without losing their individual prop contracts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PuckFieldComponent = React.FunctionComponent<FieldProps<any, any> & { children?: React.ReactNode; name: string }>;

export const fieldTypesRegistry: Overrides["fieldTypes"] = {
  text: TextInput as PuckFieldComponent,
  textarea: TextareaInput as PuckFieldComponent,
  number: NumberInput as PuckFieldComponent,
  select: SelectInput as PuckFieldComponent,
  radio: RadioInput as PuckFieldComponent,
};

