---
name: Hüseyin Uğur Yıldız — Academic Website
description: An academic record with a scientific-instrument character and a native ocean scroll sequence.
colors:
  accent: "#A0451C"
  accent-strong: "#7F3512"
  bg: "#FAF8F4"
  surface: "#F2EFE8"
  surface-raise: "#FFFFFF"
  ink: "#232B33"
  ink-soft: "#49535D"
  ink-faint: "#616B76"
  head: "#12314E"
  hairline: "#DCD7CC"
  hairline-strong: "#C2BCB0"
  btn-ink: "#F6F2EA"
  dark-accent: "#E09A6A"
  dark-accent-strong: "#EBB289"
  dark-bg: "#0E1621"
  dark-surface: "#15202E"
  dark-surface-raise: "#1A2634"
  dark-ink: "#E6E2D9"
  dark-ink-soft: "#B9B4AA"
  dark-ink-faint: "#93989E"
  dark-head: "#E9ECF2"
  dark-hairline: "#27333F"
  dark-hairline-strong: "#3A4754"
  dark-btn-ink: "#101821"
  obs-plate: "#061524"
  obs-ink: "#EEF3F5"
  obs-ink-soft: "#C0D0D8"
  obs-ink-faint: "#93AAB5"
  obs-line: "rgba(196,220,232,.30)"
  obs-panel: "rgba(5,17,27,.88)"
  obs-button-ink: "#0B1E2C"
typography:
  display:
    fontFamily: "'STIX Two Text', 'Times New Roman', serif"
    fontSize: "clamp(2.1rem,3.6vw,3.3rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-.016em"
  headline:
    fontFamily: "'STIX Two Text', 'Times New Roman', serif"
    fontSize: "clamp(1.7rem,3.4vw,2.25rem)"
    fontWeight: 600
    lineHeight: 1.22
  body:
    fontFamily: "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.68
  navigation:
    fontFamily: "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif"
    fontSize: ".92rem"
    fontWeight: 500
  button:
    fontFamily: "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif"
    fontSize: ".92rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  control: "6px"
  navigation: "4px"
  observatory-panel: "8px"
  select: "6px"
  tag: "3px"
  pill: "999px"
  portrait: "50%"
spacing:
  sp-1: ".25rem"
  sp-2: ".5rem"
  sp-3: ".75rem"
  sp-4: "1rem"
  sp-5: "1.5rem"
  sp-6: "2rem"
  sp-7: "3rem"
  sp-8: "4.5rem"
components:
  button-primary:
    backgroundColor: "{colors.head}"
    textColor: "{colors.btn-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: ".62rem 1.05rem"
  button-primary-dark:
    backgroundColor: "{colors.dark-head}"
    textColor: "{colors.dark-btn-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: ".62rem 1.05rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: ".62rem 1.05rem"
  button-observatory:
    backgroundColor: "{colors.obs-ink}"
    textColor: "{colors.obs-button-ink}"
    rounded: "{rounded.control}"
    padding: ".62rem 1.05rem"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
    width: "44px"
    height: "44px"
---


# Design System: Hüseyin Uğur Yıldız

## Overview

**Creative North Star: "The Academic Observatory"**

The incumbent interface combines an editorial academic record with a restrained scientific-instrument character. STIX Two Text headings, Source Sans 3 body text, rust accents, compact records, and a moving topographic background define the site. Light and dark themes retain the same hierarchy and component language.

The current enhancement adds a short native scroll sequence to the existing ocean opening. Identity remains directly over the continuous dark scene without an opaque identity card. Existing content order, typography, navigation, portrait ornament, metrics, publication rows, software list, and academic page layouts remain the design authority.

**Key Characteristics:**

- Compact academic records with serif headings and sans-serif metadata.
- Map-like imagery, existing subtle animation, and semantic scientific overlays.
- A continuous dark ocean opening in both page themes.

