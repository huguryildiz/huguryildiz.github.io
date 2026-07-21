# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## What This Is

Personal academic website for Hüseyin Uğur Yıldız (huguryildiz.com) — Associate Professor of EEE at TED University. Built with Jekyll on the AcademicPages remote theme (a fork of Minimal Mistakes), hosted on GitHub Pages. Every push to `master` triggers automatic deployment via GitHub Actions.

The site has a **custom redesign layer** (`_layouts/academic.html` + `assets/css/redesign.css`) that overrides the stock theme on the main pages. Most day-to-day content lives in hand-written HTML inside Markdown files, not in theme-driven collections.

## Local Development

```bash
bundle install
bundle exec jekyll serve        # http://localhost:4000
bundle exec jekyll build        # build only, into _site/
docker compose up               # Docker alternative (port 4000, adds _config_docker.yml)
```

There is no test suite. **Validation is visual** — run the server and check the browser. When making UI changes, verify the rendered result yourself before reporting done.

## Deploy Rules

- Commit and push directly to `master` — no feature branches, no pull requests.
- Pushing to `master` deploys automatically. Only push when the site builds cleanly.

## Architecture

### Two rendering paths

1. **Redesigned pages** — `index.md`, `_pages/cv.md`, `_pages/research.md`, etc. use `layout: academic` and are authored as raw HTML wrapped in `<div class="shell">`. Their styling comes almost entirely from `assets/css/redesign.css`. This is the primary, actively-maintained surface.
2. **Theme fallback** — stock Minimal Mistakes layouts (`single`, `default`) still exist for pages that haven't been redesigned.

### Directory map

| Path | Purpose |
|---|---|
| `_pages/` | The real pages: `cv`, `publications`, `research`, `service`, `students`, `teaching`, `search`, `terms`, `404` |
| `_layouts/` | `academic.html` (custom redesign shell), plus theme `default`/`single`/`compress` |
| `_includes/` | HTML partials; local files shadow the theme's equivalents |
| `_sass/` | Legacy SCSS overrides for the theme fallback path |
| `_data/` | Structured data: `navigation.yml`, `research_map.yml`, `research_metrics.json` |
| `assets/css/redesign.css` | **Main stylesheet** for the redesigned pages |
| `assets/fonts/` | Self-hosted STIX / sans woff2 loaded by the academic layout |
| `images/`, `files/` | Portrait, icons, CV PDF (`files/Yildiz_HuseyinUgur_CV.pdf`) |
| `scripts/` | Python/shell helpers (see below) |

There are **no** `_posts/`, `_talks/`, or `_portfolio/` collections — ignore theme docs that mention them.

### Key includes

- `_includes/hero-uwsn.html` — interactive 3D underwater-sensor-network "digital twin" hero rendered on the home page (canvas animation with a `tScale`/`EVENTS` timeline architecture).
- `_includes/research-map.html` + `_data/research_map.yml` — data-driven research overview map.
- `_includes/icons.html` — inline SVG icon set used across redesigned pages.
- `_includes/research-metrics.html` — renders citation / h-index stats from `_data/research_metrics.json`.
- `_includes/head/`, `_includes/footer/` — `<head>` and footer overrides (custom CSS injection, favicon, meta, academic profile links).

### Publications page

`_pages/publications.md` is raw HTML + JavaScript with interactive filtering (type, year, journal tier) and client-side donut charts. **Publication data is hardcoded in the Markdown file itself**, not in `_data/`. Edit the entries inline.

### Data layer

- `research_metrics.json` — auto-refreshed monthly by GitHub Actions (`scripts/fetch_metrics.py` → OpenAlex API); its commit is tagged `[skip ci]`.
- `research_map.yml` — content for the research map include.
- `navigation.yml` — top-nav links.

### CV

`_pages/cv.md` (hand-written HTML, `layout: academic`) is the source of truth. The downloadable PDF lives at `files/Yildiz_HuseyinUgur_CV.pdf`. `scripts/cv_markdown_to_json.py` / `update_cv_json.sh` exist to emit a JSON Resume, but no `cv.json` is currently checked in — the live CV is the HTML page + PDF only.

### Theme customization

Remote theme: `mmistakes/minimal-mistakes@4.24.0`. Do not edit vendored theme files; local files under `_includes/`, `_layouts/`, and `_sass/` take precedence and are where overrides belong. Dark mode is enabled (`enable_darkmode: true` in `_config.yml`); the academic layout also sets the theme pre-paint from `localStorage` to avoid a flash.

### GitHub Actions (`.github/workflows/`)

- `jekyll.yml` — builds and deploys to GitHub Pages on every push to `master`.
- `update-openalex.yml` — monthly cron; fetches OpenAlex metrics into `_data/research_metrics.json`, commits with `[skip ci]`. Needs `OPENALEX_AUTHOR_ID` and `OPENALEX_MAILTO` repository secrets.

## Conventions

- Match the existing hand-written-HTML style on redesigned pages; put styles in `redesign.css`, not inline, unless matching a local pattern.
- Keep the Turkish diacritics correct in the name (Hüseyin Uğur Yıldız) and Turkish content.
- Make surgical changes — touch only what the task requires; don't refactor the theme fallback path while editing redesigned pages.
