# Design QA — Omarchy 中文手册

## Comparison target

- Source URL: `https://omarchy.org/manual/`
- Implementation URL: `http://127.0.0.1:4173/manual/`
- Source visual truth:
  - `evidence/source/manual-home-desktop-top.png`
  - `evidence/source/manual-home-mobile-top.png`
  - `evidence/source/manual-navigation-desktop-mid.png`
  - `evidence/source/manual-navigation-mobile-mid.png`
  - `evidence/source/manual-search-desktop.png`
- Implementation screenshots:
  - `evidence/implementation/manual-home-desktop-top.png`
  - `evidence/implementation/manual-home-mobile-top.png`
  - `evidence/implementation/manual-navigation-desktop-mid.png`
  - `evidence/implementation/manual-navigation-mobile-mid.png`
  - `evidence/implementation/manual-search-desktop.png`
- Side-by-side evidence, source left and implementation right:
  - `evidence/comparisons/home-desktop-source-left-implementation-right.png`
  - `evidence/comparisons/home-mobile-source-left-implementation-right.png`
  - `evidence/comparisons/navigation-desktop-source-left-implementation-right.png`
  - `evidence/comparisons/navigation-mobile-source-left-implementation-right.png`
  - `evidence/comparisons/search-desktop-source-left-implementation-right.png`

## Viewports and normalization

| State | CSS viewport | Source pixels | Implementation pixels | Device scale factor |
| --- | --- | --- | --- | --- |
| Home desktop | 1440 × 900 | 1440 × 900 | 1440 × 900 | 1 |
| Search desktop | 1440 × 900 | 1440 × 900 | 1440 × 900 | 1 |
| Navigation desktop | 1440 × 900 | 1440 × 900 | 1440 × 900 | 1 |
| Home mobile | 390 × 844 | 390 × 844 | 390 × 844 | 1 |
| Navigation mobile | 390 × 844 | 390 × 844 | 390 × 844 | 1 |

No density resampling was needed. Comparisons use the same viewport and pixel dimensions. Navigation mid-page captures use a 700 px scroll step; translated prose has different line length, so semantic content position rather than identical document Y position is used for image and code-region judgment.

## Required fidelity surfaces

### Fonts and typography

The implementation loads the same ten local JetBrains Mono WOFF2 files and uses the same font weights, sizes, header scale and link treatment. Chinese glyphs correctly fall back to the platform monospace font because JetBrains Mono does not contain CJK glyphs. This produces expected glyph-shape differences without changing hierarchy or text density beyond what Chinese translation requires.

### Spacing and layout rhythm

Desktop masthead, header, sidebar width, content width, sticky navigation, search position, pagination grid and 64em responsive breakpoint match the source CSS. Mobile uses the same single-column structure and hidden chapter sidebar. Browser measurements report `scrollWidth === innerWidth` at both 1440 px and 390 px.

### Colors and visual tokens

The source Tokyo Night token values were copied locally: night background, storm panels, green chapter numbers and logo, blue body copy, cyan links, turquoise code accents and white headings. Search borders, active state and result panel use the source tokens.

### Image quality and asset fidelity

All 44 manual WebP images and 38 theme PNG images are copied from the pinned official source. Browser checks report six of six navigation images and 38 of 38 theme images loaded with non-zero natural width. Images use the source crop, aspect ratio, radius and responsive width; no image was regenerated or hotlinked.

### Copy and content

All 51 chapter titles, sidebar labels, search UI, pagination and explanatory prose are localized. Product names, technical terms, commands, paths, shortcuts and all 39 code blocks remain intact. The generated site keeps official English anchor aliases so existing deep links continue to work after Chinese headings are introduced.

## Interaction and browser checks

- Desktop sidebar exposes 51 chapter links and the current-page state.
- Directory page exposes 51 links in two desktop columns and one mobile column.
- `/` focuses search; the query `剪贴板` produced nine relevant results.
- Arrow Down and Enter opened `/manual/unified-clipboard-history/` successfully.
- Search Escape behavior is implemented and covered by the same input state machine.
- Previous, complete directory and next links resolve to generated routes.
- Navigation page contains six loaded images and one code block.
- Themes page contains 38 loaded local images.
- Desktop and mobile browser error collections were empty.
- Mobile sidebar is hidden and all tested pages have no horizontal document overflow.

## Comparison history

### Iteration 1 — structural parity

- Finding: the initial manual-directory count covered 44 WebP files but the Themes chapter referenced another 38 PNG files outside `manual/images`.
- Fix: added every referenced theme preview and unlock image to the local snapshot and build output.
- Post-fix evidence: Themes browser check reports 38 images, all complete with non-zero natural width.

- Finding: translated headings changed four existing English deep-link fragments.
- Fix: generated hidden official-anchor aliases alongside localized heading IDs.
- Post-fix evidence: generated-link validation reports no missing anchors across all 52 pages.

### Iteration 2 — content fidelity

- Finding: reference translations changed one Lua code comma, several image targets and two link-target sequences; several Mac hardware descriptions remained English.
- Fix: restored exact code, image and link targets and translated the remaining descriptive hardware text while retaining model names.
- Post-fix evidence: code, image and link parity tests pass; English-leak validation reports no issues.

### Iteration 3 — visual and responsive comparison

- Finding: no actionable P0, P1 or P2 visual mismatch remained. Chinese glyph metrics and shorter translated paragraphs change wrapping and total page height as expected.
- Fix: no additional visual change required.
- Post-fix evidence: five normalized side-by-side comparisons plus desktop/mobile browser measurements listed above.

## Findings

No actionable P0, P1 or P2 findings remain.

## Follow-up polish

- P3: Chinese system-monospace glyph rendering varies slightly by operating system because JetBrains Mono has no CJK glyph set. The current fallback is deliberate and keeps the terminal aesthetic without introducing an unverified third-party font.
- P3: the non-official translation notice adds a small footer line not present in the English source; it is intentional provenance and licensing context.

## Final result

final result: passed

