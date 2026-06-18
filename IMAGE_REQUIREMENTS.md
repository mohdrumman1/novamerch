# NovaMerch: Image Generation Requirements
**Temporary reference file. Delete once images are generated and placed.**

All images should match the site's aesthetic: **dark, cinematic, premium, studio-quality**.
Backgrounds should be dark (#060C18 or similar deep navy/charcoal), soft ambient lighting, no harsh shadows.
Where products are shown, use a **generic/neutral placeholder brand** (e.g. a simple geometric logo mark or a wordmark that says "YOUR BRAND") so mockups don't look tied to anyone specific.

---

## PRIORITY 1: Catalogue Product Cards (Highest Visual Impact)

These replace the CSS shape placeholders in the `CatalogueSection` component on the homepage.
**File location:** `public/catalogue/`
**Component:** `src/components/CatalogueSection.tsx` → `ProductMockup` function
**Card dimensions:** images display at ~280px wide, ~120px tall container (landscape crop or centred on dark bg)
**Recommended output size:** 600×400px PNG with transparent or #0A1020 background

---

### CAT-01: Matte Drink Bottle
**File:** `public/catalogue/bottle-mockup.png`
**Used in:** Catalogue card "Matte Drink Bottle" (category: Drinkware)
**Description:** A single matte-finish insulated drink bottle, centred on a dark background. Subtle "YOUR BRAND" wordmark printed on the bottle in white or cyan. Soft ambient cyan glow behind it. No hands, just the product.

---

### CAT-02: Custom Cap
**File:** `public/catalogue/cap-mockup.png`
**Used in:** Catalogue card "Custom Cap" (category: Apparel)
**Description:** A structured snapback or dad-cap, facing 3/4 angle. Clean embroidered logo on front panel (geometric mark, "YOUR BRAND"). Dark background, violet ambient glow. Premium finish.

---

### CAT-03: Branded Pen
**File:** `public/catalogue/pen-mockup.png`
**Used in:** Catalogue card "Branded Pen" (category: Office)
**Description:** Two or three branded pens arranged diagonally, dark barrel with subtle "YOUR BRAND" print in white. Dark background. Minimalist, clean. Slight cyan glow.

---

### CAT-04: Tote Bag
**File:** `public/catalogue/tote-mockup.png`
**Used in:** Catalogue card "Tote Bag" (category: Bags)
**Description:** A natural cotton tote bag standing upright, front-facing. Large screen print area showing a bold "YOUR BRAND" logo. Dark studio background, violet-tinted ambient light. Flat bottom so bag stands on its own.

---

### CAT-05: Corporate Gift Box
**File:** `public/catalogue/giftbox-mockup.png`
**Used in:** Catalogue card "Corporate Gift Box" (category: Gift Packs)
**Description:** A premium open gift box with a ribbon/bow, contents slightly visible (pen, bottle, notepad silhouetted inside). Matte black or navy box. "YOUR BRAND" embossed or printed on the lid. Dark background, warm cyan/gold accent light. Feels luxurious.

---

### CAT-06: Sports Club Bottle Pack
**File:** `public/catalogue/sports-bottle-mockup.png`
**Used in:** Catalogue card "Sports Club Bottle Pack" (category: Sports Clubs)
**Description:** A cluster of 3–4 matching branded drink bottles standing together, slight variation in angle. Consistent club-style branding on each (e.g. "CITY FC" or "YOUR CLUB"). Dark background, violet ambient glow. Suggests a team order.

---

### CAT-07: Staff Welcome Pack
**File:** `public/catalogue/staff-pack-mockup.png`
**Used in:** Catalogue card "Staff Welcome Pack" (category: Gift Packs)
**Description:** A flat-lay of a staff welcome bundle: branded tote bag, drink bottle, pen, and a small notepad/card arranged neatly on a dark surface. All items share the same "YOUR BRAND" branding. Top-down or slight angle. Feels like an onboarding kit.

---

### CAT-08: Event Giveaway Pack
**File:** `public/catalogue/event-pack-mockup.png`
**Used in:** Catalogue card "Event Giveaway Pack" (category: Events)
**Description:** A flat-lay or slight-angle arrangement of event giveaway items: tote bag, pen, small drink bottle, folded flyer/card. All branded consistently. Dark surface, subtle cyan glow. Feels like it's ready to be handed out at an expo or open home.

---

## PRIORITY 2: Sports Clubs Page Hero Background

**File:** `public/sports-clubs-hero-bg.png`
**Used in:** `src/app/sports-clubs/page.tsx` → `SportsHero` section
**Current state:** Pure CSS gradient (#060C18 → #0A1525). This needs a background image for visual drama.
**Description:** A wide, cinematic, blurred background image. Feeling of a sports field at dusk or dawn, grass or track surface photographed low-angle with bokeh. Dark, atmospheric, desaturated slightly so the overlaid text reads clearly. Possibly with a subtle hint of crowd/stadium in the background. NO people visible clearly (avoid rights issues), just environment/atmosphere. Teal/blue color grade.
**Recommended size:** 1920×1080px JPG, compressed to ~200KB
**Implementation note:** Used as `background-image` on the hero section with `background-size: cover`, overlaid with the existing dark gradient so the text remains fully legible.

---

## PRIORITY 3: Products Section Showcase (Homepage)

**File:** `public/products-showcase.png`
**Used in:** `src/components/Products.tsx` → desktop header area (replaces or supplements `bottle2.png`)
**Current state:** `bottle2.png` shown in a rotated card frame. This works but a richer image would help.
**Description:** A styled product arrangement: 2 or 3 branded products grouped together (bottle + cap + tote, or bottle + pen + gift box). Premium studio photography feel. Dark background. Slight rotation and depth to suggest the 3D product card frame it's placed inside (200×260px display container, `transform: rotate(-2deg)`).
**Recommended size:** 400×520px PNG (transparent bg or #0E1B2E dark blue bg to match the card)

---

## PRIORITY 4: Bundle Cards Visual Accents (Homepage)

These are small accent images for the `CatalogueBundles` section.
**File location:** `public/`
**Component:** `src/components/CatalogueBundles.tsx`
**Current state:** Text + item pills only, no visuals.
**Display size:** ~100×80px corner/accent image or small icon cluster per card
**Recommended output:** 400×300px PNG, dark/transparent background

---

### BUN-01: Staff Starter Pack
**File:** `public/staff-starter.png`
**Description:** Compact flat-lay: bottle, cap, pen, tote bag. 4 items neatly arranged together. Consistent neutral branding. Small, clean, no clutter.

---

### BUN-02: Sports Club Pack
**File:** `public/sports-club.png`
**Description:** A cap, drink bottle, and folded hoodie arranged in a triangle. Sports club feel. Slight violet accent glow.

---

### BUN-03: Client Gift Pack
**File:** `public/client-gift.png`
**Description:** Gift box open with pen, bottle, and notepad inside. Warm, premium, professional feel.

---

### BUN-04: Event Giveaway Pack
**File:** `public/event-giveaway.png`
**Description:** Tote bag front-facing with a pen and small bottle leaning against it. Cyan accent glow.

---

### BUN-05: Construction Team Pack
**File:** `public/construction-team.png`
**Description:** Cap, drink bottle, and a cooler bag/kit bag arranged together. Earthy/industrial feel but still dark background. Suggests site-use durability.

---

## PRIORITY 5: ShortlistCTA Social Proof Image

**File:** `public/mockup-pack-preview.png`
**Used in:** `src/components/ShortlistCTA.tsx` (currently text-only, this would be added to the right side)
**Description:** A "sample mockup pack" preview, resembling a simple PDF or slide showing 3 branded product ideas. Think: a dark-background document with 3 product images in a row, each with a "YOUR BRAND" logo applied, and a rough price range underneath. Like a screenshot of what a client receives. This reinforces the CTA copy "We'll create 3 quick merch mockups with rough pricing."
**Recommended size:** 600×400px PNG or 2:3 portrait ratio
**Implementation note:** Would be added to ShortlistCTA as a side-by-side visual, or as a floating angled card with slight shadow.

---

## PRIORITY 6: Industry Cards Lifestyle Images

These are **optional** background or accent images for the 4 industry cards in `src/components/Industries.tsx`.
**File location:** `public/`
**Current state:** SVG icon + text only in glassmorphism cards.
**Display size:** images would sit as subtle card backgrounds (~280×180px, very low opacity, around 10–15%, behind the card text, like a watermark)
**Recommended output:** 560×360px JPG, dark-toned lifestyle photo

---

### IND-01: Sports Clubs
**File:** `public/sports-clubs.png`
**Description:** Wide, blurred, atmospheric view of an outdoor sports field or oval at dusk. Grass, goalposts or boundary lines visible. No people. Deep blue/teal tone.

---

### IND-02: Construction & Trades
**File:** `public/construction.png`
**Description:** Blurred, atmospheric shot of a construction or building site: scaffolding, materials, structural elements. Dark tones, slight warm industrial light.

---

### IND-03: Real Estate
**File:** `public/real-estate.jpg`
**Description:** Blurred exterior of a modern residential home or streetfront at blue hour. Neutral tones, dark sky, architectural.

---

### IND-04: Clinics, Schools & Local Businesses
**File:** `public/clinic-business.jpg`
**Description:** Abstract/blurred interior: a clean, professional-looking space (reception desk, counter, modern interior). Minimal, cool-toned.

---

## PRIORITY 7: Sports Clubs Page - Product Mockups

Same spec as Priority 1 but sports-focused. Used in `src/app/sports-clubs/page.tsx` → `ClubProducts` section.
**File location:** `public/sports/`
**Recommended output:** 600×400px PNG, dark background

---

### SPT-01: Sports Club Bottle Pack (sports page)
**File:** `public/sports-bottle-mockup.png`
**Description:** Same concept as CAT-06 but can feel more dynamic: bottles in a row or cluster, "YOUR CLUB" branding. Violet glow.

---

### SPT-02: Custom Cap (sports page)
**File:** `public/cap-mockup.png`
**Description:** A team-branded cap, front-facing or 3/4 view. More sporty style than the general catalogue version. "YOUR CLUB" embroidered.

---

### SPT-03: Tote/Drawstring Bag (sports page)
**File:** `public/sports/sports-bag.png`
**Description:** A drawstring gym bag or training bag, standing upright. Club logo printed prominently. Dark background.

---

### SPT-04: Event Pack (sports page)
**File:** `public/sports/event-pack-sports.png`
**Description:** Event items arranged for a sports context: water bottle, pen, printed schedule or card. "GAME DAY" or club event theme subtly applied.

---

### SPT-05: Club Hoodie
**File:** `public/sports/hoodie-mockup.png`
**Description:** A dark-coloured hoodie lying flat or on a ghost mannequin. Club logo embroidered on chest or large screen print on back. Dark studio background, slight violet glow.

---

### SPT-06: Supporter Merchandise
**File:** `public/sports/supporter-merch.png`
**Description:** A small arrangement of supporter items: a scarf, pin badges, sticker sheet. Club colours. Flat-lay, top-down or slight angle. Feels like a fan-pack.

---

## PRIORITY 8: Club Packs Visual Cards (Sports Page)

**File location:** `public/sports/packs/`
**Component:** `src/app/sports-clubs/page.tsx` → `ClubPacks` section
**Current state:** Left-bordered horizontal cards with text + item pills only.
**Recommended output:** 400×300px PNG

---

### SPK-01: Training Day Pack
**File:** `public/training-day.png`
**Description:** Drink bottle, cap, and drawstring bag arranged as a trio. Looks like match-day gear. Club branding.

---

### SPK-02: Club Fundraising Bundle
**File:** `public/fundraising.png`
**Description:** A stack of caps next to a cluster of bottles. Bulk quantity feel. Suggests a fundraising run.

---

1

---

## Summary Table

| ID | File | Section | Page | Priority |
|----|------|---------|------|----------|
| CAT-01 | `public/catalogue/bottle-mockup.png` | Catalogue - Matte Drink Bottle card | Homepage | 1 |
| CAT-02 | `public/catalogue/cap-mockup.png` | Catalogue - Custom Cap card | Homepage | 1 |
| CAT-03 | `public/catalogue/pen-mockup.png` | Catalogue - Branded Pen card | Homepage | 1 |
| CAT-04 | `public/catalogue/tote-mockup.png` | Catalogue - Tote Bag card | Homepage | 1 |
| CAT-05 | `public/catalogue/giftbox-mockup.png` | Catalogue - Corporate Gift Box card | Homepage | 1 |
| CAT-06 | `public/catalogue/sports-bottle-mockup.png` | Catalogue - Sports Club Bottle Pack card | Homepage | 1 |
| CAT-07 | `public/catalogue/staff-pack-mockup.png` | Catalogue - Staff Welcome Pack card | Homepage | 1 |
| CAT-08 | `public/catalogue/event-pack-mockup.png` | Catalogue - Event Giveaway Pack card | Homepage | 1 |
| HERO-SC | `public/sports-clubs-hero-bg.jpg` | Sports hero section background | Sports Clubs | 2 |
| PROD-01 | `public/products-showcase.png` | Products section - desktop card frame | Homepage | 3 |
| BUN-01 | `public/bundles/staff-starter.png` | Bundles - Staff Starter card | Homepage | 4 |
| BUN-02 | `public/bundles/sports-club.png` | Bundles - Sports Club Pack card | Homepage | 4 |
| BUN-03 | `public/bundles/client-gift.png` | Bundles - Client Gift Pack card | Homepage | 4 |
| BUN-04 | `public/bundles/event-giveaway.png` | Bundles - Event Giveaway Pack card | Homepage | 4 |
| BUN-05 | `public/bundles/construction-team.png` | Bundles - Construction Team Pack card | Homepage | 4 |
| CTA-01 | `public/mockup-pack-preview.png` | ShortlistCTA - side visual | Homepage | 5 |
| IND-01 | `public/industries/sports-clubs.jpg` | Industries - Sports Clubs card bg | Homepage | 6 |
| IND-02 | `public/industries/construction.jpg` | Industries - Construction card bg | Homepage | 6 |
| IND-03 | `public/industries/real-estate.jpg` | Industries - Real Estate card bg | Homepage | 6 |
| IND-04 | `public/industries/clinic-business.jpg` | Industries - Clinics/Schools card bg | Homepage | 6 |
| SPT-01 | `public/sports/bottle-pack.png` | Club Products - Bottle Pack card | Sports Clubs | 7 |
| SPT-02 | `public/sports/cap-sports.png` | Club Products - Cap card | Sports Clubs | 7 |
| SPT-03 | `public/sports/sports-bag.png` | Club Products - Bag card | Sports Clubs | 7 |
| SPT-04 | `public/sports/event-pack-sports.png` | Club Products - Event Pack card | Sports Clubs | 7 |
| SPT-05 | `public/sports/hoodie-mockup.png` | Club Products - Club Hoodie card | Sports Clubs | 7 |
| SPT-06 | `public/sports/supporter-merch.png` | Club Products - Supporter Merch card | Sports Clubs | 7 |
| SPK-01 | `public/sports/packs/training-day.png` | Club Packs - Training Day card | Sports Clubs | 8 |
| SPK-02 | `public/sports/packs/fundraising.png` | Club Packs - Fundraising card | Sports Clubs | 8 |
| SPK-03 | `public/sports/packs/sponsor-kit.png` | Club Packs - Sponsor Kit card | Sports Clubs | 8 |

**Total: 28 images**

---

## Notes for Generation

- **Style:** Dark studio. Ambient lighting. No white backgrounds. Products centred with breathing room.
- **Brand on products:** Use a neutral placeholder - a simple circle+wordmark or "YOUR BRAND" text - never a real brand.
- **No people** in any image unless essential (avoid model rights issues).
- **File format:** PNG for product mockups (support transparency), JPG for backgrounds/lifestyle.
- **Naming:** Use exact filenames from this list so code integration is straightforward.
- Once generated, drop images into the listed `public/` subdirectories and the CSS mockups in `CatalogueSection.tsx` and `sports-clubs/page.tsx` will be swapped out for `<Image>` components.
