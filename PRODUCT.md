# Product

## Register

product

## Users

Visitors of huguryildiz.com — academic peers, program committees, funding reviewers, and
prospective graduate students. They land on the site to assess the owner's research program
(operations research + underwater / wireless networks). The hero visualization is viewed
passively at first, then explored interactively by the curious.

## Product Purpose

The site is the scientific record of Hüseyin Uğur Yıldız. The UWSN hero
(`_includes/hero-uwsn.html`) is an interactive **ocean digital twin**: a simulated but
operationally honest underwater sensor-network monitoring screen showing security threats,
habitat observations, and seismic events on one shared infrastructure. Success = a viewer
believes a real ocean-observatory operator could work with this screen.

## Brand Personality

Sober, scientific, operational. The visualization must read as a professional operations
console, not a demo. Confidence through restraint and data honesty.

## Anti-references

- Cartoon / arcade / neon / sci-fi aesthetics.
- Video-game HUDs with decorative glitch or scanline effects.
- Dashboards that fake precision (exact positions for uncertain contacts, unlabeled
  simulated data, symbols presented as physical scale).

## Design Principles

1. **Operational meaning first** — correctness of what an event, route, or status means
   outranks visual spectacle.
2. **Readability over realism** — realism never makes sensors, routes, or events illegible.
3. **Semantics-locked color** — cyan network, red confirmed security, amber uncertainty/eco
   threshold, green-teal habitat, orange-violet seismic, gray offline. No exceptions.
4. **Physical vs. digital separation** — the physical world (terrain, vehicles, life) is
   rendered naturally; analysis (radii, routes, waves, labels) is a translucent overlay.
5. **Data honesty** — simulated data is labeled, uncertain positions get uncertainty areas,
   enlarged symbols are declared not-to-scale.

## Accessibility & Inclusion

Keyboard operability for all controls, visible focus, ARIA labels + live announcements,
`prefers-reduced-motion` compliance, color never the only carrier (line style / icons /
labels), contrast checked on the dark scene background. No flashing above 3 Hz.
