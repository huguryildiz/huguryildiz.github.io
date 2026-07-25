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

Both workflows commit only when the snapshot actually changed, and **neither tags the commit
with a CI-skip marker** — each refresh is meant to trigger a Pages rebuild. The pages state
their own cadence (the Scholar metrics "refreshed weekly", `/stats/` "refreshed daily"), and
those claims only hold if the site is actually rebuilt. With a skip marker the snapshot
advances in the repository while the live pages keep serving the previous numbers and a stale
date, which is how this repository previously published a `/stats/` report one day behind its
own committed data. Do not reintroduce the marker to reduce build noise without also removing
the cadence claim from the affected page.

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

## Dormant — manual, output is not part of the site

| Script | Purpose | Status |
| --- | --- | --- |
| `cv_markdown_to_json.py` | Parses `_pages/cv.md` into JSON Resume format | No scheduled caller |
| `update_cv_json.sh` | Interactive wrapper around the converter | No scheduled caller |

These are **not** a synchronization pipeline. Their target, `_data/cv.json`, is neither
tracked nor rendered by any page. The web CV (`_pages/cv.md`) and the downloadable
`files/Yildiz_HuseyinUgur_CV.pdf` are independent, hand-maintained artifacts. Run the
converter only when JSON Resume output is explicitly requested, and review the result
rather than assuming the parser preserved the hand-authored CV.

Requires PyYAML in addition to `requests`.
