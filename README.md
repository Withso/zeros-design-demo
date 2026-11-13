# Orbit: a Zeros Design demo

This repository is a Design folder for learning what the Zeros Design tab does today. It uses Orbit, a small design system made up for the demo, to show components and their options, variants, instances, slot components, states, every Style panel section, where each value comes from, style sources, the authoring checks, and the problems found while building it.

Frames are plain HTML and CSS files. When you edit in the Design tab, Zeros saves the change straight into those files and commits nothing, so Changes shows exactly what each edit wrote.

## Open the demo

1. In a Zeros checkout on a Mac, run `pnpm install --frozen-lockfile`, then `pnpm electron:local`. This opens Zeros Local: the real desktop app in a device-local organization, with no sign-in. The demo was built against the branch `droid/research-design-tab-prs` ([PR #1076](https://github.com/Withso/zeros/pull/1076)).
2. Choose Open project (or Open folder…, ⇧⌘O) and pick this folder. Zeros adds it as a project and opens a new workspace for it.
3. Open the Design tab. Start on page 1, Start here. The notes beside every frame say what it shows, what to try and what an edit writes.

That workspace is a separate worktree of this repository on a new branch, in `~/zeros-local-<identity>/workspaces/`. Your edits are saved there, so the committed demo in this folder stays as it is. Discard a file in Changes to put it back.

[docs/guide.md](docs/guide.md) has the whole tour as text, including every frame's steps.

## Selecting layers

A click on a frame selects the frame, not what is under the pointer. To reach a layer:

- Double-click to go one level deeper under the pointer.
- ⌘-click to select the deepest layer under the pointer. An instance is selected whole: double-click it to select one of its parts.
- With a layer selected, a click elsewhere selects the layer at the same depth there.
- Escape or Shift-Enter selects the parent, and Enter selects the first child.
- Layers, the drawer at the foot of the Style panel, lists the frame's layers. Click a row to select it.

Every page has this list as a note at its top left. In the steps, "select" means whichever of these reaches the layer.

## What is where

| Path | What it holds |
|---|---|
| `zeros-design-demo - Design/` | The Design folder. `meta/design.toml` registers it. `meta/canvas.json` lists the pages, frames, notes, link cards, themes and style sources. `rules.md` tells agents how to author here. |
| `zeros-design-demo - Design/tokens.css` | Orbit's tokens: colours, text styles, spacing, radius, shadow, motion and more. Light is in `:root` and Dark is under `[data-zd-theme="dark"]`. |
| `zeros-design-demo - Design/ui.css` | Orbit's classes, such as `.sheet`, `.card`, `.badge` and `.row`. Every frame links it. |
| `zeros-design-demo - Design/components/` | Slot components: card, stat, list-item, swatch and pill. |
| `zeros-design-demo - Design/options/` | Ten main components with options. Each one is a frame that `meta/canvas.json` registers by name. |
| The other folders in `zeros-design-demo - Design/` | One folder per page. Each `.html` file in it is a frame. |
| `styles/` | Style sources outside the Design folder: plain CSS, Sass, Tailwind, a build command, legacy CSS, and a Tailwind setup with a `.dark` class. |
| `docs/guide.md` | The tour as text. |
| `tools/` | Checks you can run from a terminal: lint, screenshots, and the audits the app does not show. |

## The pages

| Page | What it covers |
|---|---|
| 1. Start here | Moving around, selecting, previewing Dark, and where each kind of edit is saved. |
| 2. Tokens & themes | Colour tokens in Light and Dark, text styles and the other scales. Picking and detaching tokens. |
| 3. Component options | Ten components that use every option kind: text, choice, boolean, number, colour and easing. Also derived values, units, loops, conditions, nested components and variants. |
| 4. Slot components | Components filled with attributes and children, and how they differ from components with options. |
| 5. Instances | Every Button combination, variants with overrides, badge classes next to Badge instances, and a settings screen built from instances. |
| 6. States | Live states and the State picker, drawn states, content states, and one frame per state. |
| 7. Style panel | One frame per section: Position, Layout, Appearance, Fill, Typography, Stroke, Shadow and Blur, Transform, Transition and Motion, More styles and Export. |
| 8. Values & origins | Where each value comes from, what the field marks mean, Styled by, Changed here and Tidy. |
| 9. Style sources | Plain CSS, Sass, Tailwind, a build command, source status and per-frame source lists. |
| 10. Lint showcase | Each authoring check, triggered on purpose, with the message Validate reports. |
| 11. Known issues | Problems found while building the demo, with a frame for each one the canvas can show. |

## Where edits are saved

| You change | Zeros writes |
|---|---|
| A field in the Style panel | The layer's own declaration, usually its `style` attribute, in the frame's `.html` file. A new declaration is added at the end as `property:value;`, and an existing one has only its value replaced. Classes, other rules and tokens are never rewritten. |
| An option on a main component (page 3) | `default=` on that option's line in the component's file, or the line of the variant shown. |
| An option on an instance | One attribute on the instance's tag. A value equal to the one it inherits removes the attribute. |
| A variable in the theme editor | `tokens.css`: `:root` for Light, `[data-zd-theme="dark"]` for Dark. |
| A frame's size, place or title; notes, sections and link cards | `meta/canvas.json`. |
| Export PNG | A picture file only. It is not a source edit. |

Every layer in the demo's frames already has a `data-oid`, except in page 10's Duplicate layer ids. Where a frame has layers without one, the first edit to any layer in it writes an id onto each of them, so that first diff is longer than the change (issue 12).

## Checks

Zeros checks a frame's source each time it changes. The canvas shows only errors, as a red line at the top of the Style panel. Warnings never block a save, and the app has no list of them (issue 9). The agent's Validate step reports each warning with its file, line and fix: ask the agent in Design to validate the folder, or run the tools below.

While it draws a frame, Zeros also computes three audits: text contrast, content that overflows its box, and spacing off the 4px scale. Nothing shows them (issue 6). `tools/audit.sh` runs the same rules from a terminal.

### Run the checks from a terminal

You need Bun, Node 22 and a Zeros checkout with its dependencies installed. The tools load the Design engine from that checkout, so the results are that checkout's results.

```sh
ZEROS_REPO=/path/to/Zeros tools/audit.sh           # every frame
ZEROS_REPO=/path/to/Zeros tools/audit.sh issues/   # frames whose path matches a regex
```

It prints the lint findings, then the audits for each frame in Light and Dark, and writes these files to `tools/out/`, which Git ignores:

- `lint.json`: every finding, the instances Zeros found in each frame with the options they set, and any frame that could not be composed.
- `styles.json`: the style source report that the theme editor shows.
- `audit.json` and `shots/`: the audit results, and one PNG per frame and theme at the frame's size.

The audits copy `auditWarnings` from the Zeros file `packages/protocol/src/design-runtime.ts`. If that function changes, `tools/shoot.mjs` needs the same change. If Chromium is missing, run `pnpm exec playwright install chromium` in the Zeros checkout.

With the demo as committed, lint reports 32 warnings, all on purpose (pages 10 and 11), and no errors. The audits report 3 warnings in Light and 11 in Dark, and all of them are false alarms. The 12 contrast warnings are oklch() colours read as rgb() (issue 4), on page 9's Tailwind frame and page 11's Check issues frame; measured properly, those texts have between 6.75:1 and 16.28:1. The 2 overflow warnings are one label cut off on purpose with an ellipsis (issue 5), once in each theme.

## Known issues

These are Zeros problems found while building the demo. Page 11 lists them all, with a frame for each of issues 1 to 10 that the canvas can show; issues 11 to 15 show on other pages. Paths are in the Zeros repository.

| # | Problem | Where to see it | Where it starts |
|---|---|---|---|
| 1 | A template hole in a class attribute, such as `badge--{{ tone }}`, gives false unknown-class warnings. | Page 11, Template issues: three warnings from Validate. | `apps/desktop/src/engine/design/document.ts`, unknown-class |
| 2 | An instance inside a `<template data-zd-if>` or `data-zd-for` wrapper is never expanded, and nothing warns. | Page 11, Template issues: the wrapped card shows as bare text. | `apps/desktop/src/engine/design/components.ts`, `elements()` |
| 3 | unknown-token reads the raw file, so a sentence that names a token warns. | Page 11, Check issues: `--gap-xl`. | `apps/desktop/src/engine/design/document.ts`, unknown-token |
| 4 | The contrast audit reads oklch() colours as rgb(). | Page 11, Check issues (1.04:1), and page 9's Tailwind frame, with `tools/audit.sh`. | `packages/protocol/src/design-runtime.ts`, `parsedColor` |
| 5 | The overflow audit counts text cut off on purpose with `text-overflow: ellipsis`. | Page 11, Check issues, with `tools/audit.sh`. | `packages/protocol/src/design-runtime.ts`, `auditWarnings` |
| 6 | Audit results are never shown: no panel lists them, and Validate and the agent's lint leave them out. | Only `tools/audit.sh` shows them. | `apps/desktop/src/engine/design/verification-service.ts` and `code-tools.ts` |
| 7 | A theme mapped to a `.dark` class also rewrites Tailwind's `dark:` class names, so `dark:` utilities never apply. | Page 11, Tailwind with a .dark class, previewed in Dark. | `apps/desktop/src/engine/design/style-sources.ts`, `importPlainDesignPiece` |
| 8 | The Style panel's red line shows the first error anywhere in the folder, not only in the selected frame. | The page 11 overview note says how to cause one. | `apps/desktop/src/renderer/features/design-workspace/design-inspector.tsx` |
| 9 | The app has no list of warnings, and the code that would group them is unused. | Only Validate reports warnings. | `apps/desktop/src/renderer/features/design-workspace/design-lint-summary.ts` |
| 10 | A component's `<style>` is copied, unscoped, into every frame that places the component. | Page 11, Component CSS. | `apps/desktop/src/engine/design/components.ts`, component styles |
| 11 | Slot components are not instances, and a component with options placed inside a slot component's children has no Options. | Page 4: the cards, and the Button and avatars inside them. | `apps/desktop/src/engine/design/components.ts`, `recordInstance` (top level only) |
| 12 | The first edit to a layer also writes a `data-oid` onto every layer in its frame that has none, though `rules.md` calls data-oid optional. That diff is then many lines longer than the edit. | Page 10, Duplicate layer ids, the one frame left without ids: one Style edit changes 18 more lines. | `packages/design-web/src/adapter.ts`, `designWebTransactionAdapter.apply` |
| 13 | The first edit to any frame also adds each `components/` file that `meta/canvas.json` does not list to its `foundation.components`. | Nowhere by default: the demo lists its five components. Empty that list, edit any layer, and Changes shows `meta/canvas.json`. | `apps/desktop/src/engine/design/document-transactions.ts`, `readDesignWebDocumentStateUnlocked` |
| 14 | Reset or Clear on a layer's last inline declaration leaves an empty `style=""`. | Page 5, Badge classes and instances, step 2. | `packages/design-web/src/css.ts`, `mutateInlineStyles` |
| 15 | Layers does not list a slot component's children, though the canvas selects them and the Style panel edits them. The card's own markup has no `data-oid`, and the tree skips an element without one together with everything inside it. | Page 4, Card slots, step 2. | `packages/protocol/src/design-runtime.ts`, `treeNode` |
