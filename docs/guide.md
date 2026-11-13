# Orbit: the tour as text

This is the Design canvas tour, written out. Each page of the canvas is a section here, and each frame has the note that sits beside it on the canvas, with the frame's own "Try this" steps filled in. [README.md](../README.md) says how to open the demo and run the checks.

On every page:

- A frame is one HTML file. The path under each frame's title is relative to the Design folder, `zeros-design-demo - Design/`.
- Edits are saved straight into the files, and nothing is committed. Changes shows what each edit wrote, and Discard puts a file back.
- To preview Dark, select a frame, press ⌥T, and pick Dark in the menu beside Search.
- Every page has the same How to select note at its top left. It is printed once, below.

## Contents

- [How to select](#how-to-select)
- [1. Start here](#1-start-here)
- [2. Tokens & themes](#2-tokens--themes)
- [3. Component options](#3-component-options)
- [4. Slot components](#4-slot-components)
- [5. Instances](#5-instances)
- [6. States](#6-states)
- [7. Style panel](#7-style-panel)
- [8. Values & origins](#8-values--origins)
- [9. Style sources](#9-style-sources)
- [10. Lint showcase](#10-lint-showcase)
- [11. Known issues](#11-known-issues)

## How to select

- Click a frame, or its title, to select the frame.
- Double-click to go one level deeper under the pointer.
- ⌘-click to select the deepest layer under the pointer. An instance is selected whole: double-click it to select one of its parts.
- With a layer selected, a click elsewhere selects the layer at the same depth there.
- Escape or Shift-Enter selects the parent; Enter selects the first child.
- Layers, at the foot of the Style panel, lists the frame's layers. Click a row to select it.

In the steps, "select" means whichever of these reaches the layer.

## 1. Start here

Folder `start/` · 1 frame

### Welcome

Section: Welcome. `start/welcome.html` · 1320 × 900 · link cards: README.md, docs/guide.md

**What it shows**

The map of this demo, built with Orbit, a small design system made up for it. Each page is a folder, and each frame on it is one HTML file. The cards are `<zd-card>` tags, placed from components/card.html (page 4).

**Try**

1. Move between pages with the Pages menu. Hold Space and drag to pan.
2. Select this frame, then a layer in it, as the How to select note on the left says. Open Layers at the foot of the Style panel to see the frame's tree.
3. Select a frame and press ⌥T, or click the palette button in the toolbar, to open the theme editor. In the menu beside Search, change Light to Dark: every frame redraws in Dark, and stays so after you close the editor.
4. ⌘-click a card. It is one layer, the `<zd-card>` tag: its insides come from the component file, so they are not layers of their own.

**What gets written**

Style panel: the layer's own declaration, usually its style attribute, in the frame's .html file. A new declaration goes at the end as property:value; and an existing one has only its value replaced.

Options: one attribute on an instance, or one default= in the component's file.

Theme editor: tokens.css.

Frame size, place and title, notes, sections and link cards: meta/canvas.json.

Every layer in this demo has a data-oid already, except on page 10's Duplicate layer ids. Where layers have none, the first edit writes one onto each of them (issue 12).

Nothing is staged or committed. Changes shows each edit as a diff, and Discard puts a file back.

## 2. Tokens & themes

Folder `tokens/` · 3 frames

### Colours

Section: Colours. `tokens/colors.html` · 1320 × 1016

**What it shows**

Every colour token in tokens.css. Each tile is a `<zd-swatch>`, an instance of components/swatch.html: a components file that declares two options, Colour and Token name. The chip paints var(--zd-color).

**Try**

1. Select a swatch. Options shows Colour as a token pill and Token name as text.
2. Open Colour. Theme lists the colour tokens by family; Custom edits a literal. Pick success: the chip turns green.
3. Preview Dark (⌥T, then Dark in the menu beside Search). Every chip follows, because tokens.css sets the same names again under [data-zd-theme="dark"].
4. With Dark shown, change --accent in the theme editor. Accent changes on every page, in Dark only.

**What gets written**

Step 2 sets color="var(--success)" on that one `<zd-swatch>`. Picking the default, accent, removes the attribute instead.

Step 4 changes --accent inside the [data-zd-theme="dark"] block of tokens.css. With Light shown, the theme editor writes :root instead.

Discard tokens.css and this file in Changes to undo both.

### Text styles

Section: Type. `tokens/type.html` · 1120 × 870

**What it shows**

The text styles. A text style is a `--text-<name>` size token plus parts beside it, such as --text-title--line-height, --text-title--letter-spacing and --text-title--font-weight. Each sample sets them inline, as Typography's Style row writes them. Geist and Geist Mono load from assets/fonts through @font-face in tokens.css.

**Try**

1. Select "Project settings". Typography's Style row shows Title.
2. Select the last line, which has no text style, and pick Heading in the Style row.
3. Select "Section eyebrow" and hover Letter spacing: the card names --text-overline--letter-spacing, where it is declared and its value.
4. On any styled line, change only the line height.

**What gets written**

Step 2 adds font-size: var(--text-heading) and one var() for each part Heading has, its line height and weight, to that line's style attribute.

Step 4 replaces the line-height declaration alone; the other parts stay as they were.

### Scales

Section: Scales. `tokens/scales.html` · 1200 × 780

**What it shows**

The other scales in tokens.css: spacing, corner radius, shadow, easing and duration, sizes, opacity and z-index. Every specimen sets its token inline with var(), so each Style field shows the token as a pill.

**Try**

1. Select a spacing bar. Width shows a --space-\* pill; hover it to see where it is declared and what it resolves to.
2. Press ⌥↓ in that field. The list offers only tokens that fit a width, grouped by role. Pick another.
3. Select a radius box and use Detach at the end of its Corner radius field.
4. Select the --shadow-md box: Shadow lists one row that reads the token.

**What gets written**

Step 2 rewrites that one declaration, for example width: var(--space-6).

Step 3 writes the value the token resolves to, in px, in place of var().

Both change the layer's style attribute only. tokens.css never changes from a Style field.

## 3. Component options

Folder `options/` · 10 frames

### Button

Section: Text, choice, boolean, number, colour and easing. `options/button.html` · 320 × 140 · registered as the component `button`, placed with `<zd-button>`

**What it shows**

The main Button component. options/button.html declares 11 options in `<template data-zd-options>`, and meta/canvas.json registers the frame as "button", so any frame can place `<zd-button>`.

Kinds: text (Label); choice (Tone has three values, so a row of buttons; Size has five, so a menu); boolean (Loading, Show icon); number with min and max, so a slider (Corner radius); colour (Accent fill); easing (Spinner motion, Press motion). group= folds rows under Loading, Icon, and Shape and motion.

**Try**

1. Click the frame title. The header reads Component, and Options lists every row.
2. Set Tone to Danger, then back to Accent.
3. Open Variant, pick Destructive and change Label.
4. Change anything, then press + beside Variant (Save current as variant…).
5. Select the Label layer: its text reads "Set by option Label".

**What gets written**

Step 2 edits default= on the tone line, so every instance that sets no tone follows, on page 5 too. Step 3 edits label= on the `<zd-variant name="destructive">` line. Step 4 appends one `<zd-variant>` line holding only the values that differ from the defaults. Which variant the frame shows is your own view, never in Git.

### Badge

Section: Text, choice, boolean, number, colour and easing. `options/badge.html` · 240 × 120 · registered as the component `badge`, placed with `<zd-badge>`

**What it shows**

Badge: Text; Look, a three-way choice; Leading dot; Count, a number with no range, so a plain number field; and two colours, Ink and Wash. The template has one span per look, each kept by data-zd-if="look == 'soft'" and so on, and shows the count only while count > 0.

**Try**

1. Select the frame and set Count to 3.
2. Open Ink: pick success under Theme, then type a hex under Custom.
3. Pick the Danger variant: Look turns Solid and Text reads Failed.

**What gets written**

Each change edits one default= (or the shown variant's line). A token is written as var(--success), a hex as typed.

How the colours reach CSS: a colour option is the custom property --zd-ink. The Badge's style maps it with :where(.stage, zd-badge) > .badge { --badge-ink: var(--zd-ink) }. The selector is narrow on purpose: Zeros copies this style element into every frame that places a Badge (issue 10, page 11).

### Avatar

Section: Text, choice, boolean, number, colour and easing. `options/avatar.html` · 220 × 160 · registered as the component `avatar`, placed with `<zd-avatar>`

**What it shows**

Avatar, with two derived values: font = round(size \* 0.38) and dot-size = max(8, round(size / 4)), both in px. Zeros works them out from Size and exposes them as var(--zd-font) and var(--zd-dot-size). Derived values have no row; they follow their options.

**Try**

1. Select the frame and drag Size from 40 to 72: the initials and the status dot grow together.
2. Set Shape to Rounded, then Square.
3. Set Status to None: data-zd-if removes the dot. Then pick Busy.
4. Turn Ring on and change Ring colour.
5. Pick the Large variant, then Default.

**What gets written**

default= on the size, shape, status, ring or ring-color line. Derived values are never written.

Number, colour, easing and numeric derived values reach CSS as --zd-\* custom properties. Text, choices and booleans reach the markup only through the template.

### Progress

Section: Derived values and units. `options/progress.html` · 440 × 280 · registered as the component `progress`, placed with `<zd-progress>`

**What it shows**

Progress, with three derived values: remaining = 100 - value; done = value >= 100; and status, a text picked by done ? 'Complete' : value == 0 ? 'Not started' : 'In progress'. Each number has a unit: Value %, Ring size px, Start angle deg, Stripe speed s. A `<template data-zd-if>` adds " · 36% left" without adding an element.

**Try**

1. Drag Value to 0, then to 100: the status line changes, and at 100 a check appears.
2. Set Shape to Ring: the bar goes and a conic-gradient ring takes its place. Change Start angle.
3. Turn Striped on, then change Stripe speed. The stripes are a CSS @keyframes animation.
4. Pick the Ring variant: Shape, Value and Label change together.

**What gets written**

default= on each option line you change. An easing is one value holding the curve and the duration, such as default="ease-in-out 400ms" on the fill-motion line. CSS reads it as var(--zd-fill-motion-easing) and var(--zd-fill-motion-duration).

### Rating

Section: Derived values and units. `options/rating.html` · 440 × 120 · registered as the component `rating`, placed with `<zd-rating>`

**What it shows**

Rating repeats one star with data-zd-for="i in range(count)". Each star works out its fill in an attribute hole: data-fill="{{ shown >= i + 1 ? 'full' : shown > i ? 'half' : 'empty' }}", with shown = min(value, count). The label is derived text: shown + ' out of ' + count. Value steps by 0.5; Star size is in rem and Gap in em.

**Try**

1. Set Stars to 10 and Value to 7.5: ten stars, the eighth half filled.
2. Set Stars back to 5, leaving Value at 7.5: the label says 5 out of 5, because min() caps it.
3. Change Star colour. Its default is the literal #f5a524, so Custom shows a hex.
4. Pick the Rose variant.

**What gets written**

default= on the count, value, size, gap or color line. A literal colour is written as typed, a token as var(--name). The file still holds one star: Zeros repeats it when it draws.

### Text field

Section: Derived values and units. `options/text-field.html` · 440 × 180 · registered as the component `text-field`, placed with `<zd-text-field>`

**What it shows**

One text field drawn in five states by a choice option, Drawn state. The derived invalid = state == 'error' chooses between the hint and the error line and fills aria-invalid. Disabled uses a second input that carries the disabled attribute, because a hole fills an attribute's value but cannot remove the attribute. Width is a number in ch.

**Try**

1. Set Drawn state to Error: red border, and the hint becomes the error.
2. Set it to Disabled.
3. Turn Required on: an asterisk follows the label.
4. Pick the Empty variant: its value is empty, so the placeholder shows.
5. Type `<b>``bold</b>` into Hint. It shows as typed, because holes are escaped.

**What gets written**

default= on the state, required, value or hint line. Text is kept as typed, with quotes and angle brackets escaped in the attribute.

### Data table

Section: Loops and conditions. `options/data-table.html` · 640 × 500 · registered as the component `data-table`, placed with `<zd-data-table>`

**What it shows**

Loops. Rows repeat with data-zd-for="r in range(rows)", and the cells in each row with c in range(columns): a loop in a loop. Each cell's text is worked out from r and c, and the caption shows the derived cells = rows \* columns. The grid's tracks come from CSS: var(--zd-first-col) in fr, then repeat(var(--zd-rest), minmax(0, 1fr)), with rest = columns - 1.

**Try**

1. Set Rows to 8 and Columns to 6: 48 cells, and the caption says so.
2. Turn Header row off, then Zebra rows on.
3. Set Density to Compact, then Spacious.
4. Drag First column width from 1fr to 3fr.
5. Pick the Summary variant: 2 rows, 3 columns, no header.

**What gets written**

default= on the rows, columns, header, zebra, density or first-col line. The file keeps one row and one cell; loops run when Zeros draws, up to 256 times each and 3 deep.

### Tabs

Section: Loops and conditions. `options/tabs.html` · 520 × 120 · registered as the component `tabs`, placed with `<zd-tabs>`

**What it shows**

Tabs loop over a derived list: tabs = settings ? ['overview', 'activity', 'members', 'settings'] : the first three. One tab is repeated with data-zd-for="t in tabs"; aria-selected="{{ t == selected }}" marks the chosen one, and a count badge shows on Activity only while count > 0.

**Try**

1. Set Selected tab to Members: the underline moves.
2. Turn Settings tab off: the last tab goes. If Settings was selected, no tab is.
3. Set Activity count to 0: the badge goes.
4. Change Underline to another colour token.

**What gets written**

default= on the selected, settings, count or underline line. Selected tab is a choice, so it offers only its four declared names; it is a menu because there are more than three.

### Alert

Section: Nested instances and motion. `options/alert.html` · 600 × 200 · registered as the component `alert`, placed with `<zd-alert>`

**What it shows**

An Alert whose template places two Buttons: `<zd-button … label="{{ primary }}">` and a second one with data-zd-if="actions == 'two'". Options reach a nested component through its attributes. The derived has-actions = actions != 'none' removes the whole row. Entrance is an easing used by a CSS @keyframes animation; Entrance delay is in ms.

**Try**

1. Set Actions to One button, then None.
2. Type a new Primary label: the nested Button follows.
3. Set Tone to Error and turn Close button off.
4. In Entrance, set Type to Spring and raise Bounce: the curve above the rows changes.
5. Try each variant: Shipped, Failed and Tip.

**What gets written**

default= on the Alert's own option lines. The nested Buttons are part of the template; to change their fixed attributes, such as size="sm", edit options/alert.html.

### Switch row

Section: Nested instances and motion. `options/switch-row.html` · 440 × 120 · registered as the component `switch-row`, placed with `<zd-switch-row>`

**What it shows**

A settings row with a switch. On fills aria-checked. Disabled fills aria-disabled, which dims the row with --opacity-disabled. The hint is kept only while len(hint) > 0. Knob motion is a spring, "spring(0.3) 320ms": Zeros turns a spring into a CSS linear() curve, so var(--zd-motion-easing) works in any transition.

**Try**

1. Turn On off: the knob moves and the track loses its colour.
2. Pick the Bare variant: its hint is empty, so the line is removed rather than left blank.
3. In Knob motion raise Bounce, then set Type to Easing and pick Ease out.
4. Pick the Locked variant.

**What gets written**

default= on the checked, hint or motion line. A spring is kept as spring(bounce) and a duration, for example default="spring(0.6) 320ms".

## 4. Slot components

Folder `slots/` · 2 frames

### Card slots

Section: Card. `slots/cards.html` · 1320 × 730

**What it shows**

components/card.html is a slot component: no options, just markup with three slots. `<slot data-zd-attr="meta">` and `<slot data-zd-attr="heading">` take attribute values as text; the plain `<slot>` takes the instance's children. A missing attribute, or no children, shows the slot's fallback.

**Try**

1. Select a card. It is one layer, the `<zd-card>` tag. The card's own markup comes from the component file, so ⌘-click on its heading selects the card.
2. ⌘-click a child inside a card, such as case 7's paragraph. Children belong to this frame, so the Style panel edits them, but Layers does not list them: the card's row has no children (issue 15).
3. Compare cases 2, 3 and 4: a missing attribute shows the fallback, an empty one shows nothing, and tags in a value stay text.
4. Select the Release notes button in case 1. It renders as a Button but shows no Options: issue 11 on page 11.

**What gets written**

A Style edit on a card writes the `<zd-card>` tag's style attribute. An edit on a child writes that child. To change every card, edit components/card.html in Files.

### Stats and lists

Section: Stat and list item. `slots/stats-and-lists.html` · 1100 × 670

**What it shows**

Two more slot components. zd-stat has three attribute slots (label, value, delta) and a body slot. The delta's colour comes from a plain host attribute: zd-stat[data-trend="down"] .stat-delta in the component's style. zd-list-item puts its children in the leading slot, here Avatar instances.

**Try**

1. Compare the four stats: up is green, down red, flat grey. "New metric" sets only label, so value, delta and body show their fallbacks.
2. In Files, change a stat's data-trend from down to up and save.
3. Select an avatar in the People list. It renders with its own attributes (status, shape, the Team variant) but shows no Options: issue 11.
4. "Unassigned seat" has no children, so its leading slot shows the fallback, a "?" avatar.

**What gets written**

Selecting writes nothing. A Style edit on a `<zd-stat>` or `<zd-list-item>` tag writes that tag's style attribute in this file.

## 5. Instances

Folder `instances/` · 3 frames

### Button instances

Section: Every combination. `instances/buttons.html` · 1000 × 940

**What it shows**

44 instances of the page 3 Button: tone × size, each drawn state, loading and icons, each variant, and variants with overrides. Each value is looked up in order: the instance's attribute, then its zd-variant, then the option's default.

**Try**

1. Select "Pill, danger". Variant reads Pill, and Tone has a dot because it differs from what Pill gives it.
2. Set its Tone to Accent, the inherited value: the dot goes.
3. Set its Variant to Default, then press Reset options (the arrow in the Options header).
4. With a button selected, double-click its label. The panel names the part and says "Part of Button.", with Select instance and Edit main. Parts are read only; Escape goes back to the button.
5. Select "Explicit default": tone="accent" equals the default, so Tone has no dot although the attribute is written.

**What gets written**

Step 2 removes tone="danger" from that tag, because the value equals what it inherits. Step 3 removes zd-variant, then Reset removes every option attribute. data-oid, class and style are kept.

### Badge classes and instances

Section: Every combination. `instances/badges.html` · 900 × 500

**What it shows**

Two ways to the same badges. The matrix is 25 plain elements: .badge plus a tone class (badge--info and so on) plus a look class (badge--soft, --solid or --outline), all from ui.css. The row below holds 8 Badge instances: the default, each variant, then overrides.

**Try**

1. Select a matrix badge such as Success, Solid. "Styled by 3 classes" opens to one row per class; click badge--solid to see only what it sets.
2. Change that badge's Opacity to 80. The field gets a dot. To remove your value, select the field's text and press ⌥⌫, or click a blank part of the panel, hover Opacity and choose Clear. These badges are text layers, so Corner radius is not shown; page 7 covers radius on boxes.
3. Select the "Custom ink" instance: Ink and Wash are literals, rebeccapurple and rgb(102 51 153 / 0.12).
4. Select "Inbox": Count 12 shows the bubble.

**What gets written**

Step 2 adds style="opacity:0.8;" to that one badge. Clear takes the declaration out but leaves an empty style="" behind (issue 14). .badge--solid in ui.css is never rewritten, so the other badges are unchanged. Option changes write attributes on the `<zd-badge>` tag.

### Project settings

Section: Instances in context. `instances/in-context.html` · 1100 × 1120

**What it shows**

A full settings screen built from 19 instances of the page 3 components, plus ui.css classes: Tabs, an Alert, Text fields, Switch rows, Avatars, Badges, Progress bars and Buttons. Every value is an attribute you can adjust.

**Try**

1. Select the URL slug field. Variant reads Error, and Label and Width have dots because they differ.
2. Set the Storage bar's Value to 90 and Tone to Warning.
3. Select the Audit log row and set Variant to Default: it is no longer locked.
4. Select Save settings, then double-click its label to select the label part. Press Select instance to go back.
5. Select a member's avatar and turn Ring on.

**What gets written**

Each step changes attributes on one tag in this file, for example value="90" tone="warning" on `<zd-progress data-oid="ctx-storage">`. The components on page 3 are not touched. Discard this file in Changes to undo.

## 6. States

Folder `states/` · 6 frames

### Live states

Section: Live states and the State picker. `states/live.html` · 1100 × 680

**What it shows**

The State picker. A layer gets a State button in the Style panel header only when a rule names it with :hover, :focus, :focus-visible, :active or :disabled. Picking a state draws the layer in that state on the canvas and narrows the panel to what the state's rule changes.

**Try**

1. Select the Accent button. Open Layer state in the panel header and pick Hover: the panel lists only the background, from .btn[data-tone="accent"]:hover.
2. Pick Active, then Focus visible. Fields stay read only until you press Back to Default.
3. Move the pointer over the real controls: :hover rules apply live and the toggle's transition animates.

**What gets written**

Nothing. A picked state is view only: fields stay read only until Back to Default, and the choice is not saved. To change how a state looks, edit its rule in source: this frame's `<style>`, ui.css, or for Tailwind its hover: utility.

### Drawn states

Section: Drawn states. `states/drawn.html` · 1100 × 780

**What it shows**

Drawn states, rule 2 in rules.md: a state is an attribute or a state class on the same markup, such as data-state="hover" or .is-open, so a capture or a reviewer sees it without hovering. The live frame above needs a pointer instead. Button's Drawn state option on page 3 sets data-state the same way.

**Try**

1. Select any button in the first row and look at the CSS tab: the same .btn rules, with [data-state] choosing the look.
2. Change a button's data-state in the file from hover to disabled. The canvas redraws it at once.
3. Select the open disclosure: its body shows only because of [data-state="open"].

**What gets written**

Changing data-state in the file is a one-attribute diff. A Style edit on one drawn copy writes that copy's style attribute; the [data-state] rules stay shared.

### Content states

Section: Content states. `states/content.html` · 1200 × 600

**What it shows**

The four content states reviewers ask for, on one Deploys card: empty, loading, error and long text. The empty state places a Button (Compact variant), the error state an Alert (Failed variant) and the long state two Badges. .long-text sets overflow-wrap: anywhere so unbroken names wrap.

**Try**

1. Select a skeleton bar. Its shimmer is a CSS @keyframes animation; with it selected, open the motion timeline (⇧M).
2. Select the error Alert. Variant reads Failed; Heading and Message have dots because this instance overrides them.
3. Select the long title and narrow its column's width in Layout: it keeps wrapping.
4. Select the empty-state button and change its Label.

**What gets written**

Option changes write attributes on that instance's tag in this file. Style edits write the layer's style attribute. The components stay as they are.

### Sign in — Default

Section: One frame per state. `states/sign-in-default.html` · 440 × 560

This frame has no note of its own; the note beside the last frame in its row covers it.

### Sign in — Error

Section: One frame per state. `states/sign-in-error.html` · 440 × 560

This frame has no note of its own; the note beside the last frame in its row covers it.

### Sign in — Loading

Section: One frame per state. `states/sign-in-loading.html` · 440 × 560

**What it shows**

One frame per state: the same sign-in screen as Default, Error and Loading. Use this when a state changes the whole screen; use drawn states when it changes one control. The three files differ only in instance attributes. Error adds an Alert and sets state="error" on the password field. Loading sets loading="true" on the button and state="disabled" on both fields.

**Try**

1. Select the Sign in button in each frame and compare Options.
2. Select the password field in Sign in — Error. Drawn state reads Error, and Hint has a dot.
3. Change something in one frame, then open Changes: only that file changed.

**What gets written**

Each edit writes one attribute on one tag in that frame's file. Frame titles and sizes are in meta/canvas.json.

## 7. Style panel

Folder `style-panel/` · 10 frames

### Position

Section: Position and Layout. `style-panel/position.html` · 1200 × 820

**What it shows**

Position. For a free layer (position: absolute), X and Y edit left or right and top or bottom, and the pins choose which edges it keeps when its parent resizes. Rotation and flip write the rotate and scale properties, not transform. A layer in a flex or grid parent is placed by that parent, so Position offers Place freely instead.

**Try**

1. Select "left 16 · top 16". Position shows X 16 and Y 16. Drag it on the canvas: only left and top change in its style attribute.
2. Select "right 16 · top 16": the right pin is on because the layer sets right, not left. It keeps 16px from the right edge when the board resizes.
3. Select a flow item in the row: Position says "Placed by its parent's auto layout" and offers Place freely.

**What gets written**

Dragging or typing changes only the offsets the layer already uses in its style attribute. Place freely writes position: absolute with left, top, width and height that keep the layer where it is, and sets position: relative on a static parent, as one undo step.

### Layout

Section: Position and Layout. `style-panel/layout.html` · 1200 × 860

**What it shows**

Layout. On a container: auto layout (none, row, column or grid), wrap, grid tracks, gap, padding and alignment. On any layer: width and height (fixed, Hug or Fill), limits, margins and clipping. Images also get Fit, which is object-fit. The padding and gap handles on the canvas edit the same declarations.

**Try**

1. Select the Row box: Auto layout is Row, gap 12, padding 16. Switch it to Column; only display and flex-direction change.
2. Select the Grid box and set Columns to 4. Zeros writes grid-template-columns: repeat(4, minmax(0, 1fr)).
3. In the Sizing box, select the Fill cell: width reads Fill. Set it to Hug and see flex-grow, flex-shrink and flex-basis written.

**What gets written**

Row and Column write display: flex and flex-direction; Grid writes display: grid. A track count is written as repeat(N, minmax(0, 1fr)). In a flex parent, Fill and Hug write flex-grow, flex-shrink and flex-basis. Each lands in the layer's style attribute unless a rule styles that layer alone.

### Appearance

Section: Appearance and Fill. `style-panel/appearance.html` · 1200 × 960

**What it shows**

Appearance: opacity from 0 to 100%, corner radius as one value or four corners, and blend mode, which is mix-blend-mode against what lies beneath. Radius fields take a --radius-\* token as a pill.

**Try**

1. Select the 60% tile and type 40 in opacity: only the opacity declaration changes.
2. Select "32 and 4": the radius reads Mixed. Open independent corners to edit each corner.
3. Select a circle on the striped stage and change Blend mode. The file gets one mix-blend-mode declaration.

**What gets written**

Opacity shows a percentage but writes a number from 0 to 1: typing 40 writes 0.4. Each field writes only its own declaration in the layer's style attribute; the classes on these tiles stay as they are. Fields take maths: type 24\*2, +8 or x/2.

### Fill

Section: Appearance and Fill. `style-panel/fill.html` · 1200 × 820

**What it shows**

Fill edits background layers: a solid colour, linear, radial and conic gradients, images, several layers in paint order, and their blend. On a text layer Fill is the text colour. The colour picker has Theme, the colour tokens by source and family, and Custom: hex, opacity, notation and eyedropper.

**Try**

1. Select "Solid, token". Fill shows an --accent pill. In the colour picker, Theme lists colour tokens and Custom edits a literal.
2. Select Linear and drag a stop. The gradient is rewritten in place in the style attribute.
3. Select "Two layers": Fill lists the gradient and the image. Then select a text specimen: Fill is its colour.

**What gets written**

A token writes var(--name); a literal writes the colour as picked. Moving a gradient stop rewrites that gradient in place in the style attribute. On text, Fill writes color.

### Typography

Section: Typography and Stroke. `style-panel/typography.html` · 1200 × 740

**What it shows**

Typography: font, weight, size, line height, letter spacing, alignment, decoration and case, plus the Style row for text styles. Values a layer inherits from a parent are dimmed. On text layers Typography comes before Fill; on a layer without text it is hidden until you add it.

**Try**

1. Select "Text style --text-title". Typography shows the title text style. Pick another and Zeros writes font-size and each part as var().
2. Select Inherited: its values are dimmed because they come from a parent layer. Type a size and it becomes the layer's own value.
3. Select a box with no text on another page: Typography is hidden there. Add it from Add property.

**What gets written**

A text style writes font-size: var(`--text-<name>`) and one var() per part it defines. Typing a size over an inherited value writes font-size on this layer only. The unit menu converts: 12px to rem writes 0.75rem.

### Stroke

Section: Typography and Stroke. `style-panel/stroke.html` · 1200 × 720

**What it shows**

Stroke covers two CSS properties: Inside is border, Outside is outline. Each stroke has a width, a style (solid, dashed or dotted) and a colour, and widths can differ per side.

**Try**

1. Select "Inside, 1px solid": position is Inside, so it is a border. Switch to Outside and Zeros writes outline instead.
2. Select "Per-side widths": the width reads Mixed. Open per side to edit each one.
3. Select "Inside and outside": the section lists the border and the outline as two strokes.

**What gets written**

Switching Inside to Outside moves the stroke from border to outline. Per-side widths are written per side. A colour token is written as var(--border-default) and so on. Each change lands in the layer's style attribute.

### Shadow and Blur

Section: Shadow, Blur and Transform. `style-panel/effects.html` · 1200 × 840

**What it shows**

Shadow edits box-shadow (text-shadow on text layers), one row per shadow, drop or inner. Blur edits filter: blur() as Layer blur and backdrop-filter: blur() as Background blur. A value the panel cannot split into rows, such as a filter chain, shows as a raw row you edit as text.

**Try**

1. Select "Drop, token": Shadow shows one drop shadow reading --shadow-sm. Detach writes the value it resolves to.
2. Select "Ring and drop": each shadow is its own row. The plus adds another; the limit counts shadows and blurs together.
3. Select the glass panel on the photo: Blur shows Background blur 12. "Other filters" shows a raw row.

**What gets written**

The box-shadow list is rewritten with your change in place, keeping the other shadows. Detach on a --shadow-\* pill writes the shadow it resolves to. Blur writes filter or backdrop-filter.

### Transform

Section: Shadow, Blur and Transform. `style-panel/transform.html` · 1200 × 700

**What it shows**

Transform edits the transform property: translate X and Y, rotate, scale X and Y, skew X and Y, plus the origin and perspective. It is hidden on layers without a transform until you add it from Add property.

**Try**

1. Select "Translate": Transform shows X 16 and Y −8 from translate(), not Position's left and top.
2. Select "All three" and change Rotate. Zeros rewrites the transform list in place.
3. Transform is hidden on layers that do not use it. Select another layer and add it from Add property.

**What gets written**

Zeros rewrites the transform list in place in the layer's style attribute. Position's rotation and flip are separate properties, rotate and scale, so a layer can use both.

### Transition and Motion

Section: Transition, Motion and More styles. `style-panel/motion.html` · 1200 × 800

**What it shows**

Transition lists one row per transition: property, duration, delay and easing. Motion lists a layer's @keyframes animations and opens the motion timeline (⇧M), which previews and edits the keyframes in this frame's `<style>`.

**Try**

1. Hover the four top tiles on the canvas to run their transitions. Select one: Transition lists each property with its duration, delay and easing.
2. Select Pulse: Motion shows the animation, and the timeline edits the @keyframes pulse rule in this frame's style.
3. Captures stop animations, so the screenshots and the Changes view stay stable.

**What gets written**

Transition rows write the layer's transition declarations. Timeline edits change the @keyframes rule in this frame's own `<style>`. Captures stop animations, so screenshots and the Changes view stay stable.

### More styles and Export

Section: Transition, Motion and More styles. `style-panel/more-styles.html` · 1200 × 800

**What it shows**

More styles lists each authored declaration that no other section shows, as a name and a value written as text. A row's tooltip says which selector and file it comes from. It leaves out base rules such as resets, and a source's own variables such as --tw-\*.

**Try**

1. Select "Cursor and selection": More styles lists cursor and user-select with their values as written.
2. Type a new property at the end of More styles. zIndex is written as z-index.
3. Click the frame title and scroll to Export: pick 1x, 2x or 3x and press Export PNG.

**What gets written**

A new row writes that property on the layer; zIndex is written as z-index. Remove is offered only for inline values; a value from a class is overridden inline. Export PNG saves a picture of the frame, or of the selected layer, at 1x, 2x or 3x; it is not a source edit.

## 8. Values & origins

Folder `origins/` · 2 frames

### Where each value comes from

Section: Where each value comes from. `origins/where-from.html` · 1200 × 1040

**What it shows**

Every kind of origin the Style panel tells apart: set on this layer, changed over its class, from a class or rule, from a parent, from a reset, forced by !important, computed (calc() and the like) and themed. A field's hover card names the origin. A dot marks a value changed here; a dimmed field comes from a parent or a reset.

**Try**

1. Select "Changed over its class" and hover Corner radius: the card shows Value, Was and Reset, and how many other layers use .og-tile.
2. Select "Forced" and click Text color: the field is locked. The card names .og-forced and offers Ask agent to change.
3. Preview Dark (⌥T, then Dark in the menu beside Search) and select "Themed": the Fill card lists the Light value. Typing a colour writes one value for both themes.

**What gets written**

Reset or Clear removes the layer's own declaration, so the class, inherited or initial value shows again: choose it on the field's card, or select the field's text and press ⌥⌫. A computed value is read only and offers Edit in CSS. A forced value offers Ask agent to change. Setting a themed value writes one value for every theme, and the panel says "Changes Light and Dark."

### Styled by and Tidy

Section: Styled by, Changed here and Tidy. `origins/styled-by.html` · 1200 × 560

**What it shows**

The Styled by line under the panel header, and Tidy. Styled by counts the classes, utilities and component that style a layer, then lists Changed here: values set on the layer over them. Choosing a row narrows the panel to what that source sets.

**Try**

1. Select the Promo card. "Styled by 3 classes" opens to .card, .card--elevated, .og-promo and Changed here: Padding and Stroke.
2. Click the .card row: the panel shows only what .card sets, with a note and Show all.
3. Click this frame's title. The panel above Layers counts the changes made by hand and offers Tidy, which asks the agent to move them into tokens, classes or the component.

**What gets written**

Nothing until you edit. Tidy writes nothing itself: it sends the agent a brief naming each change made by hand, and the agent moves them into tokens, classes or the component. Review its edit in Changes.

## 9. Style sources

Folder `sources/` · 5 frames

### Plain CSS: Brand CSS

Section: Plain CSS, styles-only CSS and App fonts. `sources/plain-css.html` · 1200 × 740 · style sources: brand, brand-motion · link cards: styles/brand/brand.css, styles/brand/motion.css

**What it shows**

A style source: a stylesheet in the repository, outside the Design folder. meta/canvas.json declares it under styles, with an id, kind css, its path, and themes mapping [data-theme="dark"] to Dark. This frame lists brand and brand-motion in its styles, so it gets their classes and variables. A frame that lists none gets none.

**Try**

1. Press ⌥T for the theme editor. Under Sources, choose Brand CSS: read-only variables with their Dark values, and a status that explains the skipped @import and @apply.
2. Select Start free trial. Styled by lists .brand-button. Hover Fill: From the class .brand-button, Source Brand CSS.
3. Preview Dark: pick Dark in the menu beside Search. brand.css's [data-theme="dark"] rule applies, because the source maps that selector to the Dark theme.
4. Change the button's corner radius. Zeros writes it on this layer; brand.css stays as it is.

**What gets written**

Nothing in brand.css: Zeros only reads sources. A Style edit writes the layer's style attribute in this frame. To change the brand classes, edit styles/brand/brand.css; frames redraw when you save. The link cards open both files.

### Sass: Sass app

Section: Sass and Tailwind. `sources/sass.html` · 1200 × 600 · style sources: app-sass · link cards: styles/sass/app.scss, styles/sass/_tokens.scss

**What it shows**

A Sass source (kind sass). Zeros compiles styles/sass/app.scss with its own Dart Sass, following the partials, and imports the CSS it produces. The source's themes field maps the @media (prefers-color-scheme: dark) block to the Dark theme.

**Try**

1. Open the theme editor (⌥T) and choose Sass app: "Compiled with Sass", then the --sass-\* variables, each with a Dark value.
2. Select a tile. Styled by lists .tile; Fill reads sass-surface, From the class .tile, Source Sass app.
3. Preview Dark: pick Dark in the menu beside Search. The Sass entry's prefers-color-scheme block is mapped to the Dark theme.
4. Edit styles/sass/_tokens.scss and save. The source recompiles and the frame redraws; no button needed.

**What gets written**

Nothing in the .scss files. Edits on the tiles write their style attributes. Saving a partial recompiles the source, and every frame that uses it redraws.

### Tailwind: Tailwind app

Section: Sass and Tailwind. `sources/tailwind.html` · 1200 × 780 · style sources: tailwind · link cards: styles/tailwind/app.css

**What it shows**

A Tailwind v4 source (kind tailwind). Zeros compiles styles/tailwind/app.css with its bundled Tailwind, scanning only this frame's classes, so the CSS holds just the utilities it uses. @theme values become variables in the theme editor. [data-theme=dark] maps to Dark, and the dark: variant follows it.

**Try**

1. Open the theme editor (⌥T) and choose Tailwind app. The @theme values are its variables; the status names the Tailwind version and the bundled plugin.
2. Select Upgrade. Styled by counts its utilities; hover Fill: From the utility bg-white, Source Tailwind app.
3. With Upgrade selected, open the State menu and choose Hover: hover:bg-brand-50 takes over until Back to Default.
4. Change its padding. Zeros writes an inline style on the layer. The class attribute and its utilities stay as they are.

**What gets written**

An edit never changes the class attribute: Zeros adds an inline declaration over the utility, so Changes shows a style="…" added to the tag.

Known problem: the contrast audit measures the Popular badge at 1.11:1, and in Dark eight more texts here at 1:1 to 2.2:1, because it reads oklch() colours as rgb (issue 4). Their real contrast is 6.7:1 or more. The app shows no audits (issue 6); the README says how to see them.

### Build command: Token build

Section: A build command. `sources/build.html` · 1200 × 600 · style sources: tokens-build · link cards: styles/build/tokens.json, styles/build/build-tokens.mjs

**What it shows**

A build source (kind build): the command node styles/build/build-tokens.mjs, its inputs styles/build, and its output .zeros/design-styles/tokens.css. While Design is open, Zeros runs the command in the repository, runs it again when an input changes, and frames read the CSS it writes. .zeros/ is private local state that Git ignores.

**Try**

1. Open the theme editor (⌥T) and choose Token build. The status reads "Live: Zeros runs … when styles/build change, while Design is open".
2. Change "accent" in styles/build/tokens.json and save. The build runs again and this card redraws with the new colour.
3. Select the card. Its values come from the class .ds-surface, Source Token build, and read the --ds-\* variables the script writes.

**What gets written**

Nothing in tokens.json or the script. The build rewrites .zeros/design-styles/tokens.css, which is never committed. Edits on the card write its style attribute.

### Source status and frame lists

Section: Status and per-frame lists. `sources/status.html` · 1200 × 680 · style sources: legacy, removed · link cards: styles/legacy/vendor.css

**What it shows**

Source status. Legacy vendor CSS (styles/legacy/vendor.css) has a Warning on purpose. Removed stylesheet points at styles/removed.css, which does not exist, so it has an Error and is Not imported. A source with rules but no variables is listed under Styles only.

**Try**

1. Open the theme editor (⌥T). Legacy vendor CSS shows Warning with two messages; Removed stylesheet shows Error and Not imported. Each offers Ask agent to fix.
2. Open Styles only in the Sources list: Brand motion and Legacy vendor CSS have rules but no variables.
3. Press Update sources (the circular arrow) to re-read every source now. Saving a source file does the same on its own.

**What gets written**

Ask agent to fix sends the agent a brief; it edits the source or meta/canvas.json, and you review that in Changes. Update sources writes nothing: it re-reads every source.

## 10. Lint showcase

Folder `lint/` · 9 frames

### What Zeros checks

Section: How the checks work. `lint/overview.html` · 1200 × 1000 · link cards: docs/moved-guide.md (missing on purpose)

**What it shows**

How the checks work. Zeros lints a frame's source each time it changes. An error fails Validate and puts a red line at the top of the Style panel. A warning never blocks a save, and the canvas does not list warnings: the agent's Validate step (design validate) reports each one with its file, line and a fix.

The link card below this note points at a file that is missing on purpose. It shows "File not found", and Validate warns canvas-item-link-missing.

**Try**

1. In the chat, ask: Validate every frame on the Lint showcase page. Each other frame on this page breaks one rule on purpose, and its note quotes what Validate reports.
2. Ask the same for page 2. Pages 1 to 9 report nothing, because they follow the rules in rules.md.
3. Ask the agent to fix the Unknown classes frame, then open Changes to see its edit. Discard the change to put the demo back.

**What gets written**

Nothing. Checks only read. A fix comes from you or the agent, and shows in Changes like any edit.

### Unknown tokens and literal colours

Section: Rules 1 and 3: classes, tokens and literal colours. `lint/tokens.html` · 1200 × 600

**What it shows**

Rule 3: write tokens, not their values. Validate reports 6 warnings for this frame:

- Unknown design token "--fg-strongest". (line 32)
- Write var(--border-default) instead of the literal colour "#cdd2da" (line 13, in the frame's `<style>`)
- Write var(--accent-soft) instead of "#ebebfb", and var(--accent) instead of "#5151cc" (line 42)
- Write var(--bg-inverse) or var(--fg-strong) instead of "rgb(22 24 29)", and var(--bg-surface) or var(--fg-inverse) instead of "#ffffff" (line 43)

When two tokens hold the same value, the message names both.

**Try**

1. Select the fg-strongest chip. The text colour in Typography shows fg-strongest is missing. Its card says the field keeps its last value, and offers Pick another.
2. Select the pale chip under Literal colours. Fill shows the hex value. Choose accent-soft in the token list: Zeros writes the token in that chip's style attribute, and that warning goes away.
3. Preview Dark (⌥T, then Dark in the menu beside Search). The token chips change with the theme; the literal chips keep their light-theme colours.

**What gets written**

Choosing a token in Fill writes var(--accent-soft) in that chip's style attribute, and its warning goes away at the next check.

### Unknown classes

Section: Rules 1 and 3: classes, tokens and literal colours. `lint/classes.html` · 1200 × 760

**What it shows**

Rule 1: one class vocabulary. A class is unknown when nothing this frame receives defines it. Validate reports 3 warnings, each at the name's first use:

- Class "card--glow" has no CSS in this frame's styles. (line 30)
- Class "btn-primary" has no CSS in this frame's styles. (line 37)
- Class "badge--sucess" has no CSS in this frame's styles. (line 44)

**Try**

1. Select the left card under An invented modifier. Styled by lists only card: card--glow has no rules, so it adds nothing.
2. Ask the agent to validate this frame: three warnings, one per name. badge--sucess is used twice but reported once.
3. Ask the agent to fix the frame, then open Changes: each name becomes the one ui.css defines. The Style panel never renames classes itself.

**What gets written**

The Style panel never renames classes. The agent's fix edits the class attributes in this file, for example badge--sucess becomes badge--success.

### Repeated inline styles

Section: Rules 4 and 8: repeated inline styles and markup. `lint/inline-styles.html` · 1200 × 550

**What it shows**

Rule 4: inline style is for one-off values. The check looks for the same two or more declarations on three or more layers. Validate reports:

- Move the inline style "background-color: var(--bg-surface); border-radius: 14px; flex: 1; padding: 16p…", repeated on 3 elements (lines 34, 35 and 36), into one class.

**Try**

1. Shift-select the three tiles on the left. Each carries the same five inline declarations, so Validate warns once for the set.
2. Select a tile in the middle and change its padding. Zeros writes padding in that tile's style attribute; the class stays as it is. A one-off edit never warns.
3. Ask the agent to fix this frame. It moves the shared declarations into a class in the style element and uses that class on each tile.

**What gets written**

A Style panel edit adds one declaration to one layer, so it never trips this check alone. The agent's fix adds a class to the frame's `<style>` and swaps the three style attributes for it.

### Repeated markup

Section: Rules 4 and 8: repeated inline styles and markup. `lint/repeated-markup.html` · 1200 × 760

**What it shows**

Rule 8: markup repeated three or more times becomes a component. The check compares trees of tags and classes, at least four elements and two levels deep, and ignores text and other attributes. Validate reports:

- Make the `<article>` markup with class "card card--flat", repeated 3 times (lines 31, 32 and 33), one component.

The three cards on the right are `<zd-card>` instances, so they do not count.

**Try**

1. Ask the agent to validate this frame. It names the hand-written cards on the left and their three lines. Pro counts too: state classes such as is-selected are ignored.
2. Select a card on the right. It is an instance of components/card.html: its meta and heading are attributes, and its body is its children. Change that file once and all three follow.
3. Ask the agent to turn the left cards into a component. It reuses card or writes a new components file, and replaces each copy with one tag.

**What gets written**

The agent's fix replaces each copy with one `<zd-card>` tag, reusing components/card.html, or adds a new components file.

### Captured markup

Section: Rules 5 and 7: layer ids and captured markup. `lint/captured.html` · 1200 × 550

**What it shows**

Rule 7: markup captured from elsewhere. data-zd-captured on a root makes three checks skip everything under it: repeated inline styles, literal colours and repeated markup. The right copy is not marked, so Validate reports 11 warnings for it, all from line 37. For example:

- Make the `<div>` markup repeated 3 times (lines 37, 38 and 39), one component.
- Write var(--success) instead of the literal colour "#147a4c" (3 places: lines 37, 38 and 39).
- Move the inline style "display: flex; gap: 4px", repeated on 3 elements (lines 37, 38 and 39), into one class.

**Try**

1. Ask the agent to validate this frame. Every warning points at the right-hand copy. The left copy sits under a data-zd-captured root and reports none.
2. Preview Dark (⌥T, then Dark in the menu beside Search). Both copies stay light: captured markup keeps its source's literal colours, not this folder's tokens.
3. Select a captured card and change its padding. Style panel edits work on captured markup as on any other layer.

**What gets written**

Nothing: the attribute is the whole fix. Mark only markup that really came from elsewhere.

### Duplicate layer ids

Section: Rules 5 and 7: layer ids and captured markup. `lint/layer-ids.html` · 1200 × 500

**What it shows**

Rule 5: each data-oid must be unique in its frame. It is how Zeros finds a layer again after the markup around it changes. Validate reports:

- data-oid "li-save" is duplicated in this frame. (line 30)

When Zeros draws the frame, it gives the second copy a generated id, so each copy can be selected. Unlike every other frame in this demo, most layers here have no data-oid, on purpose.

**Try**

1. Ask the agent to validate this frame: data-oid "li-save" is duplicated in this frame.
2. Select each button on the left in turn and watch the Style panel header and Layers.
3. Give the second button its own id in Files, for example li-save-copy, or ask the agent. The warning goes away.

**What gets written**

The first edit to a layer here also saves the second copy's generated id, and writes an id onto each of the 17 layers that have none, so Changes shows 18 more lines than your edit (issue 12). Validate then no longer reports the duplicate; Discard the file to bring it back.

The fix by hand is one attribute: give one copy a new data-oid in Files.

### Options without a component name

Section: Component warnings. `lint/unregistered.html` · 800 × 390

**What it shows**

A frame that declares options but has no component name in meta/canvas.json. It draws its defaults, but no frame can place it and it has no Options. It also has a second `<template data-zd-options>`, which is ignored. Validate reports:

- This frame declares options but is not registered as a component, so no other frame can place it. (line 1)
- Only the first `<template data-zd-options>` in `<head>` is read; move these options into it. (line 10)

**Try**

1. Select the frame. The panel shows no Options section, unlike the frames on page 3.
2. Ask the agent to validate it: one warning says the frame is not registered and suggests a component name, and one says only the first options block in head is read.
3. Ask the agent to register it. It adds a component name to this frame in meta/canvas.json and merges the two blocks.

**What gets written**

Registering adds "component": "`<name>`" to this frame's record in meta/canvas.json. Merging moves the second block's lines into the first.

### Instance attributes that are not options

Section: Component warnings. `lint/instances.html` · 1200 × 480

**What it shows**

Instance attributes that name no option. They are ignored, never rewritten, and the Options section shows a yellow notice for each. Validate reports:

- This component has no option lable; lable="Save draft" is ignored. (line 29)
- This component has no option colour; colour="green" is ignored. (line 37)

class, style, data-oid, data-name and other host attributes are never counted.

**Try**

1. Select the first button. Options shows a warning that its lable attribute names no option. Label still reads Save changes, the default.
2. Ask the agent to validate this frame: two warnings, each naming the ignored attribute and its value.
3. A value that an option does not allow, such as tone="purple", is an error instead. This page draws none, because the Style panel's red line shows the first error in the folder whichever frame you select.

**What gets written**

Nothing until it is fixed. Renaming lable to label in Files makes the value apply, and Label then shows it with a dot.

## 11. Known issues

Folder `issues/` · 5 frames

### Known issues

Section: All known issues. `issues/overview.html` · 1200 × 1160

**What it shows**

Every Zeros problem found while building this demo, with the place in the Zeros repository where it starts. Issues 11 to 15 have no frame on this page: 11 and 15 show on page 4, 12 on page 10 and 14 on page 5. 13 shows nowhere, because this demo lists its components already; README.md says how to see it.

**Try**

1. Go through the frames on this page in order; each note says what to look for.
2. For issues 4 to 6, read README.md in the demo repository: it explains how to run the audits from a terminal.
3. For issue 8, ask the agent to set tone="purple" on one Button instance, which is an error, then select a frame on another page: the red line is still there. Discard the change afterwards.

**What gets written**

Nothing. This page only reports. Paths are relative to the root of the Zeros repository.

### Template issues

Section: Issues 1 and 2: component templates. `issues/template.html` · 1200 × 700 · registered as the component `template-issues`, placed with `<zd-template-issues>`

**What it shows**

Issues 1 and 2. The badge's class attribute is badge badge--soft badge--{{ tone }}: the hole fills in when Zeros draws, but the unknown-class check reads the raw attribute. Validate reports three false warnings, for "badge--{{", "tone" and "}}" (line 33).

The card is a `<zd-card>` wrapped in `<template data-zd-if="show-card">`. Zeros never expands an instance inside a template wrapper, so it stays a bare tag showing its text, and Validate says nothing.

**Try**

1. Select the frame and change Tone in Options. The badge follows, because the hole fills its class.
2. Ask the agent to validate this frame. It still warns that pieces of the class attribute are unknown classes.
3. Turn Show the wrapped card off and on. Its text comes and goes, but it never becomes a card.

**What gets written**

Tone and Show the wrapped card write default= in this file, like any main component.

### Check issues

Section: Issues 3 to 7: checks and Tailwind. `issues/checks.html` · 1200 × 480

**What it shows**

Issues 3 to 5.

3: unknown-token reads the raw file, so a sentence naming a token warns: Unknown design token "--gap-xl". (line 29)

4: dark text on a light oklch() fill. Its real contrast is high, but the contrast audit reads oklch() as rgb and measures 1.04:1.

5: a label cut off with text-overflow: ellipsis. The overflow audit reports it as overflow, 387px of text in 327px.

Issues 4 and 5 are audits, which the app never shows (issue 6).

**Try**

1. Ask the agent to validate this frame. It warns that --gap-xl is an unknown token, though the name only appears in a sentence.
2. Cases 4 and 5 trip the canvas's own audits. The demo repository's README says how to see that.

**What gets written**

Nothing.

### Tailwind with a .dark class

Section: Issues 3 to 7: checks and Tailwind. `issues/dark-class.html` · 1200 × 470 · style sources: tailwind-class-dark · link cards: styles/tailwind-class-dark/app.css

**What it shows**

Issue 7. Tailwind (.dark class) declares themes: { dark: ".dark" }. When Zeros imports the compiled CSS it rewrites the selector .dark to the canvas's Dark theme, but the rewrite also matches the start of Tailwind's escaped class names, such as `.dark\:bg-zinc-900`. So every dark: utility becomes a selector that never matches, and the card stays light in Dark.

**Try**

1. Preview Dark (⌥T, then Dark in the menu beside Search). The card keeps its white fill and dark text.
2. Compare the Tailwind frame on page 9. Its dark: variant follows data-theme instead, and its cards turn dark.
3. Open the theme editor (⌥T) and choose Tailwind (.dark class): its Dark mapping is .dark.

**What gets written**

Nothing. The fix belongs in Zeros: engine/design/style-sources.ts, importPlainDesignPiece.

### Component CSS

Section: Issue 10: component CSS. `issues/component-css.html` · 1200 × 490 · link cards: components/pill.html

**What it shows**

Issue 10. components/pill.html's style sets .badge { --badge-ink: var(--accent); … } with no scope. Zeros copies that style element unchanged into the head of every frame that places a Pill, so here it reaches the three plain badges too, and all three turn accent.

Page 3's Badge and Button limit their rules with :where(.stage, zd-badge) > .badge, which is the workaround until Zeros scopes component styles.

**Try**

1. Compare the three badges on the left with the Soft column of the matrix on page 5. The classes are the same; only this frame places a Pill.
2. Remove the zd-pill tag in Files, or ask the agent to. The badges get their tones back. Discard the change in Changes afterwards.
3. Open options/badge.html from page 3. Its rule is limited to its own markup with :where(.stage, zd-badge) > .badge, so page 5 is not affected.

**What gets written**

Removing the `<zd-pill>` tag is a one-line change in this file; Discard puts it back. The link card opens components/pill.html.
