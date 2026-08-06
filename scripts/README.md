# scripts/

Maintenance utilities. **Not part of the site build** — `_config.yml` excludes this
directory, so nothing here is copied into `_site/` or published.

These paths are referenced by name from `.github/workflows/`, so do not move or rename
the files without updating the workflows in the same change.

## Live — scheduled, writes tracked data

| Script | Trigger | Writes | Requires |
| --- | --- | --- | --- |
| `fetch_scholar.py` | `.github/workflows/update-scholar.yml` — weekly, Mondays at 01:30 UTC, plus manual dispatch | `_data/scholar_metrics.json` | `SERPAPI_KEY`, `SCHOLAR_AUTHOR_ID` (repo secrets); Python `requests` |
| `fetch_goatcounter.py` | `.github/workflows/update-goatcounter.yml` — daily at 03:00 UTC, plus manual dispatch | `_data/site_stats.json` | `GOATCOUNTER_API_TOKEN` (repo secret); Python `requests` |
| `render_cv_tex.py` | `.github/workflows/jekyll.yml` — every push to `master`, daily at 04:17 UTC, plus manual dispatch | `main.tex`, compiled to `_site/files/Yildiz_HuseyinUgur_CV.pdf` | PyYAML, Jinja2; `pdflatex` (`xu-cheng/latex-action`) |
| `build_cv_pdf.sh` | local, explicit | `files/Yildiz_HuseyinUgur_CV.pdf` (or the path passed as its first argument) | The same renderer and data as production; PyYAML, Jinja2, `latexmk` |

Both workflows commit only when the snapshot actually changed, and **neither tags the commit
with a CI-skip marker** — each refresh is meant to trigger a Pages rebuild. The pages state
their own cadence (the Scholar metrics "refreshed weekly", `/stats/` "refreshed daily"), and
those claims only hold if the site is actually rebuilt. With a skip marker the snapshot
advances in the repository while the live pages keep serving the previous numbers and a stale
date, which is how this repository previously published a `/stats/` report one day behind its
own committed data. Do not reintroduce the marker to reduce build noise without also removing
the cadence claim from the affected page.

`fetch_goatcounter.py` notes — the snapshot is a public aggregate, not a raw-hit archive. It
keeps exact per-day breakdowns in `daily_breakdowns` so an arbitrary calendar range can be
merged in the browser without querying GoatCounter or substituting all-time figures. A clean
first run backfills at most 1,500 API calls (configurable with
`GOATCOUNTER_DAILY_CALL_BUDGET`); later runs reuse the committed cache and refresh only the
newest two days. A date is omitted if any required endpoint fails, and the page then marks a
range crossing that gap unavailable instead of presenting a partial result as exact. What each
run collects, beyond the preset blocks and page-view-only daily series:

- **Pages and events come from one `/stats/hits` response.** GoatCounter returns both in the
  same list and includes both in its headline total, distinguished by the `event` flag. The
  script separates them before computing the page-view KPI, trend, or hourly profile. Events are the
  clicks instrumented with `data-goatcounter-click` (CV and thesis PDFs, publication DOI/PDF
  links, the LinkedIn footer on posts); they appear only in the interactions panel. Because
  that same response carries hourly buckets, the hour-of-day profile costs no extra request.
- **Per-page referrers** are one `/stats/hits/<path_id>` call for each of the five busiest
  pages, per window, and land on `pages[].refs`.
- **Page titles** ride along on the same response, so `/stats/` labels a new page sensibly
  before anyone adds it to the curated label map.
- **Single-day API bounds use the site's calendar time zone.** A bare date used for both
  `start` and `end` describes an empty interval to the total and hits endpoints. Conversely,
  a UTC end-of-day timestamp becomes the following date when GoatCounter converts it to the
  site's `Europe/Istanbul` calendar for country, browser, and other daily tables. The
  collector therefore sends `00:00:00` through `23:59:59` with the site's UTC offset so all
  endpoint families share one interval. `GOATCOUNTER_SITE_TIMEZONE` can override the default,
  and collection aborts if it disagrees with the time zone reported by `/sites`.
- **Per-page daily series** (`page_series`) is fetched once, for the all-time window only,
  with `group=day`; leading zero-only history is removed before publication.
- **Site metadata** (`site`) carries the time zone the hour-of-day panel is labelled with,
  plus GoatCounter's own `data_retention` setting. It comes from `/sites`, which — like
  `/stats/hits` and `offset` — rejects an unexpected query parameter with a 400, so it is
  requested without the date range every other call sends.

`/stats/sizes` currently returns nothing for this site: screen-size collection is off in the
GoatCounter site settings (`collect`), so the "Screen classes" panel is absent rather than
broken. The same setting governs language collection, so check it there first if the new
"Browser languages" panel stays empty after a refresh.

