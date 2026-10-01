# Credits and provenance

Rosary Turn is a fork of [Quran Turn](https://github.com/rzrizaldy/quran-turn), originally created by **Rizaldy**. The hook lifecycle, local server, session persistence design, and native macOS/Windows curtain hosts originate in his work. His MIT copyright notice remains in LICENSE. The original reader, site, data, tests, and documentation are preserved in `upstream/` for reference and are excluded from the Rosary package.

The Rosary interface, prayer texts, Scripture readings, prayer sequence, language behavior, and daily suggestions come from [OpenRosary Web](https://github.com/pinterbanget/openrosary-web), maintained by pinterbanget, with its [Android app](https://github.com/pinterbanget/openrosary) as a reference. Source snapshot: `bdb9e2631f64a94de6b3aa70f0e42b76b6322c26`. Original TypeScript is preserved in `vendor/openrosary/`; the generated runtime modules are `app/prayers.js` and `app/rosary-sequence.js`. `app/openrosary.css` is copied verbatim. These local repositories were supplied by their owner for this adaptation; no separate upstream license was present in that snapshot.

The English Scripture readings retain their source ESV labels; Indonesian readings retain their source labels. No Scripture text has been generated or rewritten. Third-party Scripture rights remain with their respective owners; the project MIT license does not relicense those passages.

Geist is by Vercel, licensed under SIL Open Font License 1.1. Its Latin font is copied from the existing OpenRosary build and served locally. See `app/fonts/OFL-Geist.txt`.

Suggested launch attribution:

> Rosary Turn is based on Quran Turn, originally built by Rizaldy. We adapted his coding-session prayer companion for the Rosary, using OpenRosary's interface and prayers.
