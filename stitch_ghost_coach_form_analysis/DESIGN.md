---
name: Ghost Coach
colors:
  surface: '#fff9e9'
  surface-dim: '#e1dabd'
  surface-bright: '#fff9e9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf4d6'
  surface-container: '#f6eed0'
  surface-container-high: '#f0e8cb'
  surface-container-highest: '#eae3c5'
  on-surface: '#1f1c0a'
  on-surface-variant: '#424842'
  inverse-surface: '#34311d'
  inverse-on-surface: '#f8f1d3'
  outline: '#727971'
  outline-variant: '#c2c8bf'
  surface-tint: '#45664a'
  primary: '#27472e'
  on-primary: '#ffffff'
  primary-container: '#3e5f44'
  on-primary-container: '#b2d7b5'
  inverse-primary: '#abd0ae'
  secondary: '#605f53'
  on-secondary: '#ffffff'
  secondary-container: '#e6e3d4'
  on-secondary-container: '#666559'
  tertiary: '#174a26'
  on-tertiary: '#ffffff'
  tertiary-container: '#30623c'
  on-tertiary-container: '#a5dbab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6ecc9'
  primary-fixed-dim: '#abd0ae'
  on-primary-fixed: '#01210c'
  on-primary-fixed-variant: '#2d4e34'
  secondary-fixed: '#e6e3d4'
  secondary-fixed-dim: '#cac7b8'
  on-secondary-fixed: '#1d1c13'
  on-secondary-fixed-variant: '#48473c'
  tertiary-fixed: '#b8f0bf'
  tertiary-fixed-dim: '#9dd3a4'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#1e502c'
  background: '#fff9e9'
  on-background: '#1f1c0a'
  surface-variant: '#eae3c5'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

The design system is built on a "Premium Tactical" narrative—combining the organic warmth of high-end outdoor gear with the clinical precision of athletic performance technology. It targets athletes who value both aesthetic refinement and technical accuracy.

The style is **Organic Minimalism**. It moves away from the cold, neon-heavy "cyberpunk" look of traditional fitness tech, opting instead for a matte, tactile interface. Key visual drivers include:
- **Matte Textures:** Low-specular surfaces that feel like recycled polymers or brushed fabric.
- **Organic Tech:** A blend of soft, desert-inspired tones with sharp, data-driven overlays.
- **Focused Clarity:** High use of whitespace and "Glassmorphism" to create a sense of focused layers without visual clutter.

## Colors

The palette is grounded in "Sand Dune" and "Hunter Green," providing a sophisticated, low-fatigue environment for performance analysis.

- **Surface Strategy:** The primary background uses `Sand Dune`. Secondary containers and cards use `Cream/Light Sand` with subtle transparency to create depth.
- **Accents:** `Hunter Green` serves as the primary brand touchpoint for CTA buttons and critical containers.
- **Semantic Feedback:** Statuses are handled with high-impact `Crimson Red` for form errors and `Soft Olive Emerald` for successful movement execution.
- **Glassmorphism:** Overlays on top of video feeds use the `Cream` hex at 60% opacity with a `12px` backdrop blur.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly yet precise geometric qualities. 

- **Hierarchy:** Headings use the `Deep Hunter Green` color with tighter letter spacing to appear authoritative and "tight."
- **Readability:** Body text uses `Muted Forest Green` to reduce contrast harshness against the sand-toned backgrounds, facilitating longer reading sessions during form reviews.
- **Data Display:** For metrics (degrees of rotation, speed, reps), use the `data-mono` style to ensure numerical alignment and high legibility.

## Layout & Spacing

The layout philosophy follows a **Fluid Tactical Grid**. Content is organized into functional modules that can be rearranged depending on the athletic activity being tracked.

- **Grid:** A 12-column grid on desktop, 4-column on mobile.
- **Rhythm:** An 8px base unit is used for component spacing, while 4px increments are used for fine-tuning internal element alignment.
- **Margins:** High-density data views use `16px` margins to maximize screen real estate, while educational/onboarding screens use `40px` margins to enforce focus.
- **Mobile Adaptivity:** On mobile, side-by-side video comparisons stack vertically, and floating action buttons (FABs) are used for primary capture controls.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Subtle Glassmorphism** rather than traditional heavy shadows.

- **The Base:** The `Sand Dune` background is the lowest level.
- **The Surface:** Cards and panels use the `Cream` color. Instead of a shadow, use a `1px` inside border of `Hunter Green` at 5% opacity.
- **The Overlay:** For UI elements that sit over live video (form correction lines, angle markers), use a backdrop-filter blur of `12px` and a `60%` opacity `Cream` fill. 
- **Shadows:** If shadows are necessary for floating components, use a very soft, diffused Hunter Green tint: `box-shadow: 0 10px 30px -5px rgba(62, 95, 68, 0.12)`.

## Shapes

The shape language is characterized by "Organic Radii." 

- **Primary Components:** Buttons, input fields, and small cards use a `16px` (rounded-lg) radius.
- **Main Containers:** Large workout summary cards or video player containers use a `24px` (rounded-xl) radius.
- **Interaction Feedback:** Clickable icons utilize a circular (pill) shape to distinguish them from structural data elements.

## Components

- **Buttons:**
    - *Primary:* Solid `Hunter Green` with `Cream` text. Rounded-lg (16px).
    - *Secondary:* Ghost style with `Hunter Green` border (1px) and `Deep Hunter Green` text.
- **Form Correction Chips:** Small, pill-shaped indicators. "Correct" uses `Soft Olive Emerald` background with white text. "Correction Needed" uses `Crimson Red`.
- **Instructional Cards:** Use the `Cream` background with a subtle grain texture/noise (2% opacity) to enhance the matte tactile feel.
- **Input Fields:** Bottom-border only or fully enclosed with a 1px `Muted Forest Green` stroke. Use `Plus Jakarta Sans` for placeholder text at 14px.
- **Data Overlays:** Skeletal tracking lines should be rendered in `Hunter Green` for stability and `Crimson Red` to highlight joints out of alignment.
- **Progress Indicators:** Use thick, 8px rounded tracks in `Cream` with a `Hunter Green` fill.