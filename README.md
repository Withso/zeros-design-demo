# Orbit: a Zeros Design demo

This repository is a Design folder for learning what the Zeros Design tab does today. It uses Orbit, a small design system made up for the demo, to show components and their options, variants, instances, slot components, states, every Style panel section, where each value comes from, style sources, the authoring checks, and checks for the Zeros problems found while building it, now fixed.

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
| `tools/` | Checks you can run from a terminal: lint, screenshots and the canvas audits. |

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
| 11. Fixed issues | Problems found while building the demo, now fixed, with a frame to check each one the canvas can show. |

## Where edits are saved

| You change | Zeros writes |
|---|---|
| A field in the Style panel | The layer's own declaration, usually its `style` attribute, in the frame's `.html` file. A new declaration is added at the end as `property:value;`, and an existing one has only its value replaced. Classes, other rules and tokens are never rewritten. |
| An option on a main component (page 3) | `default=` on that option's line in the component's file, or the line of the variant shown. |
| An option on an instance | One attribute on the instance's tag. A value equal to the one it inherits removes the attribute. |
| A variable in the theme editor | `tokens.css`: `:root` for Light, `[data-zd-theme="dark"]` for Dark. |
| A frame's size, place or title; notes, sections and link cards | `meta/canvas.json`. |
| Export PNG | A picture file only. It is not a source edit. |

Every layer in the demo's frames already has a `data-oid`, except in page 10's Duplicate layer ids. Where a layer has none, a style, text or attribute edit writes one on that layer only (issue 12). An edit that moves, adds or deletes layers still writes an id on every layer that has none.

## Checks

Zeros checks a frame's source each time it changes. Each frame's title on the canvas shows a badge that counts its findings: yellow for warnings, red if any is an error. Click it for the list, grouped by rule (issue 9). An error also shows as a red line at the top of the Style panel while its frame is selected (issue 8). Warnings never block a save. The agent's Validate step reports each finding with its file, line and fix: ask the agent in Design to validate the folder, or run the tools below.

While it draws a frame, Zeros also computes three audits: text contrast, content that overflows its box, and spacing off the 4px scale. Validate and the agent's lint report them as warnings for each frame the open canvas has drawn from its current source (issue 6). `tools/audit.sh` runs the same rules from a terminal, on every frame and theme.

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

The audits copy `auditWarnings`, with its colour parsing `colorFromCss`, from the Zeros file `packages/protocol/src/design-runtime.ts`. If those functions change, `tools/shoot.mjs` needs the same change. If Chromium is missing, run `pnpm exec playwright install chromium` in the Zeros checkout.

With the demo as committed and the Zeros fixes in PR #1076, lint reports 28 warnings, all on purpose and all on page 10, and no errors. Page 11 reports none. The audits report no warnings in Light or Dark. Before the fixes, lint reported 32 warnings, 4 of them false ones on page 11 (issues 1 and 3), and the audits reported 3 warnings in Light and 11 in Dark, all false alarms from issues 4 and 5.

## Fixed issues