## Permanent archive — manual, append-only

| Script | Trigger | Writes | Requires |
| --- | --- | --- | --- |
| `fetch_goatcounter_export.py` | none — run by hand | `analytics-archive/goatcounter/` | `GOATCOUNTER_API_TOKEN`; Python `requests` |

This is the counterweight to the rewritten snapshot above. It requests GoatCounter's raw hit
export starting just after the last hit already archived, and writes it as a new gzipped CSV
named for the hit-id span it covers. Files are never rewritten and the cursor lives in
`analytics-archive/goatcounter/state.json`; a run whose export does not advance the cursor
aborts rather than duplicating rows. `analytics-archive/` is in `_config.yml`'s `exclude`, so
it is never published, and it is deliberately outside `_data/` so Jekyll does not parse it on
every build.

Run it when you want a durable checkpoint of the underlying hits — the aggregates the site
renders only exist for as long as GoatCounter keeps them, and only in the shapes it computes.

## Dormant fallback — manual dispatch only

| Script | Trigger | Writes | Requires |
| --- | --- | --- | --- |
| `fetch_openalex.py` | `.github/workflows/update-openalex.yml` — **no schedule**; run by hand from the Actions tab | `_data/openalex_metrics.json` | `OPENALEX_AUTHOR_ID` (repo secret); `OPENALEX_MAILTO` optional; Python `requests` |

The site's bibliometrics come from Google Scholar. `_data/openalex_metrics.json` is kept as
a second source in case the Scholar path has to be abandoned, but no page parses it and
nothing refreshes it automatically. Google Scholar and OpenAlex legitimately disagree —
Scholar indexes more venue types, so its counts run higher. Never present a value from one
source under the other's name.

Run locally only when explicitly asked, and inspect the diff — all perform live network
requests:

```bash
SERPAPI_KEY=... SCHOLAR_AUTHOR_ID=nQwHS1gAAAAJ python3 scripts/fetch_scholar.py
OPENALEX_AUTHOR_ID=A5085505896              python3 scripts/fetch_openalex.py
GOATCOUNTER_API_TOKEN=...                   python3 scripts/fetch_goatcounter.py
GOATCOUNTER_API_TOKEN=...                   python3 scripts/fetch_goatcounter_export.py
```

The SerpApi key and the GoatCounter token are secrets: never print them, embed them in
browser code, or commit them.

`fetch_scholar.py` notes — Google Scholar has no public API, so the script reads the profile
through SerpApi's `google_scholar_author` endpoint:

- The `cited_by.table` rows are read **positionally** (citations, h-index, i10-index). Google
  localises the row keys — `h_index` becomes `indice_h` in a French locale — so matching on key
  names breaks silently. Only the inner `all` key is stable.
- The profile's work count is not a field, so the article pages are walked at 100 per request.
  One SerpApi search is spent per 100 works; the free tier's monthly allowance covers the
  weekly cron many times over.
- Any SerpApi error, an unexpected table shape, or an all-zero result aborts with a non-zero
  exit and leaves the committed snapshot untouched, so a failed refresh is visible in Actions
  rather than silently publishing zeros.
- `_data/scholar_metrics.json` carries `citations_display` (a pre-formatted `1,075`) because
  Liquid has no thousands-separator filter. Pages render that field, not `citations`.
- `citations_per_year` mirrors `cited_by.graph`, the histogram Scholar draws on the profile —
  a sliding window of roughly the last decade whose final year is still accruing, so its years
  need not span the publication record and its sum is below the profile total. It arrives in
  the same request, at no extra API cost. An unreadable graph only logs a warning and omits
  the key: `/publications/` hides the chart when the key is missing rather than inventing one.
- `SCHOLAR_AUTHOR_ID` accepts either the bare profile ID or a full profile URL.

## `render_cv_tex.py` notes

Renders `cv-latex/cv.tex.j2` against `_data/cv.yml` + `_data/publications.yml` to produce
`main.tex`, the LaTeX source of the downloadable PDF CV (invoked with `--out`, since the CI
job needs it at the repo root). `cv-latex/cv.tex.j2` is excluded from the Jekyll build
(`_config.yml`) so it never becomes a public URL. `main.tex` is compiled to PDF with
`pdflatex` (two passes, for `\pageref{LastPage}`; `xu-cheng/latex-action` runs `latexmk` in
CI) and is never committed. The local PDF preview is tracked but generated only through
`build_cv_pdf.sh`; the deployed PDF remains a build output. `jekyll.yml` runs the renderer
after the Jekyll build step and before the artifact upload, since Jekyll rebuilds `_site/`
from scratch; a `test -s main.pdf` guard fails the job if the compile produced a missing or
empty file, so a broken LaTeX template fails the build rather than publishing a broken or
stale PDF.

