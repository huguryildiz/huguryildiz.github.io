import os, sys, json, requests
from datetime import date, datetime, timezone

TOKEN = os.getenv("GOATCOUNTER_API_TOKEN", "").strip()
if not TOKEN:
    sys.exit("ERROR: GOATCOUNTER_API_TOKEN env var is missing.")

SITE = "huguryildiz.goatcounter.com"
BASE = f"https://{SITE}/api/v0"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

START = "2019-01-01"
END = date.today().isoformat()


def get(path, params=None):
    """GET a GoatCounter API path. Returns parsed JSON, or None on any
    failure (missing endpoint, non-200, network error) so a single bad
    endpoint never aborts the whole run."""
    q = {"start": START, "end": END}
    q.update(params or {})
    try:
        r = requests.get(f"{BASE}{path}", headers=HEADERS, params=q, timeout=30)
    except requests.RequestException as e:
        print(f"[WARN] {path}: request failed ({e})")
        return None
    if r.status_code == 404:
        print(f"[INFO] {path}: 404, skipping")
        return None
    if r.status_code != 200:
        print(f"[WARN] {path}: HTTP {r.status_code} - {r.text[:200]}")
        return None
    try:
        return r.json()
    except ValueError:
        print(f"[WARN] {path}: non-JSON response, skipping")
        return None


def stats_list(path, limit=100, max_pages=10):
    """Fetch a /stats/<x> list endpoint, paginating with `offset` while
    the API reports `more: true`. Best-effort: if the endpoint's
    pagination scheme differs, we still return whatever the first page
    gave us instead of failing."""
    out = []
    offset = 0
    for _ in range(max_pages):
        data = get(path, {"limit": limit, "offset": offset})
        if not data:
            break
        items = data.get("stats") or data.get("hits") or []
        out.extend(items)
        if not data.get("more"):
            break
        offset += limit
    return out


# ---- totals + daily time series ----------------------------------------
total_data = get("/stats/total")
if not total_data:
    sys.exit("ERROR: could not fetch /stats/total; aborting to avoid overwriting good data.")

totals = {
    "pageviews": int(total_data.get("total") or 0),
    # GoatCounter's basic /api/v0 does not expose a separate unique-visitor
    # count on this endpoint; left null unless/until a suitable endpoint
    # is available.
    "visitors": None,
}
timeseries = [
    {"date": d.get("day"), "views": int(d.get("daily") or 0)}
    for d in (total_data.get("stats") or [])
    if d.get("day")
]

# ---- top pages -----------------------------------------------------------
hits = stats_list("/stats/hits")
pages = [
    {"path": h.get("path"), "count": int(h.get("count") or 0)}
    for h in hits if h.get("path")
]

# ---- countries -------------------------------------------------------------
locations = stats_list("/stats/locations")
countries = [
    {"code": l.get("id"), "name": l.get("name"), "count": int(l.get("count") or 0)}
    for l in locations if l.get("id")
]

# ---- referrers (external only) --------------------------------------------
refs = stats_list("/stats/toprefs")
referrers = [
    {"name": r.get("name"), "count": int(r.get("count") or 0)}
    for r in refs
    if r.get("name") and SITE.split(".goatcounter.com")[0] not in r.get("name", "")
    and "huguryildiz.com" not in r.get("name", "")
]

# ---- browsers / systems / sizes / (optional) languages --------------------
browsers = [
    {"name": b.get("name"), "count": int(b.get("count") or 0)}
    for b in stats_list("/stats/browsers") if b.get("name")
]
systems = [
    {"name": s.get("name"), "count": int(s.get("count") or 0)}
    for s in stats_list("/stats/systems") if s.get("name")
]
sizes = [
    {"name": s.get("name"), "count": int(s.get("count") or 0)}
    for s in stats_list("/stats/sizes") if s.get("name")
]
languages = [
    {"name": l.get("name"), "count": int(l.get("count") or 0)}
    for l in stats_list("/stats/languages") if l.get("name")
]

out = {
    "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "range": {"start": START, "end": END},
    "totals": totals,
    "timeseries": timeseries,
    "pages": pages,
    "countries": countries,
    "referrers": referrers,
    "browsers": browsers,
    "systems": systems,
    "sizes": sizes,
}
if languages:
    out["languages"] = languages

if totals["pageviews"] == 0:
    sys.exit("ERROR: total pageviews is 0. Check the API token / site.")

os.makedirs("_data", exist_ok=True)
with open("_data/site_stats.json", "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)

print(f"[OK] pageviews={totals['pageviews']} pages={len(pages)} countries={len(countries)} "
      f"referrers={len(referrers)} browsers={len(browsers)} systems={len(systems)} sizes={len(sizes)}")
print("[OK] Saved _data/site_stats.json")