These are Zeros problems found while building the demo. [PR #1076](https://github.com/Withso/zeros/pull/1076) fixes all of them. Page 11 keeps a frame for each of issues 1 to 10 that the canvas can show, now as a check that the fix holds, and one Instances frame for issues 16 to 18; issues 11 to 15 show on other pages. The numbers stay as they were, so the guide's references still work. Paths are in the Zeros repository.

| # | Problem | What happens now | How to check | Where it started |
|---|---|---|---|---|
| 1 | A template hole in a class attribute, such as `badge--{{ tone }}`, gave false unknown-class warnings. | unknown-class skips a class name that holds a template hole. | Page 11, Template issues: Validate reports nothing for the frame. | `apps/desktop/src/engine/design/document.ts`, unknown-class |
| 2 | An instance inside a `<template data-zd-if>` or `data-zd-for` wrapper was never expanded, and nothing warned. | It is expanded like any other instance. | Page 11, Template issues: the wrapped card draws as a card, and Show the wrapped card adds and removes it. | `apps/desktop/src/engine/design/components.ts`, `elements()` |
| 3 | unknown-token read the raw file, so a sentence that names a token warned. | Text and comments outside `<style>` are not read as CSS. | Page 11, Check issues: no warning for `--gap-xl`. | `apps/desktop/src/engine/design/document.ts`, unknown-token |
| 4 | The contrast audit read oklch() colours as rgb(). | It reads oklch(), oklab(), lab(), lch() and color() correctly (`colorFromCss`). | Page 11, Check issues, and page 9's Tailwind frame: `tools/audit.sh` reports no contrast warnings in either theme. | `packages/protocol/src/design-runtime.ts`, `parsedColor` |
| 5 | The overflow audit counted text cut off on purpose with `text-overflow: ellipsis`. | It skips text cut off with an ellipsis or `-webkit-line-clamp`. | Page 11, Check issues: `tools/audit.sh` reports no overflow. | `packages/protocol/src/design-runtime.ts`, `auditWarnings` |
| 6 | Audit results were never shown: Validate and the agent's lint left them out. | Validate and the agent's lint include the contrast, overflow and spacing audits as warnings, for a frame the open canvas has drawn from its current source. | Page 11, Check issues, step 2: give the oklch chip a light text colour and Validate reports a contrast warning. | `apps/desktop/src/engine/design/verification-service.ts` and `code-tools.ts` |
| 7 | A theme mapped to a `.dark` class also rewrote Tailwind's escaped `dark:` class names, so `dark:` utilities never applied. | The mapping leaves `.dark\:` class names as they are. | Page 11, Tailwind with a .dark class, previewed in Dark: the card turns zinc-900 with white text. | `apps/desktop/src/engine/design/style-sources.ts`, `importPlainDesignPiece` |
| 8 | The Style panel's red line showed the first error anywhere in the folder, not only in the selected frame. | It shows only the selected frame's own errors. | The page 11 overview note, step 3. | `apps/desktop/src/renderer/features/design-workspace/design-inspector.tsx` |
| 9 | The app had no list of warnings, and the code that would group them was unused. | Each frame's title shows a badge that counts its findings, yellow for warnings and red if any is an error. Click it for a list grouped by rule, in line order; click a finding on a layer to select that layer. | Page 10: each frame except What Zeros checks has a badge. Frames on pages 1 to 9 and 11 have none. | `apps/desktop/src/renderer/features/design-workspace/design-lint-summary.ts` |
| 10 | A component's `<style>` was copied, unscoped, into every frame that placed the component. | Each selector in it is limited to the component's own instances. | Page 11, Component CSS: the plain badges stay green, amber and red next to the Pill. | `apps/desktop/src/engine/design/components.ts`, component styles |
| 11 | Slot components were not instances, and a component with options placed inside a slot component's children had no Options. | Slot components are instances. Layers names them with the component mark, their `data-zid` elements are parts, and each attribute slot is a text option whose default is the slot's fallback. A card whose body is only text also has a Text row. A reserved attribute such as `title` is not offered. A Button or Avatar with its own `data-oid` inside a slot component has Options. | Page 4, Card slots, steps 1, 3 and 4, and Stats and lists, step 3. | `apps/desktop/src/engine/design/components.ts`, `recordInstance` (top level only) |
| 12 | The first edit to a layer also wrote a `data-oid` onto every layer in its frame that had none, though `rules.md` calls data-oid optional. | A style, text or attribute edit writes an id only on the layer it changes. An edit that moves, adds or deletes layers also writes ids only on the layers whose place it shifts, so each keeps its own id. | Page 10, Duplicate layer ids, the one frame left without ids: one Style edit adds one `data-oid` and the declaration. | `packages/design-web/src/adapter.ts`, `designWebTransactionAdapter.apply` |
| 13 | The first edit to any frame also added each `components/` file that `meta/canvas.json` did not list to its `foundation.components`. | An edit never changes that list. | Nowhere by default: the demo lists its five components. Empty that list, edit any layer, and Changes shows only your own change to `meta/canvas.json` and the frame. Discard both afterwards. | `apps/desktop/src/engine/design/document-transactions.ts`, `readDesignWebDocumentStateUnlocked` |
| 14 | Reset or Clear on a layer's last inline declaration left an empty `style=""`. | The `style` attribute is removed with it. | Page 5, Badge classes and instances, step 2: after Clear, the tag is as it was. | `packages/design-web/src/css.ts`, `mutateInlineStyles` |
| 15 | Layers did not list a slot component's children, though the canvas selected them and the Style panel edited them. | Layers lists them under the instance, with its parts (see 11). | Page 4, Card slots, step 2. | `packages/protocol/src/design-runtime.ts`, `treeNode` |
| 16 | An instance's parts could be selected but not edited: the Style panel was read only. | A part's style edits are overrides written on the instance as `zd-style-<part>`, and win over the main and its options. Text still changes only through options. Reset removes an override. | Page 11, Instances, steps 1 and 2. | `packages/design-web/src/component-overrides.ts` |
| 17 | A main component had no way to take an instance's own layers in a chosen place. | A frame the main marks `data-zd-slot="<name>"` is a slot. Layers dropped or drawn into it on an instance are that instance's own; Layers shows a slot row and Options shows the slot with Reset to default. | Page 11, Instances, step 3, with the Panel main beside it. | `packages/design-web/src/component-slots.ts` |
| 18 | An instance of a `components/` file showed Open in Files, not Edit main, because the file is not on the canvas. | It shows Move main to canvas, which makes the file a main frame on the page in one undo step, then opens it. | Page 11, Instances, step 4. | `apps/desktop/src/engine/design/component-move.ts` |
| 19 | `rules.md` told agents to make repeats `components/` files, with a `title=` example that no option can take. | The rules and the agent skill make repeats main frames with options and slots, and never add `components/` files. An unedited `rules.md` upgrades and keeps text added below it. | This folder's `rules.md`, rule 8. | `apps/desktop/src/engine/design/design-rules.ts` |
| 20 | A component's `@scope` rules were copied unscoped, so their root matched anywhere in the frame. | An `@scope` root is limited to the component's instances, like its other selectors. | Nowhere on the canvas: the demo's components use no `@scope`. | `apps/desktop/src/engine/design/components.ts`, `scopeDesignComponentStyle` |

The same PR also changes Position in the Style panel. A layer whose parent has auto layout gets an Absolute position checkbox, in place of the old Place freely button. Unticked, auto layout places the layer and X and Y are locked. Ticked, it is placed freely, X and Y can be edited, and the pins show. Unticking hands it back to auto layout, which places it where it puts it now; its old X and Y are not kept, its size is. Layers shows a four-corner absolute icon on its row while it is ticked. Page 7's Position frame, step 3, tries it.
