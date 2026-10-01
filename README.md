# Rosary Turn

Pray the Rosary while your coding agent works.

**Based on [Quran Turn](https://github.com/rzrizaldy/quran-turn), originally created by Rizaldy.** This repository is a GitHub fork, preserving his history, session engine, and MIT copyright. The Rosary interface and prayers come from [OpenRosary Web](https://github.com/pinterbanget/openrosary-web). See [NOTICE.md](NOTICE.md) for provenance and a ready-to-use launch credit.

Send a coding prompt: the Rosary reader opens at your saved prayer. When the agent needs approval, the status strip tells you. When the turn finishes, your place is saved. The native curtain folds away; regular browser windows use the original macOS switching behavior. Windows uses a dedicated Edge/Chrome app window by default, with the original experimental top-of-screen curtain available as an option.

The reader uses OpenRosary's source stylesheet, Geist font, centered mystery and prayer headings, scrollable prayer pane, and progress bar. Dark mode adapts it to a pure black background with neutral panels, retaining blue accents. It adds a compact session strip, mouse navigation, and permanent attribution. No runtime dependencies, account, analytics, or external network calls. Requires Node.js 18+.

## Try it

```sh
git clone https://github.com/pinterbanget/rosary-turn
cd rosary-turn
node bin/rosary-turn open
```

The reader runs at http://127.0.0.1:47115. `npm start` runs the server in the foreground. `npm test` and `npm run verify` check session behavior and the bundled source snapshot. No `npm install` is required.

## Use during coding sessions

Claude Code, from a source checkout:

```sh
claude --plugin-dir ./rosary-turn
```

Or install the fork's marketplace:

```sh
claude plugin marketplace add pinterbanget/rosary-turn
claude plugin install rosary-turn@rosary-turn
```

Restart Claude Code after installation.

Codex:

```sh
codex plugin marketplace add pinterbanget/rosary-turn
codex plugin add rosary-turn@rosary-turn
codex plugin list
```

In an interactive Codex terminal, run `/hooks` and individually review and trust Rosary Turn's `UserPromptSubmit`, `PermissionRequest`, `PostToolUse`, and `Stop` commands. Installing the plugin does not trust its hooks. Restart the Codex desktop app, then begin a new chat turn. Do not bypass hook trust.

The hooks print nothing and exit successfully even if the companion fails. They follow actual agent events, rather than a timer. See `hooks/hooks.json` to review the exact commands.

## Daily mysteries and saved progress

At the first turn of a new local day, the reader selects OpenRosary's suggested mystery. Later turns that day resume the exact prayer, even after restarting. A day changing while you are praying never resets that active Rosary. You can select another mystery from the reader; this overrides that day's choice and the following day's first turn resumes daily selection.

| Day | Suggested mystery |
| --- | --- |
| Monday, Saturday | Joyful |
| Tuesday, Friday | Sorrowful |
| Wednesday | Glorious |
| Thursday | Luminous |
| Sunday | Glorious, with OpenRosary's seasonal rules below |

To preserve OpenRosary's current behavior, Sundays in December/January use Joyful and Sundays in February/March use Sorrowful. This is its existing **month-based approximation**, not a computed liturgical calendar. The browser supplies its local timezone to the server. Prayer labels and readings support English and Indonesian; Latin changes prayer text while retaining the selected reading language. English has 80 steps; Indonesian has 81, preserving OpenRosary's additional opening Kemuliaan.

Navigate with Left/Right, swipe left/right, or previous/next buttons (kembali/lanjut in Indonesian). Up/Down scroll the prayer pane. Language, Latin prayers, and theme are under the options dropdown. These keyboard shortcuts still work while its controls have focus; Escape closes the dropdown. Vertical swipes scroll long Scripture readings. Colour mode and prayer preferences are remembered. Saving failures remain visible with a retry action.

## Commands

```sh
node bin/rosary-turn today
node bin/rosary-turn start luminous
node bin/rosary-turn where
node bin/rosary-turn log
node bin/rosary-turn on
node bin/rosary-turn off
node bin/rosary-turn surface window
node bin/rosary-turn surface notch
node bin/rosary-turn surface auto
```

On macOS, the default surface is the inherited native curtain when macOS 12+ and Swift are available. Windows `surface notch` uses the inherited experimental Edge/PowerShell helper. Regular windows on Windows/Linux show session status but do not automatically focus the agent; app switching remains macOS-only. Native macOS operation requires testing on a Mac before a public release.

State lives in `~/.rosary-turn`: `state.json`, `agent.json`, `config.json`, and `sessions.jsonl`. `ROSARY_TURN_HOME` and `ROSARY_TURN_PORT` override the directory and port. This cannot overwrite Quran Turn's state. `ROSARY_TURN_NO_WINDOW=1` suppresses native/browser launches for testing; `ROSARY_TURN_NO_SERVER=1` uses file-only hook fallback.

## Development and credits

`app/openrosary.css` and `vendor/openrosary/*.ts` preserve the supplied OpenRosary snapshot. `app/prayers.js` and `app/rosary-sequence.js` are generated JavaScript. With the sibling `../openrosary-web` development checkout installed, `node scripts/import-openrosary.mjs` regenerates them; normal users need neither TypeScript nor that checkout. Update snapshot provenance and checksums deliberately when importing a new version.

`upstream/` preserves original Quran Turn assets for reference and is excluded from `npm pack`. Its historical site/donation services are not part of Rosary Turn and are never served. There is no production deployment or donation integration in this adaptation.

Original session engine: **Rizaldy**. Rosary adaptation and OpenRosary: **pinterbanget**. Geist: **Vercel**, SIL OFL. Scripture retains its original source labels and third-party rights. [MIT license](LICENSE) applies to the original code; see [NOTICE.md](NOTICE.md) for the bundled content.
