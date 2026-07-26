# Hüseyin Uğur Yıldız — Academic Website

[![Website](https://img.shields.io/badge/website-huguryildiz.com-12314e)](https://huguryildiz.com)
[![Deploy Jekyll site to Pages](https://github.com/huguryildiz/huguryildiz.github.io/actions/workflows/jekyll.yml/badge.svg)](https://github.com/huguryildiz/huguryildiz.github.io/actions/workflows/jekyll.yml)

Source code and scholarly content for [huguryildiz.com](https://huguryildiz.com),
the academic website of Hüseyin Uğur Yıldız. The site presents publications,
research projects, teaching, graduate supervision, professional service, and a
web and PDF curriculum vitae. It also preserves research notes and
announcements and publishes an aggregated, privacy-conscious site-reach report.

The website is generated with Jekyll and deployed to GitHub Pages from the
`master` branch. It uses no theme: every page renders through a single custom
academic interface.

## Site sections

| Section | Content |
| --- | --- |
| [Home](https://huguryildiz.com/) | Academic profile, research focus, news, and an interactive ocean digital twin |
| [Publications](https://huguryildiz.com/publications/) | Publication catalogue with type, year, and quartile filters; DOI and local full-text links |
| [Research](https://huguryildiz.com/research/) | Research program, interactive topic map, software, and learning resources |
| [Writing](https://huguryildiz.com/writing/) | Notes, announcements, and longer pieces retained as part of the scholarly record |
| [CV](https://huguryildiz.com/cv/) | Web curriculum vitae and the downloadable PDF version |
| [Teaching](https://huguryildiz.com/teaching/) | Undergraduate and graduate courses |
| [Students](https://huguryildiz.com/students/) | Graduate supervision and information for prospective students |
| [Service](https://huguryildiz.com/service/) | Reviewing, committee, chairing, institutional, and invited-talk activities |
| [Site Reach](https://huguryildiz.com/stats/) | Aggregated GoatCounter page-view, content, geographic, referral, and reading-environment summaries, selectable by date range, with explicit data limitations |

## Rendering architecture

The repository has one presentation path. Every page uses it.

| Path | Pages | Rendering chain |
| --- | --- | --- |
| Academic interface | All of them — home, publications, research, writing, posts, CV, teaching, students, service, site reach, terms, and 404 | Page → `_layouts/academic.html` → `_layouts/compress.html` → `assets/css/redesign.css`; posts first pass through `_layouts/post.html` |

The primary navigation is defined directly in `_layouts/academic.html`; there is
no navigation data file. The Minimal Mistakes remote theme and its local
overrides were removed — no `_sass/`, no `main.scss`/`custom.css`, no
`default.html`/`single.html`. Extend `assets/css/redesign.css` rather than
reintroducing a theme.

## Repository map

| Path | Responsibility |
| --- | --- |
| `index.md` | Home-page content |
| `_pages/` | Main and utility pages |
| `_posts/` | Dated writing entries published under `/writing/:title/` |
| `_layouts/academic.html` | Primary navigation, page shell, footer, theme control, and shared interactions |
| `_layouts/post.html` | Writing-entry metadata, reading time, tags, and optional source link |
| `_includes/_shared/` | Head fragments: favicon markup and animation, GTM, GA4, GoatCounter |
| `_includes/hero-uwsn.html` | Interactive ocean digital twin and underwater acoustic-network scenario |
| `_includes/research-map.html` | Interactive research map rendered from `_data/research_map.yml` |
| `assets/css/redesign.css` | All site styles |
| `_data/cv.yml` | CV data — the source for `_pages/cv.md`, `_pages/service.md`, `_pages/teaching.md`, and the downloadable PDF |
| `_data/publications.yml` | Publication records — the source for `_pages/publications.md` and the downloadable PDF |
| `_data/scholar_metrics.json` | Google Scholar metrics snapshot; rendered by `index.md` and `_pages/cv.md` |
| `_data/openalex_metrics.json` | OpenAlex metrics snapshot; dormant fallback, not rendered |
| `_data/site_stats.json` | Sanitized GoatCounter snapshot rendered by `_pages/stats.md` |
| `files/` | CV, theses, papers, and other downloadable scholarly documents |
| `assets/images/` | Portraits, research graphics, course images, project images, and favicons |
| `assets/video/courses/`, `assets/video/topics/` | Course and research-topic media |
| `scripts/` | Google Scholar, OpenAlex, and GoatCounter retrieval plus optional CV-conversion utilities; excluded from the build (see `scripts/README.md`) |
| `_config.yml` | Jekyll, metadata, SEO, and plugin configuration |
| `PRODUCT.md` | Product, data-honesty, design, and accessibility contract for the ocean digital twin |

Generated output under `_site/` is not a source and should not be edited.

What reaches the public site is decided by `exclude` in `_config.yml`, not by
`.gitignore`. Jekyll skips dot- and underscore-prefixed paths automatically; any other
tracked path is copied into `_site/` and served. Before adding a file at the repository
root, decide whether it should become a public URL.

## Local development

### Docker

Docker is the most reproducible option because it does not depend on the
host's Ruby installation:

```bash
docker compose up --build
```

The container combines `_config.yml` with `_config_docker.yml` and serves the
site at <http://localhost:4000>. Source changes are watched automatically.

### Native Ruby

With a compatible Ruby installation and Bundler:

```bash
bundle install
bundle exec jekyll serve
```

For a production-style build:

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

A change to `_config.yml` requires restarting the development server.

## Content maintenance

The web CV, the downloadable PDF, and the publication catalogue share one
source of truth: `_data/cv.yml` and `_data/publications.yml`.

- Updating the CV means editing `_data/cv.yml`. `_pages/cv.md`,
  `_pages/service.md`, and `_pages/teaching.md` render it directly, and the
  PDF regenerates from the same file on every deploy via
  `scripts/render_cv_tex.py` — never edit `files/Yildiz_HuseyinUgur_CV.pdf` or
  `main.tex` by hand.
- Publication records live in `_data/publications.yml`; `_pages/publications.md`
  renders them and also drives the PDF's publication list. Verify metadata,
  DOI links, and local PDF paths when adding a record.
- Research-map content belongs in `_data/research_map.yml`; its labels and
  counts must remain consistent with `_includes/research-map.html`.
- The writing index is `_pages/writing.md`; dated entries live in `_posts/`.
  Post URLs follow `/writing/:title/`, as configured in `_config.yml`.
- Do not infer or hand-edit bibliometric values without a source. The citation
  counts, h-index, and work count shown on the home page and the CV come from
  `_data/scholar_metrics.json`. To refresh that snapshot locally, run:

  ```bash
  SERPAPI_KEY=... SCHOLAR_AUTHOR_ID=nQwHS1gAAAAJ python3 scripts/fetch_scholar.py
  ```

  Google Scholar has no public API, so the script reads the profile through
  SerpApi's Google Scholar Author endpoint. The key is a secret: never print it,
  embed it in browser code, or commit it. To refresh the OpenAlex snapshot, run:

  ```bash
  OPENALEX_AUTHOR_ID=A5085505896 python3 scripts/fetch_openalex.py
  ```

  Both scripts require Python's `requests` package. `OPENALEX_MAILTO` is optional.
- `_pages/stats.md` renders the sanitized snapshot in
  `_data/site_stats.json`. The daily GitHub Actions workflow runs
  `scripts/fetch_goatcounter.py` with the `GOATCOUNTER_API_TOKEN` repository
  secret. The token must never be placed in client-side code or committed
  data. The public report does not infer visitors, sessions, bounce rate, or
  other measures unavailable from the source API.

The CV conversion scripts are optional maintenance utilities, not an active
site-generation pipeline. Use `scripts/update_cv_json.sh` only when JSON Resume
output is explicitly needed, and review the generated data before retaining it.

## Validation

There is no automated test suite. Before publishing a change:

1. Run `git diff --check` and inspect the focused diff.
2. Complete a Jekyll production build.
3. Inspect the affected page at desktop and narrow mobile widths.
4. Check light and dark themes.
5. Exercise changed controls with both keyboard and pointer input.
6. Check the browser console when JavaScript changes.
7. Confirm that affected internal links and local assets resolve.

Changes to shared layouts, navigation, CSS, or theme behavior should be checked
on every academic page — which is now every page on the site.

## Deployment and metrics

A push to `master`, a daily schedule, or manual dispatch starts
`.github/workflows/jekyll.yml`, which builds the site with Ruby 3.1, renders
and compiles the CV PDF from `_data/cv.yml` + `_data/publications.yml` with
`scripts/render_cv_tex.py` and `pdflatex`, places it at
`_site/files/Yildiz_HuseyinUgur_CV.pdf`, and deploys to GitHub Pages. A failed
or empty PDF fails the build so the previously deployed site stays live. The
custom domain is declared in `CNAME`.

`.github/workflows/update-scholar.yml` runs weekly and can also be triggered
manually. It reads the Google Scholar profile through SerpApi and commits an
updated `_data/scholar_metrics.json` only when the snapshot changes. It needs the
`SERPAPI_KEY` and `SCHOLAR_AUTHOR_ID` repository secrets.

`.github/workflows/update-openalex.yml` is a dormant fallback: manual dispatch
only, no schedule. `_data/openalex_metrics.json` is retained as a second
bibliometric source but is not rendered by any page and is not refreshed
automatically.

`.github/workflows/update-goatcounter.yml` runs daily and can also be triggered
manually. It retrieves aggregated analytics with a repository secret and
commits `_data/site_stats.json` only when the snapshot changes.

## License

Code and content are licensed separately; see [LICENSE](LICENSE) for the exact
paths each covers.

- **Software** — the layouts, includes, stylesheet, scripts, LaTeX template, and
  workflows are MIT licensed. Take any part of them, including the
  `_data/cv.yml` → web CV + LaTeX PDF pipeline.
- **Content and media** — the prose, biography, publication and teaching
  records, and images are CC BY-NC 4.0. This is a personal scholarly record, so
  reuse means credit and non-commercial use, not adoption as your own CV.
- **Publication PDFs under `files/`** — excluded from both. Copyright in most of
  them belongs to their publishers and they are posted here only under the
  self-archiving terms each publisher permits.

This repository is a working site rather than a template: content is written
directly into the pages, and `_includes/hero-uwsn.html` is specific to one
research programme. It is published to be read and borrowed from, not forked
wholesale.
