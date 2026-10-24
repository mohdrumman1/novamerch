# Design prompt for NovaMerch content pages

Derived from the visual style of sitereel.ai (a public gallery of AI website prompts): dark editorial pages, large tight display type, an italic serif accent word, monospace micro labels, soft glow and glass cards. Adapted to NovaMerch's navy and cyan brand. No Sitereel code, copy or imagery was used.

## Prompt (reuse for new pages)
> Design a long-form content page for NovaMerch, a Newcastle-based custom merchandise supplier. Dark navy canvas (#060c18) with a soft cyan radial glow at the top and a faint violet glow at the right. Mono uppercase eyebrow label in cyan. H1 in a tight-tracked geometric sans with one italic serif accent word in cyan. Body text in a calm grey with high contrast for headings. Sections separated by hairline rules, not boxes. Lists use small cyan dots; steps use numbered cyan circles. FAQ items as subtle glass cards that brighten on hover. One pill CTA in cyan with an arrow and a soft glow on hover. Hero image labelled "Illustrative concept mockup". Generous whitespace, max width about 46rem for reading, mobile first, respects reduced motion. Every claim must be verified: no prices, minimums, timings or reviews without evidence.

## Where it is applied
`.nm-prose`, `.nm-eyebrow`, `.nm-accent`, `.nm-hero-glow`, `.nm-faq-item`, `.nm-cta` in `src/app/globals.css`, used by guides, product pages, the Newcastle page and the privacy page. Fonts: Instrument Serif (italic) and DM Mono via `next/font`, alongside the existing sans.

## SEO and AEO checks built in
Answer-first intro, one H1, visible FAQ with FAQPage schema, breadcrumbs, canonical, per-page Open Graph image with alt text, image width/height set (no layout shift), hero image eager-loaded, `npm run test:seo` guard.
