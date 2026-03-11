/**
 * puck-overrides/index.ts
 *
 * Central export that assembles the complete Puck `overrides` object from all
 * domain-specific override components (layout, canvas, fields).
 *
 * Import `puckOverrides` and spread it into the `<Puck overrides={...} />`
 * prop to apply the full Shadcn UI-based editor skin.
 *
 * @example
 * ```tsx
 * import { puckOverrides } from "@/components/puck-overrides";
 * <Puck overrides={puckOverrides} ... />
 * ```
 */

import { Overrides } from "@measured/puck";

// Layout
import { EditorHeader } from "./layout/EditorHeader";
import { EditorDrawer } from "./layout/EditorDrawer";
import { DrawerItem } from "./layout/DrawerItem";
import { EditorOutline } from "./layout/EditorOutline";

// Canvas
import { CanvasIframe } from "./canvas/CanvasIframe";
import { CanvasPreview } from "./canvas/CanvasPreview";
import { ComponentOverlay } from "./canvas/ComponentOverlay";
import { ActionBar } from "./canvas/ActionBar";

// Fields
import { FieldWrapper } from "./fields/FieldWrapper";
import { fieldTypesRegistry } from "./fields/FieldTypesRegistry";

export const puckOverrides: Partial<Overrides> = {
  // ── Layout ────────────────────────────────────────────────────────────────
  header: ({ actions, children }) =>
    EditorHeader({ actions, children }),

  drawer: ({ children }) =>
    EditorDrawer({ children }),

  drawerItem: ({ children, name }) =>
    DrawerItem({ children, name }),

  outline: () => EditorOutline(),

  // ── Canvas ────────────────────────────────────────────────────────────────
  iframe: ({ children, document: doc }) =>
    CanvasIframe({ children, document: doc }),

  preview: ({ children }) =>
    CanvasPreview({ children }),

  componentOverlay: ({ children, hover, isSelected, componentId, componentType }) =>
    ComponentOverlay({ children, hover, isSelected, componentId, componentType }),

  actionBar: ({ label, children, parentAction }) =>
    ActionBar({ label, children, parentAction }),

  // ── Fields ────────────────────────────────────────────────────────────────
  fieldLabel: ({ children, icon, label, el, readOnly, className }) =>
    FieldWrapper({ children, icon, label, el, readOnly, className }),

  fieldTypes: fieldTypesRegistry,
};

// Re-export individual override components for granular use
export { EditorHeader } from "./layout/EditorHeader";
export { EditorDrawer } from "./layout/EditorDrawer";
export { DrawerItem } from "./layout/DrawerItem";
export { EditorOutline } from "./layout/EditorOutline";
export { CanvasIframe } from "./canvas/CanvasIframe";
export { CanvasPreview } from "./canvas/CanvasPreview";
export { ComponentOverlay } from "./canvas/ComponentOverlay";
export { ActionBar } from "./canvas/ActionBar";
export { FieldWrapper } from "./fields/FieldWrapper";
export { fieldTypesRegistry } from "./fields/FieldTypesRegistry";
export { TextInput } from "./fields/types/TextInput";
export { TextareaInput } from "./fields/types/TextareaInput";
export { NumberInput } from "./fields/types/NumberInput";
export { SelectInput } from "./fields/types/SelectInput";
export { RadioInput } from "./fields/types/RadioInput";
export { ArrayInput } from "./fields/types/ArrayInput";
export { RichtextInput } from "./fields/types/RichtextInput";
