# CLAUDE.md — @anvilkit/puck-overrides

AI-assisted development guide for this codebase.

---

## Project Overview

`@anvilkit/puck-overrides` is a published npm package that provides drop-in Shadcn UI overrides for all 15 Puck Editor surfaces. It is TypeScript-first, ships ESM + CJS + `.d.ts`, and has zero Next.js at runtime (`next` is a devDependency for the local demo app only).

**Hard constraint:** Nothing in `src/` may import from `next`. The demo lives in `app/` only.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          <Studio />                                  │
│  props: config, data, onPublish, images?, copywritings?, aiHost?    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <Puck overrides={mergedOverrides} plugins={[aiPlugin]}>     │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │                   <EditorLayout />                     │  │   │
│  │  │                                                        │  │   │
│  │  │  ┌──────────────────────────────────────────────────┐  │  │   │
│  │  │  │                   <Header />                     │  │  │   │
│  │  │  │    back · title · undo/redo · collab · publish   │  │  │   │
│  │  │  └──────────────────────────────────────────────────┘  │  │   │
│  │  │                                                        │  │   │
│  │  │  ┌──────┐  ┌────────────────┐  ┌────────┐  ┌───────┐  │  │   │
│  │  │  │Aside │  │ Dynamic Panel  │  │ Canvas │  │Fields │  │  │   │
│  │  │  │      │  │                │  │        │  │       │  │  │   │
│  │  │  │insert│  │ insert →       │  │ Puck.  │  │ Puck. │  │  │   │
│  │  │  │layer │  │  Puck.Comps    │  │Preview │  │Fields │  │  │   │
│  │  │  │image │  │ layer  →       │  │        │  │       │  │  │   │
│  │  │  │text  │  │  Puck.Outline  │  │        │  │       │  │  │   │
│  │  │  │copil.│  │ image  →       │  │        │  │       │  │  │   │
│  │  │  │      │  │  ImageLibrary  │  │        │  │       │  │  │   │
│  │  │  │      │  │ text   →       │  │        │  │       │  │  │   │
│  │  │  │      │  │  CopyLibrary   │  │        │  │       │  │  │   │
│  │  │  │      │  │ copilot→       │  │        │  │       │  │  │   │
│  │  │  │      │  │  aiPanel       │  │        │  │       │  │  │   │
│  │  │  └──────┘  └────────────────┘  └────────┘  └───────┘  │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Files

| File | Role |
|---|---|
| `src/index.ts` | Barrel export — public API |
| `src/components/editor/Studio.tsx` | Main convenience wrapper |
| `src/components/layout/Layout.tsx` | `EditorLayout` — 3-panel shell |
| `src/components/layout/header/Header.tsx` | Header with undo/redo/export/publish |
| `src/components/layout/sidebar/Aside.tsx` | Vertical tab switcher |
| `src/components/layout/sidebar/library/ImageLibrary.tsx` | Drag-drop image panel |
| `src/components/layout/sidebar/library/CopyLibrary.tsx` | Drag-drop text snippets panel |
| `src/components/overrides/index.tsx` | Assembles `puckOverrides` object |
| `src/store/index.ts` | Zustand v5 `uiStore` |
| `tsup.config.ts` | Build config |

---

## Public API (`src/index.ts`)

```ts
export { puckOverrides }           // Puck overrides object
export { Studio }                  // Convenience wrapper component
export type { StudioProps }        // Studio prop types
export type { ImagesProps }        // Image library config
export type { CopywritingProps }   // Copy library config
export type { ImageItem }          // { id, src, alt }
export type { CopywritingItem }    // { label, text, category }
export { uiStore }                 // Zustand store instance
export type { UIStore }            // Store type
```

---

## Zustand Store (`src/store/index.ts`)

Three slices in one store, created with `subscribeWithSelector`:

| Slice | State | Actions |
|---|---|---|
| `DrawerSlice` | `drawerSearch`, `drawerCollapsed` | `setDrawerSearch`, `toggleDrawerGroup` |
| `AsideSlice` | `activeTab` (`"insert"│"layer"│"image"│"text"│"copilot"`) | `setActiveTab` |
| `OutlineSlice` | `outlineExpanded` | `toggleOutlineItem` |