This document records the current source, not the superseded redesign studies. Source locations are `assets/css/redesign.css`, `_layouts/academic.html`, `index.md`, `_includes/hero-uwsn.html`, `assets/js/observatory-scroll.js`, and `assets/js/topographic-bg.js`. Read the complete CSS cascade, including the appended scroll enhancement. `.impeccable.md` records scope; `PRODUCT.md` governs simulation semantics.

## Colors

### Primary

Rust (`accent`) marks links and selected emphasis on light reading surfaces; its stronger companion serves hover states. Dark mode uses the lighter `dark-accent` pair. Primary reading-page buttons use heading ink. The ocean CV button is pale, with dark text; its companion links use translucent dark fills and light borders.

### Neutral

The light theme uses off-white (`bg`), recessed paper (`surface`), and white (`surface-raise`). Ink, soft ink, and faint ink distinguish body text and metadata. Blue heading ink and thin hairlines define hierarchy. The `dark-*` entries mirror these roles on ink-blue backgrounds.

The layout ships with a dark default and restores the saved `hy-theme` preference. The ocean has its own fixed `obs-*` roles in both themes. Its explanatory plaque retains a translucent dark surface; this functional plaque is distinct from the explicitly rejected opaque identity card.

**The Semantic Overlay Rule.** Editorial colors do not replace scientific assignments: cyan network, red confirmed security, amber uncertainty or ecological thresholds, green-teal habitat, orange-violet seismic, and gray offline. Pair color with labels, symbols, or line styles. Research-topic and publication-quartile colors are separate existing scales in the CSS.

## Typography

STIX Two Text and Source Sans 3 are self-hosted under `assets/fonts/`, including Latin Extended coverage. The existing monospace stack (`ui-monospace`, SF Mono, Menlo, Consolas) supports technical readouts and compact instrument labels.

Frontmatter `display` describes the homepage identity; `headline` describes ordinary page titles. Both use semibold serif text. Section headings use a compact responsive scale (`clamp(1.22rem,2.4vw,1.42rem)`) and weight (600), with a rule, icon, and optional count. Preserve the displayed Turkish characters; the homepage name wraps naturally.

Body prose remains left-aligned without automatic hyphenation. Do not impose the declared `--measure` token globally: academic paragraphs intentionally use the shared shell width. Selected publication titles remain compact serif text (1.08rem, weight 600), followed by smaller sans-serif metadata (.9rem). Do not inherit larger cinematic heading sizes into reading lists.

## Layout

The shared shell is centered with a maximum width (1280px) and fluid side padding (`clamp(20px,4.5vw,48px)`). The sticky masthead begins at a minimum height (4rem). Over the ocean it is transparent at the opening and takes a translucent dark background after scrolling; outside the scene it returns to the page palette.

The ocean extends under the masthead. On wide screens, its scene fills the stage and the identity aligns with the shared reading lane. The screen-height token is `clamp(600px,100svh,1080px)`. The optional sticky stage pins at the viewport top and adds a short scroll interval (72svh). The controller measures header height and identity geometry, enabling the sequence only at the wide breakpoint (64em), after Canvas readiness, without reduced motion, and when identity plus its fit allowance fits the viewport. Enlarged root text also disables pinning when the available width is below 64 root ems, with separate space below the identity for scene controls.

Mobile remains in normal flow, with the continuous ocean extending beneath the identity into the interactive field. The portrait and name stack below 400px; homepage action buttons can take full rows below 360px. The compact navigation container query (64rem) accommodates enlarged text alongside the existing viewport breakpoint (51.25em).

Below the scene, keep the incumbent research/profile columns, compact metrics, selected-publication rows, software list, biography, and closing section. Research/profile columns collapse below 860px. Software entries retain small icons, names, descriptions, and links; they are not large image features.

## Elevation & Depth

