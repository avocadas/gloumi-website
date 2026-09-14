# Fonts for the share card

Two files, read from disk when the OpenGraph card is generated:

| File | Face |
|---|---|
| `CormorantGaramond-SemiBold.ttf` | Cormorant Garamond 600 – the headline |
| `DMSans-Medium.ttf` | DM Sans 500 – the subtitle and footer line |

They are committed on purpose. The card used to fetch them from Google Fonts
during the build, and that made the build non-deterministic: on 2026-09-14 a
deployment failed while prerendering the English card with `Cannot read
properties of undefined (reading 'split')`, because one of the two requests
came back empty and the layout was left asking for a font that had not loaded.
The same commit had built cleanly minutes earlier. Reading from disk removes
the network from the build entirely.

This is also what the Next.js documentation shows for `ImageResponse`: read the
font file with `readFile` at module scope, do not fetch it.

Both faces are licensed under the SIL Open Font License 1.1, which permits
redistribution as part of a larger work:

- Cormorant Garamond — Catharsis Fonts, https://fonts.google.com/specimen/Cormorant+Garamond
- DM Sans — Colophon Foundry, Jonny Pinhorn, Indian Type Foundry, https://fonts.google.com/specimen/DM+Sans

The site's own text does not use these files. It loads the same families
through `next/font`, which self-hosts them at build time.