---

## Library Drag-Drop Events

Both libraries communicate with the canvas via custom window events:

| Event | Fired when | Detail |
|---|---|---|
| `anvilkit:librarydragstart` | pointer-down on any library item | `{ type: "image" \| "text" }` |
| `anvilkit:imagedrop` | pointer-up after image drag | `{ src, clientX, clientY }` |
| `anvilkit:textdrop` | pointer-up after text drag | `{ text, clientX, clientY }` |

`pendingImageSrc` is a module-level variable in `ImageLibrary.tsx` shared with `CanvasIframe.tsx` (same bundle, same origin).

---

## Puck 0.21.1 API Facts

- `usePuck()` takes **no selector** — returns the full `AppStore` directly
- `history.hasPast` and `history.hasFuture` are **booleans** — do NOT call them as functions
- Action types are lowercase strings: `"remove"`, `"duplicate"`, `"move"`
- `RemoveAction`: `{ type: "remove", index: number, zone: string }`
- `DuplicateAction`: `{ type: "duplicate", sourceIndex: number, sourceZone: string }`
- `ItemSelector` is NOT exported from `@puckeditor/core` — use `unknown`
- `RenderFunc` returns `ReactElement` (not `ReactNode`) — all override components must return `ReactElement`

### Override Type Signatures

| Surface | Props |
|---|---|
| `header` | `{ actions: ReactNode, children: ReactNode }` |
| `headerActions` | `{ children: ReactNode }` |
| `drawer/components/outline/preview/puck` | `{ children: ReactNode }` |
| `drawerItem/componentItem` | `{ children: ReactNode, name: string }` |
| `iframe` | `{ children: ReactNode, document?: Document }` |
| `componentOverlay` | `{ children, hover: boolean, isSelected: boolean, componentId: string, componentType: string }` |
| `actionBar` | `{ children, label?: string, parentAction: ReactNode }` |
| `fields` | `{ children, isLoading: boolean, itemSelector?: unknown }` |
| `fieldLabel` | `{ children?, icon?, label: string, el?: "label"│"div", readOnly?, className? }` |
| `fieldTypes` | `Partial<FieldRenderFunctions>` — components receive `FieldProps & { children, name }` |

---

## @base-ui/react vs Radix UI

All `src/components/ui/` components use `@base-ui/react` primitives — **not Radix UI**.

Key differences:
- **No `asChild` prop** — use `render` prop instead: `<TooltipTrigger render={<Button />} />`
- `Select.onValueChange` receives `string | null` — guard with `if (v !== null)`
- `CommandInput` uses `onValueChange` (string), not `onChange` (event)
- `CommandItem` uses `onSelect`, not `onClick`; use `data-checked` not `selected`

---

## Import Path Rules

Relative imports from UI components must follow these rules:

| From | Import `../../ui/` as |
|---|---|
| `src/components/overrides/fields/` | `../../ui/` |
| `src/components/overrides/fields/types/` | `../../../ui/` |
| `src/components/overrides/canvas/` | `../../ui/` |
| `src/components/overrides/layout/` | `../../ui/` |

Alias `@/` resolves to `src/` (configured in `tsconfig.json` and `next.config.mjs`).

---

## Build Notes

```bash
pnpm build   # runs tsup → dist/index.js, dist/index.mjs, dist/index.d.ts
```

- **External** (peer deps, not bundled): `react`, `react-dom`, `@puckeditor/core`, `@base-ui/react`
- **Bundled**: `zustand`, `@dnd-kit/*`, `motion`, `lucide-react`, `@floating-ui/react`, `cmdk`
- No `.tsx` extensions in import paths — tsup does not support `allowImportingTsExtensions`
- `src/components/overrides/index.tsx` must stay `.tsx` (contains JSX)
- `tsconfig.json` must **NOT** have `"incremental": true` — tsup DTS build fails with it