Rules, tonal surfaces, typography, and measured spacing organize reading pages. Existing cards and panels remain where they serve the content. The portrait retains its conic border, inner ring, orbit ornament, and small shadow. Its ornament pauses offscreen and disables animation for reduced motion.

The ocean frame has no rounded border or outer shadow. Terrain, directional shading, and translucent analysis overlays provide scene depth. Its compact explanatory plaque retains a shadow (`0 14px 34px rgba(0,0,0,.38)`) and a dark translucent fill. The shared tooltip shadow is `0 4px 12px rgba(10,16,24,.18)`; navigation and metadata badges have their existing local treatments.

The global topographic background and its animation remain intact. It is non-interactive, masked to quiet the reading lane, and uses the existing theme-dependent opacity. Its rendering loop pauses while the document is hidden and respects reduced motion. Do not remove or restyle it as part of scroll work.

## Shapes

Buttons and icon controls use softly rounded corners (`control`); navigation links use the smaller `navigation` radius. Select fields retain the existing control radius. Topic/filter pills and quartile badges retain pill silhouettes; standard tags have small corners. Portraits are circular. The ocean is one uninterrupted rectangular field, while its functional plaque keeps rounded corners (`observatory-panel`).

## Components

### Buttons and links

Primary reading-page buttons use heading ink; quiet buttons use a transparent fill and a strong hairline border. Hover changes fill, border, or ink. Ocean actions use a pale filled CV button and dark translucent publication/contact buttons; homepage buttons retain a minimum height (44px).

Prose links have persistent underlines; navigation and standalone action rows retain their existing exceptions. Keyboard focus uses a visible two-pixel outline with an offset and a warm light color over the ocean. Disabled buttons use reduced opacity and disabled interaction.

### Navigation

The serif wordmark, animated favicon, and existing navigation icons remain. Active desktop navigation uses stronger text and an accent underline; compact navigation uses the accent text state. The menu maintains `aria-expanded`; Escape closes it and restores focus. The theme toggle names its next action. Without JavaScript, compact navigation remains visible as wrapping links and unavailable toggle buttons are hidden.

### Filters and records

Publication filters use outlined pill buttons with a filled heading-ink selected state and native select fields. Preserve `aria-pressed` and text labels. Selected publications retain their title-then-metadata arrangement, thin row dividers, compact spacing, and inline classification tags. Metrics remain in their existing typographic strip. Do not redesign these components while adjusting scroll behavior.

### Observatory

Identity, CV, publications, contact, and Skip the scene are semantic HTML available before animation. A local static ocean image remains when Canvas is not ready. The existing functional plaque states that data are simulated and symbols are not to scale; Pause and Explore expose timeline, layers, legend, event log, selection, and zoom controls progressively.

Native forward and reverse scrolling control presentation only: the identity gives way to connectivity and research text, with three small progress labels. Hidden identity and narrative links become inert. Explore owns direct camera manipulation and suspends presentation camera updates; leaving Explore restores the current scroll composition. The simulation clock stays independent of scroll, respects Pause, and stops while the document is hidden or the scene is offscreen. Reduced motion removes the sticky narrative and uses on-demand rendering instead of continuous animation.

## Do's and Don'ts

- **Do** preserve the incumbent typography, palette, content order, portrait, navigation, lists, and animated topographic background.
- **Do** reuse the existing tokens, local fonts, icons, and Jekyll presentation path.
- **Do** check both themes, narrow layouts, enlarged text, reduced motion, keyboard focus, and interactive controls after scroll changes.
- **Don't** add an opaque identity card or split the opening into unrelated panels.
- **Don't** enlarge the academic record into display-sized sections or replace compact software/publication lists with image cards.
- **Don't** replace scientific overlay colors with decorative brand colors or remove simulation disclosures.
- **Don't** use scroll to advance simulated events, intercept normal page scrolling, or hide essential links behind an introduction.
- **Don't** treat this source-derived design inventory as evidence of accessibility certification, physical validation, or measured performance.
