import os, json, sys, requests
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timezone

API_KEY   = os.getenv("SERPAPI_KEY", "").strip()
AUTHOR_ID = os.getenv("SCHOLAR_AUTHOR_ID", "").strip()

if not API_KEY:
    sys.exit("ERROR: SERPAPI_KEY env var is missing.")
if not AUTHOR_ID:
    sys.exit("ERROR: SCHOLAR_AUTHOR_ID env var is missing.")

if AUTHOR_ID.startswith("http"):
    AUTHOR_ID = parse_qs(urlparse(AUTHOR_ID).query).get("user", [""])[0]
    if not AUTHOR_ID:
        sys.exit("ERROR: SCHOLAR_AUTHOR_ID looks like a URL but has no ?user= parameter.")

print(f"[INFO] Author ID: {AUTHOR_ID}")

PAGE = 100   # SerpApi caps the article page size at 100


def fetch(start):
    r = requests.get(
        "https://serpapi.com/search.json",
        params={
            "engine":    "google_scholar_author",
            "author_id": AUTHOR_ID,
            "hl":        "en",
            "num":       str(PAGE),
            "start":     str(start),
            "api_key":   API_KEY,
        },
        timeout=60,
    )
    body = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
    # SerpApi reports key, quota and upstream problems in an "error" field.
    if body.get("error"):
        sys.exit(f"ERROR: SerpApi (start={start}): {body['error']}")
    if r.status_code != 200:
        sys.exit(f"ERROR: {r.status_code} (start={start}) - {r.text[:300]}")
    return body


data = fetch(0)
print("[INFO] Status: 200")

table = (data.get("cited_by") or {}).get("table") or []
if len(table) < 2:
    sys.exit(f"ERROR: unexpected cited_by.table shape: {json.dumps(table)[:300]}")

# Google localises the row keys (h_index / indice_h / h_Index ...), so the rows are
# read positionally — the order is always citations, h-index, i10-index. Only the
# inner "all" key is stable across locales.
def row_all(i):
    if i >= len(table):
        return 0
    inner = next(iter(table[i].values()), {})
    return int(inner.get("all") or 0)

cites, h_index, i10_index = row_all(0), row_all(1), row_all(2)

# The profile's work count is not exposed as a field, so the article pages are walked.
# One request covers 100 works; the cap is a runaway guard, not an expected limit.
works = len(data.get("articles") or [])
page = data
while len(page.get("articles") or []) == PAGE and works < 1000:
    page = fetch(works)
    works += len(page.get("articles") or [])

name = (data.get("author") or {}).get("name", "")
print(f"[OK] {name}: citations={cites}, h_index={h_index}, i10_index={i10_index}, works={works}")

if cites == 0 and h_index == 0:
    sys.exit("ERROR: All metrics are zero. Check the Scholar author ID.")
if works == 0:
    sys.exit("ERROR: No articles returned. Check the Scholar author ID.")

metrics = {
    "citations":         cites,
    "citations_display": f"{cites:,}",   # Liquid has no thousands-separator filter
    "h_index":           h_index,
    "i10_index":         i10_index,
    "works":             works,
    "updated_utc":       datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "profile_url":       f"https://scholar.google.com/citations?user={AUTHOR_ID}",
    "display_name":      name,
}

os.makedirs("_data", exist_ok=True)
with open("_data/scholar_metrics.json", "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=2)

print("[OK] Saved _data/scholar_metrics.json")
print(json.dumps(metrics, indent=2))
