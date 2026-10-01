---
name: Rosary Turn
description: OpenRosary's reader adapted to coding sessions.
colors:
  accent-dark: "#9dceff"
  accent-light: "#1769b0"
  background-dark: "#000000"
  background-light: "#f5f8fc"
  panel-dark: "#101010"
  panel-light: "#ffffff"
  text-dark: "#f6f6f6"
  text-light: "#10233b"
  muted-dark: "#b5b5b5"
  muted-light: "#52657d"
  glass-dark: "rgba(255, 255, 255, 0.03)"
  glass-light: "rgba(23, 105, 176, 0.1)"
typography:
  display:
    fontFamily: 'Geist, "Google Sans Text", "Google Sans", system-ui, sans-serif'
    fontSize: "clamp(38px, 9vw, 88px)"
    fontWeight: 700
    letterSpacing: "-2px"
  headline:
    fontFamily: 'Geist, "Google Sans Text", "Google Sans", system-ui, sans-serif'
    fontSize: "27px"
    fontWeight: 700
  title:
    fontFamily: 'Geist, "Google Sans Text", "Google Sans", system-ui, sans-serif'
    fontSize: "22px"
    fontWeight: 700
  body:
    fontFamily: 'Geist, "Google Sans Text", "Google Sans", system-ui, sans-serif'
    fontSize: "18px"
    lineHeight: 1.7
  action:
    fontFamily: 'Geist, "Google Sans Text", "Google Sans", system-ui, sans-serif'
    fontSize: "16px"
  label:
    fontFamily: 'Geist, "Google Sans Text", "Google Sans", system-ui, sans-serif'
    fontSize: "14px"
rounded:
  progress: "2px"
  field: "4px"
  control: "6px"
  prayer: "10px"
spacing:
  compact: "8px"
  control: "12px"
  content: "16px"
  inset: "24px"
components:
  button-mystery:
    backgroundColor: "transparent"
    textColor: "{colors.muted-dark}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-mystery-light:
    textColor: "{colors.muted-light}"
  button-mystery-hover:
    textColor: "{colors.text-dark}"
  button-mystery-suggested:
    textColor: "{colors.accent-dark}"
  button-back:
    backgroundColor: "transparent"
    textColor: "{colors.muted-dark}"
    typography: "{typography.label}"
    padding: "10px 0"
  button-theme:
    backgroundColor: "transparent"
    textColor: "{colors.muted-dark}"
    rounded: "{rounded.control}"
    padding: "8px"
  field-language:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.muted-dark}"
    rounded: "{rounded.field}"
    padding: "6px 28px 6px 12px"
  card-prayer:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.prayer}"
    padding: "24px"
  card-prayer-light:
    backgroundColor: "{colors.panel-light}"
    textColor: "{colors.text-light}"
  progress-fill:
    backgroundColor: "{colors.accent-dark}"
    height: "4px"
---

# Design System: Rosary Turn

## Overview

**Creative North Star: "The OpenRosary Reader"**

The OpenRosary Reader preserves OpenRosary's Geist type, restrained controls, and space around prayer text. The user's later direction replaces the blue dark grounds with pure black and neutral panels, while keeping blue titles, progress, and working-session status. Light mode retains the OpenRosary palette.

The system uses one column and tonal panels. Coding-session information occupies a compact strip, leaving prayer content dominant. Authorship remains visible in a small linked footer. Route strategy and the bounded native-curtain adaptation live in `.impeccable/surfaces/app-reader-js.md`.

**Key Characteristics:**
- Pure black and neutral dark grounds, cool light grounds, and one blue accent in each theme.
- Local Geist with bold centered headings and regular prayer text.
- One scrollable prayer panel, slim progress, and quiet navigation.
- Original Quran Turn and OpenRosary authorship visible in the footer.

Source evidence: `app/openrosary.css` preserves the OpenRosary stylesheet; `app/reader.css` supplies local-font, session, accessibility, and curtain overrides; `app/reader.js` supplies states and navigation. Unused upstream style families are excluded.

## Colors

The palette pairs blue accents with black and neutral gray in dark mode, and cool neutrals in light mode. Frontmatter records both themes; runtime custom properties select the active set.

### Primary
- **Sky Blue** (`accent-dark`): mystery headings, suggested choices, progress, and working-session status on dark surfaces.
- **Prayer Blue** (`accent-light`): the same accent roles on light surfaces.

### Neutral
- **Night Ground / Cool Ground** (`background-dark` / `background-light`): the page behind content.
- **Night Panel / White Panel** (`panel-dark` / `panel-light`): the prayer container and language field.
- **Pale Text / Ink Text** (`text-dark` / `text-light`): prayer text and labels.
- **Mist Text / Slate Text** (`muted-dark` / `muted-light`): navigation, progress count, instructions, and credits.
- **Quiet Edge** (`glass-dark` / `glass-light`): subtle panel and theme-control borders and the session divider.

**The Theme Pair Rule.** Use the active background, panel, text, muted, accent, and glass custom properties together. Preserve the user's black dark palette and OpenRosary's light palette.

## Typography

