# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What This Is

Personal academic website for Huseyin Ugur Yildiz (huguryildiz.com), built with Jekyll and the AcademicPages theme (a fork of Minimal Mistakes). Hosted on GitHub Pages. Pushes to `master` trigger automatic deployment via GitHub Actions.

## Local Development

**Serve locally (native Ruby):**
```bash
bundle install
bundle exec jekyll serve
```

**Serve locally (Docker):**
```bash
docker compose up
```
Docker maps port 4000 and uses `_config.yml` + `_config_docker.yml` together.

**Build only:**
```bash
bundle exec jekyll build
```

There is no test suite. Validation is visual — run the server and check the browser at `http://localhost:4000`.

## Architecture

### Content Model

The site follows Jekyll's collection pattern. Content lives in Markdown files; the theme handles rendering.

| Directory | Purpose |
|---|---|
| `_pages/` | Static pages (publications, CV, research, service, students, teaching) |
| `_posts/` | Blog-style posts (rarely used) |
| `_talks/` | Talk entries rendered via collection |
| `_portfolio/` | Portfolio entries |
| `_includes/` | Reusable HTML partials (overrides theme defaults) |
| `_layouts/` | Page layout templates |
| `_sass/` | SCSS overrides (`custom.scss`, `include/`, `layout/`, `theme/`) |
| `_data/` | Structured data consumed by templates |
| `assets/` | JS, CSS, fonts, icons |

### Data Layer (`_data/`)

- `navigation.yml` — top nav links
- `research_metrics.json` — auto-updated monthly via GitHub Actions (`fetch_metrics.py` → OpenAlex API); commit message tagged `[skip ci]`
- `cv.json` — JSON Resume format; can be regenerated from `_pages/cv.md` using `scripts/cv_markdown_to_json.py`

### Key Includes

- `_includes/research-metrics.html` — renders citation/h-index stats from `_data/research_metrics.json`
- `_includes/scripts.html` — loads `assets/js/main.min.js` and analytics
- `_includes/footer.html` — custom footer with academic profile links (DBLP, ResearcherID, etc.)
- `_includes/head/` — `<head>` overrides (custom CSS injection, favicon, meta tags)

### Publications Page

`_pages/publications.md` uses raw HTML with JavaScript for interactive filtering (by type, year, journal tier). Publication data is hardcoded in the Markdown file itself, not in a `_data/` collection. Charts (donut charts) are rendered client-side.

### Theme Customization

The remote theme is `mmistakes/minimal-mistakes@4.24.0`. Local overrides take precedence — files in `_includes/`, `_layouts/`, and `_sass/` shadow the theme's equivalents. Do not edit vendored theme files; place overrides locally.

Dark mode is enabled via `enable_darkmode: true` in `_config.yml`.

### GitHub Actions

- **`jekyll.yml`** — builds and deploys to GitHub Pages on every push to `master`
- **`update-openalex.yml`** — runs monthly (cron), fetches metrics from OpenAlex API into `_data/research_metrics.json`, commits with `[skip ci]`; requires `OPENALEX_AUTHOR_ID` and `OPENALEX_MAILTO` repository secrets

### CV Sync

The CV exists in two formats:
1. Human-readable Markdown: `_pages/cv.md`
2. JSON Resume format: `_data/cv.json` (used by `_pages/cv-json.md` layout)

When updating the CV, edit `_pages/cv.md` as the source of truth, then optionally regenerate `_data/cv.json` via `scripts/cv_markdown_to_json.py`.