Publication numbering (`J24`, `C13`, `CT5`, `E1`, …) is computed at render time, per type, in
descending year order; it is never stored in `_data/publications.yml`. Tests:
`python3 -m unittest scripts/test_render_cv_tex` (stdlib only, no network, no LaTeX
toolchain required — it only covers the pure text-transform helpers).

Two publication fields exist only for this script, not for the website: `month` on
`confint`/`confnat`/`editorial` records (the LaTeX citation format includes the month;
`_pages/publications.md` does not) and `title_tex`/`org_tex`-style overrides in `_data/cv.yml`
wherever the PDF's citation-style text diverges from the web copy (see the `DIVERGED`
comments next to those fields). Requires PyYAML, Jinja2.

### Local and production PDF parity

Do not edit `files/Yildiz_HuseyinUgur_CV.pdf` in a PDF application. Refresh the local
downloadable artifact with:

```bash
scripts/build_cv_pdf.sh
```

The helper invokes `render_cv_tex.py`, reads the same three repository data files as the
production workflow, compiles in an isolated temporary directory, and replaces the local
artifact only after a successful non-empty build. If the active Python lacks PyYAML or Jinja2,
the helper uses `uv` to provide them in an isolated run rather than installing packages
globally. The Pages workflow intentionally keeps its containerized LaTeX compiler, but it
consumes the same generated `main.tex` and places the result at the same public URL. Text
extracted from the local and deployed PDFs should match; binary hashes need not match because
PDF creation timestamps and producer versions differ.

### Tagged PDF production plan

Current verified baseline (2026-07-26): `pdfinfo` reports `Tagged: no` for both the repository
PDF and the deployed PDF. Selectable text and metadata do not make a PDF structurally tagged.
Do not claim PDF/UA or screen-reader conformance until every acceptance check below passes.

1. Create a short-lived compatibility branch and add `\DocumentMetadata{lang=en-US,
   tagging=on}` before `\documentclass`, following the current
   [LaTeX Tagged PDF guidance](https://latex3.github.io/tagging-project/). Prototype with a
   pinned current TeX Live and LuaLaTeX/PDF 2.0; do not switch the production engine in the
   same change.
2. Audit `article`, `titlesec`, `fullpage`, `fancyhdr`, `enumitem`, `hyperref`,
   `fontawesome5`, and the remaining packages against the project's
   [tagging status table](https://latex3.github.io/tagging-project/tagging-status). Replace
   incompatible presentational constructs rather than wrapping them in misleading tags.
3. Preserve real structural commands for headings and lists; mark decorative icons, rules,
   and layout-only material as artifacts. Verify the reading order of the two-ended
   appointment rows, publication entries, header, and footer rather than relying on visual
   position.
4. Retain document language, title, author, subject, link annotations, and Unicode mapping.
   Add alternative text only for meaningful graphics; decorative Font Awesome glyphs must not
   be announced as content.
5. Validate a release candidate with `pdfinfo` (`Tagged: yes`), veraPDF against PDF/UA-2,
   PAC or Acrobat's accessibility checker, and manual VoiceOver or NVDA reading-order and link
   navigation. Render all pages to images and compare them with the current six-page CV so
   tagging does not introduce clipped text, changed pagination, or missing glyphs.
6. Only after those checks pass, pin the TeX Live version, switch both the local helper and
   Pages workflow to the same engine, add the structural validation to CI, and update this
   document from “planned” to the exact verified conformance level. A failed tagging or visual
   check must leave the previous deployed PDF live.

## Dormant — manual, output is not part of the site

| Script | Purpose | Status |
| --- | --- | --- |
| `cv_markdown_to_json.py` | Parses `_pages/cv.md` into JSON Resume format | No scheduled caller |
| `update_cv_json.sh` | Interactive wrapper around the converter | No scheduled caller |

These are **not** a synchronization pipeline. Their target, `_data/cv.json`, is neither
tracked nor rendered by any page, and neither script feeds `_pages/cv.md` or the downloadable
PDF — both of those now render from `_data/cv.yml` and `_data/publications.yml` via
`render_cv_tex.py` above. Run the converter only when JSON Resume output is explicitly
requested, and review the result rather than assuming the parser preserved the hand-authored
CV.

Requires PyYAML in addition to `requests`.

## One-off utility — already run, kept for provenance

| Script | Purpose | Status |
| --- | --- | --- |
| `convert_pubs_to_yaml.py` | Parsed the old `var PUBS = [...]` JS array literal in `_pages/publications.md` into `_data/publications.yml` | Ran once; do not re-run |

`_data/publications.yml` is now the hand-maintained source for publication records;
`_pages/publications.md` renders it via `{{ site.data.publications | jsonify }}`. Re-running
this script would overwrite any manual edits made to the YAML since the conversion — add or
edit publication records directly in `_data/publications.yml` instead.

Requires PyYAML.
