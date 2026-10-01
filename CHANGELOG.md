# Changelog

## [0.1.4] - 2026-10-02

- Deliver curtain commands immediately when the server's event counter restarts after an update.
- Make Close send an explicit hide request and report connection failures.
- Keep browser previews from controlling the native curtain or blocking its launch.
- Prevent macOS hover from immediately reopening a manually dismissed curtain.

## [0.1.3] - 2026-10-02

- Use Up/Down to scroll prayer text and Left/Right to navigate prayers.
- Fill the native viewport so spare height enlarges the prayer pane instead of leaving a gap below the footer.

## [0.1.2] - 2026-10-02

- Use a pure black dark background with neutral panels and text, retaining blue accents.

## [0.1.1] - 2026-10-02

- Group language, Latin prayers, and theme controls under an options dropdown.
- Keep prayer navigation with arrow keys available while preference controls have focus.
- Shorten navigation to previous/next in English and kembali/lanjut in Indonesian.

## [0.1.0] - 2026-10-01

- Fork Quran Turn by Rizaldy, retaining upstream authorship and MIT notice.
- Adapt its offline agent-session companion to OpenRosary's web prayer interface.
- Bundle English, Indonesian, and Latin prayers and mystery Scripture readings.
- Resume between coding turns and choose OpenRosary's suggested mystery on a new local day.
- Preserve native macOS and experimental Windows curtain hosts.
- Use a separate state directory and port, and fix Windows static-file path handling.

Original Quran Turn release history is preserved in Git history.