**Display Font:** Geist, with Google Sans Text, Google Sans, system-ui, and sans-serif fallbacks.
**Body Font:** the same family and fallbacks.

**Character:** One sans-serif family links the oversized selection wordmark to the practical reader. Geist is bundled locally as a variable font (weights 100–900), with swap loading.

### Hierarchy
- **Display:** the parenthesized wordmark uses the display role; mobile resolves to the source's final override (46px).
- **Headline:** the centered mystery heading uses the headline role; mobile resolves to (23px).
- **Title:** the centered prayer label uses the title role; mobile resolves to (19px).
- **Body:** prayer text uses the body role with preserved line breaks; mobile resolves to (17px) with the same line height. Container width determines line length.
- **Action:** lowercase mystery and prayer-navigation controls use the action role; mobile resolves to (15px).
- **Label:** progress, instructions, and language selection use the label role. The session strip is smaller (13px); credits use (11px) and a line height of (1.6).

## Layout

The centered width is capped (800px). Selection content uses padding (48px 24px); mobile uses (40px 20px). Reader content uses an inset (24px), reduced to (20px) on mobile. Headings precede a flexing prayer pane; progress and previous/next controls follow. The recurring spacing steps are recorded in frontmatter.

The mobile breakpoint is (640px). Mystery choices stack; reading controls remain in one horizontal header. At (350px), reader inset and control gaps reduce further. Minimum page width is (280px). Prayer content scrolls independently while its surrounding page can grow. The browser reader accounts for status and credits using a viewport-relative minimum height. Native curtain dimensions belong to the surface brief, rather than reusable spacing tokens.

## Elevation & Depth

Depth comes from panel tone, a subtle border, and a short fading line before prayer text. Reading surfaces have no resting shadow. Mystery buttons gain a diffuse blue hover shadow (`0 8px 24px rgba(65, 134, 205, 0.15)`) and clearer border. Retained upstream modal styles are unused by this reader.

**The Quiet Panel Rule.** Keep the prayer panel flat at rest; preserve the source's tonal surface and subtle edge.

## Shapes

The prayer panel has the broadest recurring curve; controls have smaller curves and progress has a fine curve. Values are recorded in frontmatter. Language selection keeps a compact rectangular form with native dropdown interaction. Borders stay thin (1px). The panel clips scrolling content; the progress track clips its fill.

## Components

### Buttons

Quiet text controls inherit the active theme. Mystery buttons use transparent backgrounds and faint borders. Hover changes text to the main text color, strengthens the border, and adds the source blue shadow with a short transition (0.18s). The suggested mystery uses accent text and border. Previous/next, resume, and restart have minimum touch heights (44px). Disabled buttons use reduced opacity (0.5) and the default cursor. Back controls are borderless; the theme control retains a quiet edge. Keyboard focus uses an accent outline (2px), offset (4px).

### Cards / Containers

The prayer card uses the active panel, quiet edge, and prayer radius. Body padding comes from frontmatter, reduced on mobile (16px). A short gradient divider precedes text. Content scrolls vertically; the focusable pane uses the shared keyboard outline.

### Inputs / Fields

The language field uses panel background, a thin pale border, and the field radius. Hover/focus changes text and border toward accent; keyboard focus follows the shared outline. Latin is a native checkbox beside a muted label with minimum height (44px); it uses the active accent. No free-text field or chip family exists.

### Navigation

Mystery selection wraps horizontally on desktop and stacks on mobile. Prayer navigation places previous and next at opposite ends below progress. Lowercase labels follow OpenRosary. Arrow keys and horizontal swipes complement visible buttons. Returning to selection or the reader moves focus to the appropriate control; restart focuses next prayer.

### Coding Session Strip

The compact strip uses muted text by default and accent for working. Attention is amber (dark: `#f2cc7a`, light: `#805306`); completion is green (dark: `#9ad9b2`, light: `#246440`). These colors are scoped to session status. Status text is announced through a live status role and can wrap. Back-to-agent and curtain-close actions appear when applicable.

### Progress and Completion

The narrow track contains an accent fill, with a centered fraction conveying progress alongside color. Fill changes use a short transform transition (0.3s). Completion disables next and reveals restart. Reduced-motion preferences disable reader animations and transitions, including theme reveal. Native curtain movement remains a host concern.

### Credits

A centered footer links Quran Turn by Rizaldy and OpenRosary. Links retain underlines and adopt accent on hover. Credits remain visible in the browser and bounded curtain, including completion.

## Do's and Don'ts

### Do:
- **Do** preserve the black dark palette, OpenRosary light palette, local Geist, type hierarchy, and spacing.
- **Do** retain the parenthesized wordmark and lowercase mystery choices.
- **Do** keep original authorship visible and linked.
- **Do** keep text status, progress count, keyboard focus, and visible navigation alongside color and gestures.
- **Do** honor reduced-motion preferences for reader animation.

### Don't:
- **Don't** replace the requested OpenRosary identity with a newly invented visual world.
- **Don't** spread session amber or green into the prayer palette.
- **Don't** add a resting shadow to the prayer panel.
- **Don't** promote unused upstream styles into new canonical components.
