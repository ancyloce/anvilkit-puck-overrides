# @anvilkit/puck-overrides

[![npm](https://img.shields.io/npm/v/@anvilkit/puck-overrides)](https://www.npmjs.com/package/@anvilkit/puck-overrides)
[![license](https://img.shields.io/npm/l/@anvilkit/puck-overrides)](./LICENSE)
[![react](https://img.shields.io/badge/react-19-blue)](https://react.dev)
[![puck](https://img.shields.io/badge/puck-%5E0.21.1-purple)](https://puckeditor.com)

Drop-in Shadcn UI overrides for all 15 Puck Editor surfaces — enterprise-ready, TypeScript-first.

> 中文文档请见 [docs/README.zh.md](./docs/README.zh.md)

---

## Introduction

Puck Editor ships with a minimal default UI that works for prototypes but falls short in enterprise products — no design system consistency, no accessible components, no Tailwind integration.

`@anvilkit/puck-overrides` solves this with a single drop-in `overrides` object built on Shadcn UI, Radix UI primitives, and Tailwind v4. All 15 override surfaces are covered. Components are **bundled** into the package — you do not run a Shadcn CLI to copy them.

**Key value props:**

- All 15 Puck override surfaces implemented
- TypeScript-first with full type inference
- Ships ESM + CJS + `.d.ts`
- No Next.js at runtime — `next` is demo-only
- Radix UI and lucide-react are bundled, not peer deps

---

## Installation

```bash
pnpm add @anvilkit/puck-overrides
```

> `next` is a devDependency used only for the local demo app. It is not included in the published bundle.

The package ships both ESM and CJS builds. No additional bundler configuration is required.

---

## Peer Dependencies

| Package | Version |
|---|---|
| `react` | `>=19` |
| `react-dom` | `>=19` |
| `@puckeditor/core` | `^0.21.1` |
| `tailwindcss` | `^4` |

> Radix UI primitives and `lucide-react` are **bundled** — do not install them separately.

---

## Quick Start

### Import the CSS

```ts
import "@anvilkit/puck-overrides/styles.css";
```

### Pattern 1 — Raw overrides object

```tsx
import { puckOverrides } from "@anvilkit/puck-overrides";
import { Puck } from "@puckeditor/core";

export default function Editor({ config, data, onPublish }) {
  return (
    <Puck
      config={config}
      data={data}
      onPublish={onPublish}
      overrides={puckOverrides}
    />
  );
}
```

### Pattern 2 — Studio convenience wrapper

```tsx
import { Studio } from "@anvilkit/puck-overrides";

export default function Editor({ config, data, onPublish }) {
  return (
    <Studio
      config={config}
      data={data}
      onPublish={onPublish}
    />
  );
}
```

`Studio` is a thin wrapper that renders `<Puck overrides={puckOverrides} />` with the correct CSS already applied.

---

## Override Surfaces

### Layout

| Key | Component | Description |
|---|---|---|
| `header` | `EditorHeader` | Top toolbar shell |
| `headerActions` | `EditorHeader` | Action buttons injected into header; **must render `children`** |
| `drawer` | `EditorDrawer` | Left panel component list container |
| `components` | `EditorDrawer` | Component group list inside drawer |
| `outline` | `EditorOutline` | Layer tree / page outline panel |

### Canvas

| Key | Component | Description |
|---|---|---|
| `iframe` | `CanvasIframe` | Canvas iframe wrapper; injects Tailwind + Shadcn CSS vars |
| `preview` | `CanvasPreview` | Drag preview ghost |
| `componentOverlay` | `ComponentOverlay` | Selection/hover highlight overlay; must be `pointer-events-none` |
| `actionBar` | `ActionBar` | Per-component floating action bar (remove, duplicate, move) |
| `drawerItem` | `DrawerItem` | Draggable component chip in drawer; **must forward all drag refs and event props to outermost DOM element** |
| `componentItem` | `DrawerItem` | Alias surface for component items |

### Inspector

| Key | Component | Description |
|---|---|---|
| `fields` | `FieldWrapper` | Props panel field list wrapper |
| `fieldLabel` | `FieldWrapper` | Individual field label + tooltip |
| `fieldTypes` | `FieldTypesRegistry` | Map of all 11 field type renderers |
| `puckMenu` | `EditorHeader` | Puck logo / menu slot in header |

> **`headerActions` callout:** This surface receives Puck's built-in publish button as `children`. You must render `{children}` inside your implementation or the publish button disappears (regression introduced in Puck 0.15+).

> **`drawerItem` callout:** Puck passes drag refs and pointer event handlers as props. Wrapping the root element in an extra `<div>` silently breaks drag-and-drop. Spread all drag props directly onto the outermost DOM element.

---

## Contributing & Build

```bash
pnpm install        # install all dependencies
pnpm dev            # start Next.js demo app
pnpm build          # run tsup → dist/
```

Build output in `dist/`:

| File | Format |
|---|---|
| `index.js` | CJS |
| `index.mjs` | ESM |
| `index.d.ts` | TypeScript declarations |

`next` is a devDependency for the demo app only. It does not appear in `src/` and is not included in the bundle.

---

## License

MIT
