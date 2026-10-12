# NovaMerch Studio design system

The public site uses an editorial, product-led system designed around a warm paper surface and deep green ink.

## Tokens

- **Ink:** `#102219` — primary text and dark sections.
- **Paper:** `#f4f0e8` — main surface.
- **Accent:** `#d8ff46` — primary action and intentional highlights.
- **Clay:** `#d97852` — secondary detail accent.
- **Display:** Plus Jakarta Sans through `--font-syne`.
- **Body:** Inter through `--font-dm-sans`.

## Components

- Pill CTAs with a 52px minimum height.
- Editorial headings with a controlled serif emphasis.
- Horizontal product rail with native scrolling, click-through cards, button controls and scroll snapping.
- Four-step process grid that becomes a simple stacked sequence on small screens.
- Accordion FAQ using native buttons and `aria-expanded`.

## Responsive and motion rules

- Layout becomes single-column at 800px and preserves product imagery without text overlap.
- The rail supports ordinary touch scrolling and does not capture page scroll.
- Product float motion is decorative only. The existing global `prefers-reduced-motion` rules disable reveal animations; production QA should additionally verify decorative hero animation suppression.
