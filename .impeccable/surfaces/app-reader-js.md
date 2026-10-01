---
version: 1
slug: "app-reader-js"
primary_target: "app/reader.js"
related_targets: ["app/index.html", "app/notch.html", "app/openrosary.css", "app/reader.css"]
---

# OpenRosary session reader

Mode: Operate / Read. ENERGY 1, RHYTHM 1, MOTION 1.

The visitor prays while a coding agent works, advances through prayer, and returns to the agent when needed. Reproduce the requested OpenRosary interface using its source as visual authority. The compact session strip supplies coding context; prayer remains dominant. Selection keeps the parenthesized wordmark, four lowercase choices, today's suggested mystery, and resume action. Original authorship stays visible.

The browser reader puts session status above a centered header, mystery title, prayer label, scrollable pane, progress, navigation, and credits. Desktop and mobile retain this sequence. Left/Right, horizontal swipe, and visible buttons advance prayer; Up/Down scroll the prayer pane, including while an options control has focus. English/Indonesian, optional Latin, and light/dark preferences retain the visual grammar. Completion retains progress and previous navigation, disables next, and reveals restart.

Native curtain contract: the host requests 420px of height, while the card fills the actual visible viewport (100dvh) to accommodate host/browser scaling differences. A column layout reserves space for the status strip and credits. The reader and its container flex to fill the rest with zero minimum height. The prayer pane takes remaining height, scrolls, and can shrink to a 54px minimum. Controls, heading gaps, and credits are compact. Instructions and the duplicate completion paragraph are hidden in this surface; completion prayer text and restart remain visible. Navigation and credits fit inside the card on ordinary steps and completion, with only 8px beneath credit text. Selection fills the same available content area. These measurements belong to this host contract rather than global tokens.

Motion: preserve upstream curtain-host behavior and OpenRosary theme reveal. Reader reduced-motion preferences disable transitions and animation. Session status changes text and color without extra motion.

Evidence: `.impeccable/review/desktop.png` and `mobile.png` show the light reader; `curtain.png` shows the dark 420px curtain; `curtain-completion.png` shows light completion; `selection.png` shows dark selection. The final finish reviewer scored the P1 curtain clipping fix resolved and gave disposition **ship** for that correction. This records the review's actual scope. macOS native execution remains unverified.

Dark mode uses a pure black background and neutral gray panels and text, per the user's updated direction. Blue titles, progress, and working-session status remain; light mode retains the source palette.

Unresolved: macOS host execution. No visual identity decision remains open; preserve the updated palettes, source typography, and spacing.
