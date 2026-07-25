# Hüseyin Uğur Yıldız — Academic Website

[![Website](https://img.shields.io/badge/website-huguryildiz.com-12314e)](https://huguryildiz.com)
[![Deploy Jekyll site to Pages](https://github.com/huguryildiz/huguryildiz.github.io/actions/workflows/jekyll.yml/badge.svg)](https://github.com/huguryildiz/huguryildiz.github.io/actions/workflows/jekyll.yml)

Source code and scholarly content for [huguryildiz.com](https://huguryildiz.com),
the academic website of Hüseyin Uğur Yıldız. The site presents publications,
research projects, teaching, graduate supervision, professional service, and a
web and PDF curriculum vitae. It also preserves research notes and
announcements and publishes an aggregated, privacy-conscious site-reach report.

The website is generated with Jekyll and deployed to GitHub Pages from the
`master` branch. It uses a custom academic interface alongside a retained
Minimal Mistakes path for utility pages.

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

The repository has two active presentation paths. Check a page's front matter
before changing layouts, navigation, styles, or scripts.

| Path | Pages | Rendering chain |
| --- | --- | --- |
| Primary academic interface | Home, publications, research, writing, posts, CV, teaching, students, service, and site reach | Page → `_layouts/academic.html` → `_layouts/compress.html` → `assets/css/redesign.css`; posts first pass through `_layouts/post.html` |
| Minimal Mistakes interface | 404, terms, and other pages without `layout: academic` | Local layouts and includes → `assets/css/main.scss`, `assets/css/custom.css`, and `_sass/` |

The primary navigation is defined directly in `_layouts/academic.html`.
`_data/navigation.yml` affects the retained Minimal Mistakes interface only.

## Repository map

| Path | Responsibility |
| --- | --- |
| `index.md` | Home-page content |
| `_pages/` | Main and utility pages |
| `_posts/` | Dated writing entries published under `/writing/:title/` |
| `_layouts/academic.html` | Primary navigation, page shell, footer, theme control, and shared interactions |
| `_layouts/post.html` | Writing-entry metadata, reading time, tags, and optional source link |
| `_includes/_shared/` | Head fragments shared by both rendering paths: favicon markup and animation, GTM, GoatCounter |
| `_includes/hero-uwsn.html` | Interactive ocean digital twin and underwater acoustic-network scenario |
| `_includes/research-map.html` | Interactive research map rendered from `_data/research_map.yml` |
| `assets/css/redesign.css` | Primary academic-interface styles |
| `_layouts/`, `_includes/`, `_sass/`, `assets/css/main.scss` | Local Minimal Mistakes rendering and overrides |
| `_data/scholar_metrics.json` | Google Scholar metrics snapshot; rendered by `index.md` and `_pages/cv.md` |
| `_data/research_metrics.json` | OpenAlex metrics snapshot; dormant fallback, not rendered |
| `_data/site_stats.json` | Sanitized GoatCounter snapshot rendered by `_pages/stats.md` |
| `files/` | CV, theses, papers, and other downloadable scholarly documents |
| `assets/images/` | Portraits, research graphics, course images, project images, and favicons |
| `assets/video/courses/`, `assets/video/topics/` | Course and research-topic media |
| `scripts/` | Google Scholar, OpenAlex, and GoatCounter retrieval plus optional CV-conversion utilities; excluded from the build (see `scripts/README.md`) |
| `images/` | Compatibility copies of two social-card images at their historical `/images/...` URLs; not the canonical image location |
| `_config.yml` | Jekyll, theme, metadata, analytics, and plugin configuration |
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

The website, downloadable CV, and publication catalogue are maintained as
separate artifacts; changing one does not update the others automatically.

- Edit the web CV in `_pages/cv.md` and replace
  `files/Yildiz_HuseyinUgur_CV.pdf` separately when the PDF changes.
- Publication records and filtering logic currently live in
  `_pages/publications.md`. Verify metadata, totals, year groupings, DOI links,
  and local PDF paths together.
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
  OPENALEX_AUTHOR_ID=A5085505896 python3 scripts/fetch_metrics.py
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
on every primary academic page and at least one Minimal Mistakes page.

## Deployment and metrics

A push to `master` starts `.github/workflows/jekyll.yml`, which builds the site
with Ruby 3.1 and deploys it to GitHub Pages. The custom domain is declared in
`CNAME`.

`.github/workflows/update-scholar.yml` runs monthly and can also be triggered
manually. It reads the Google Scholar profile through SerpApi and commits an
updated `_data/scholar_metrics.json` only when the snapshot changes. It needs the
`SERPAPI_KEY` and `SCHOLAR_AUTHOR_ID` repository secrets.

`.github/workflows/update-openalex.yml` is a dormant fallback: manual dispatch
only, no schedule. `_data/research_metrics.json` is retained as a second
bibliometric source but is not rendered by any page and is not refreshed
automatically.

`.github/workflows/update-goatcounter.yml` runs daily and can also be triggered
manually. It retrieves aggregated analytics with a repository secret and
commits `_data/site_stats.json` only when the snapshot changes.

## License

This repository includes software distributed under the terms in
[LICENSE](LICENSE). Publication PDFs and other third-party or scholarly
materials may carry their own rights and reuse conditions.
