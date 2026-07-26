"""Fetch aggregated GoatCounter statistics into _data/site_stats.json.

The /stats/ report lets a reader switch between date ranges, so the snapshot
stores one self-contained block per window. Each window is queried separately
because GoatCounter aggregates every breakdown server-side: a country or
browser ranking for "last 30 days" cannot be re-derived on the client from an
all-time ranking. The daily total series is stored once; the trend chart, the
page-view totals and the period-over-period deltas are all derived from it in
the browser, so those numbers can never disagree between windows.

Requires GOATCOUNTER_API_TOKEN. Run by .github/workflows/update-goatcounter.yml.
"""

import os, sys, json, time, unicodedata, requests
from datetime import date, datetime, timedelta, timezone

TOKEN = os.getenv("GOATCOUNTER_API_TOKEN", "").strip()
if not TOKEN:
    sys.exit("ERROR: GOATCOUNTER_API_TOKEN env var is missing.")

SITE = "huguryildiz.goatcounter.com"
SITE_NAME = SITE.split(".goatcounter.com")[0]
BASE = f"https://{SITE}/api/v0"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

TRACKING_START = date(2019, 1, 1)
TODAY = date.today()

# key, label, length in days (None = everything since TRACKING_START), and how
# many days back the window ends. The offset is what lets "yesterday" be a
# single day that is not the most recent one.
WINDOWS = [
    ("today", "Today", 1, 0),
    ("yesterday", "Yesterday", 1, 1),
    ("7d", "Last 7 days", 7, 0),
    ("30d", "Last 30 days", 30, 0),
    ("90d", "Last 90 days", 90, 0),
    ("12m", "Last 12 months", 365, 0),
    ("all", "All time", None, 0),
]

# JSON key -> API path. /stats/hits is absent on purpose: it carries pages,
# events and the hour-of-day profile in a single response, so fetch_window
# handles it separately rather than fetching it once per derived list.
DIMENSIONS = [
    ("countries", "/stats/locations"),
    ("referrers", "/stats/toprefs"),
    ("browsers", "/stats/browsers"),
    ("systems", "/stats/systems"),
    ("sizes", "/stats/sizes"),
    ("languages", "/stats/languages"),
]

# Ranked lists are truncated for page weight; the map needs every country.
LIST_CAP = 12
UNCAPPED = {"countries"}
# How many of the busiest countries get a region lookup (one request each).
REGION_COUNTRIES = 5

# Turkish provinces, keyed by the licence-plate number that doubles as the
# ISO 3166-2:TR suffix (TR-34) and as the `data-code` on assets/maps/turkey.svg.
# GoatCounter resolves regions through MaxMind GeoLite2, which returns the
# transliterated ISO name ("Istanbul", "Sanliurfa"); province_key() folds those
# onto the Turkish spellings below, so the map and the ranked list can share one
# canonical name instead of showing "Sanliurfa" beside "Şanlıurfa".
TR_PROVINCES = {
    "01": "Adana", "02": "Adıyaman", "03": "Afyonkarahisar", "04": "Ağrı",
    "05": "Amasya", "06": "Ankara", "07": "Antalya", "08": "Artvin",
    "09": "Aydın", "10": "Balıkesir", "11": "Bilecik", "12": "Bingöl",
    "13": "Bitlis", "14": "Bolu", "15": "Burdur", "16": "Bursa",
    "17": "Çanakkale", "18": "Çankırı", "19": "Çorum", "20": "Denizli",
    "21": "Diyarbakır", "22": "Edirne", "23": "Elazığ", "24": "Erzincan",
    "25": "Erzurum", "26": "Eskişehir", "27": "Gaziantep", "28": "Giresun",
    "29": "Gümüşhane", "30": "Hakkâri", "31": "Hatay", "32": "Isparta",
    "33": "Mersin", "34": "İstanbul", "35": "İzmir", "36": "Kars",
    "37": "Kastamonu", "38": "Kayseri", "39": "Kırklareli", "40": "Kırşehir",
    "41": "Kocaeli", "42": "Konya", "43": "Kütahya", "44": "Malatya",
    "45": "Manisa", "46": "Kahramanmaraş", "47": "Mardin", "48": "Muğla",
    "49": "Muş", "50": "Nevşehir", "51": "Niğde", "52": "Ordu",
    "53": "Rize", "54": "Sakarya", "55": "Samsun", "56": "Siirt",
    "57": "Sinop", "58": "Sivas", "59": "Tekirdağ", "60": "Tokat",
    "61": "Trabzon", "62": "Tunceli", "63": "Şanlıurfa", "64": "Uşak",
    "65": "Van", "66": "Yozgat", "67": "Zonguldak", "68": "Aksaray",
    "69": "Bayburt", "70": "Karaman", "71": "Kırıkkale", "72": "Batman",
    "73": "Şırnak", "74": "Bartın", "75": "Ardahan", "76": "Iğdır",
    "77": "Yalova", "78": "Karabük", "79": "Kilis", "80": "Osmaniye",
    "81": "Düzce",
}

# Names that do not fold onto a province by transliteration alone: renamed
# provinces (Içel became Mersin in 2002) and the short forms GeoLite2 has been
# seen to use.
TR_ALIASES = {"icel": "33", "afyon": "03", "urfa": "63", "kmaras": "46"}
# How many of the busiest pages get their own referrer lookup (one request each).
REF_PAGES = 5
# How many pages get their own daily series stored (all-time window only).
SERIES_PAGES = 6
# List endpoints that reject an `offset` parameter (see stats_list).
NO_OFFSET = {"/stats/hits"}


def get(path, start, end, params=None):
    """GET an API path for a date range. Returns parsed JSON, or None on any
    failure so a single bad endpoint never aborts the whole run.

    Transient failures (connection errors, 5xx, rate limiting) are retried:
    a single blip used to abort the whole run and skip that day's snapshot.
    A 4xx is a request we got wrong, so it is not retried.
    """
    q = {"start": start.isoformat(), "end": end.isoformat()}
    q.update(params or {})
    url = f"{BASE}{path}"

    for attempt in range(3):
        if attempt:
            time.sleep(2 ** attempt)
        try:
            r = requests.get(url, headers=HEADERS, params=q, timeout=30)
        except requests.RequestException as e:
            print(f"[WARN] {path} [{start}..{end}]: request failed ({e})")
            continue
        time.sleep(0.25)  # stay well inside GoatCounter's rate limit
        if r.status_code == 200:
            try:
                return r.json()
            except ValueError:
                print(f"[WARN] {path} [{start}..{end}]: non-JSON response, skipping")
                return None
        print(f"[WARN] {path} [{start}..{end}]: HTTP {r.status_code} - {r.text[:200]}")
        # 404 is normally "we got the path wrong", but GoatCounter intermittently
        # answers a valid stats path with its HTML 404 page around the scheduled
        # run time; those runs aborted while a manual re-run minutes later
        # succeeded. It is retried like a 5xx, and still gives up after three.
        if r.status_code < 500 and r.status_code not in (404, 429):
            return None
    return None


def stats_list(path, start, end, limit=100, max_pages=10, extra=None):
    """Fetch a /stats/<x> list endpoint, paginating while the API reports
    `more: true`.

    /stats/hits is the one list endpoint that takes no `offset`, and
    GoatCounter rejects an unknown query parameter with a 400 rather than
    ignoring it — sending one there returned an HTML error page and left the
    "most viewed pages" panel empty. It is fetched as a single page instead.
    """
    paged = path not in NO_OFFSET
    out, offset = [], 0
    for _ in range(max_pages if paged else 1):
        params = {"limit": limit}
        params.update(extra or {})
        if paged:
            params["offset"] = offset
        data = get(path, start, end, params)
        if data is None:
            break
        # Each list endpoint names its payload differently: `stats` for the
        # dimension breakdowns, `hits` for pages, `refs` for the per-page
        # referrer detail.
        items = data.get("stats") or data.get("hits") or data.get("refs") or []
        if not items:
            # A 200 with nothing readable means the payload keys differ from
            # what we look for; print them so the next run can be diagnosed.
            print(f"[INFO] {path} [{start}..{end}]: no items; response keys = {sorted(data)}")
            break
        out.extend(items)
        if not data.get("more"):
            break
        offset += limit
    return out


def normalize(key, items):
    """Reduce an API list to the {name/path, count} shape the report reads."""
    if key == "pages":
        # `event` separates a real page from a tracked interaction (a CV
        # download, a DOI click); both arrive in the same /stats/hits list and
        # are split apart by the caller. `title` is the page title GoatCounter
        # recorded, which spares the report a hand-maintained path->label map.
        rows = [{"path": i.get("path"), "title": (i.get("title") or "").strip(),
                 "path_id": i.get("path_id"), "event": bool(i.get("event")),
                 "count": int(i.get("count") or 0)}
                for i in items if i.get("path")]
    elif key == "countries":
        rows = [{"code": i.get("id"), "name": i.get("name"), "count": int(i.get("count") or 0)}
                for i in items if i.get("id")]
    elif key == "referrers":
        rows = [{"name": i.get("name"), "count": int(i.get("count") or 0)}
                for i in items
                if i.get("name")
                and SITE_NAME not in i["name"]
                and "huguryildiz.com" not in i["name"]]
    else:
        rows = [{"name": i.get("name"), "count": int(i.get("count") or 0)}
                for i in items if i.get("name")]
    rows.sort(key=lambda r: r["count"], reverse=True)
    return rows


def province_key(name):
    """Fold a province name to a comparison key: lower-case, unaccented, and
    stripped of spaces and punctuation. 'Şanlıurfa', 'Sanliurfa' and
    'SANLIURFA' all reduce to 'sanliurfa'. The dotted capital İ needs the
    explicit substitution because casefolding it leaves a combining dot that
    NFKD then splits into its own character."""
    flat = unicodedata.normalize("NFKD", name.replace("İ", "I").replace("ı", "i"))
    flat = "".join(c for c in flat if not unicodedata.combining(c))
    return "".join(c for c in flat.lower() if c.isalnum())


TR_BY_KEY = {province_key(n): c for c, n in TR_PROVINCES.items()}
TR_BY_KEY.update(TR_ALIASES)


def window_bounds(days, offset):
    if days is None:
        return TRACKING_START, TODAY
    end = TODAY - timedelta(days=offset)
    return max(TRACKING_START, end - timedelta(days=days - 1)), end


def hour_profile(hits):
    """Fold the per-path hourly buckets into one 24-slot hour-of-day profile.

    /stats/hits returns hourly buckets unless `group` is set, so the numbers
    are already in the response used for the page ranking and this costs no
    extra request. The hours are in the site's own time zone as configured in
    GoatCounter — recorded alongside the profile so the report can name it
    instead of leaving the reader to guess.
    """
    hours = [0] * 24
    for hit in hits:
        for day in hit.get("stats") or []:
            for i, value in enumerate((day.get("hourly") or [])[:24]):
                hours[i] += int(value or 0)
    return hours


def attach_refs(pages, start, end):
    """Per-page referrer breakdown for the busiest pages.

    The site-wide referrer list answers "who links to the site"; this answers
    "who links to *this page*", which is the more useful question when one
    page dominates the ranking. Best-effort: a page without a stored path_id,
    or one the endpoint has nothing for, simply carries no `refs` key and the
    report omits its disclosure row.
    """
    for page in pages[:REF_PAGES]:
        path_id = page.get("path_id")
        if not path_id:
            continue
        refs = [{"name": r.get("name"), "count": int(r.get("count") or 0)}
                for r in stats_list("/stats/hits/%s" % path_id, start, end)
                if r.get("name")]
        refs.sort(key=lambda r: r["count"], reverse=True)
        refs = [r for r in refs if r["count"]][:5]
        if refs:
            page["refs"] = refs
    return pages


def fetch_page_series(start, end):
    """Daily series per page, stored once for the all-time window.

    The site-wide trend says when the site was busy; this says which page was
    busy then, which is what makes a spike interpretable. Requested with
    `group=day` because the default hourly buckets would be ~24x the rows for
    a resolution the chart never draws.
    """
    out = []
    for hit in stats_list("/stats/hits", start, end, extra={"group": "day"}):
        if hit.get("event") or not hit.get("path"):
            continue
        points = [{"date": d.get("day"), "views": int(d.get("daily") or 0)}
                  for d in (hit.get("stats") or []) if d.get("day")]
        if not points:
            continue
        out.append({"path": hit["path"], "title": (hit.get("title") or "").strip(),
                    "count": int(hit.get("count") or 0), "stats": points})
    out.sort(key=lambda r: r["count"], reverse=True)
    return out[:SERIES_PAGES]


def fetch_site_meta():
    """Site time zone, first recorded hit and retention setting.

    The hour-of-day panel is unreadable without knowing which clock it is on,
    and `data_retention` is worth publishing next to it: it states how long
    GoatCounter keeps the raw hits this report is derived from. All of it is
    optional — the API shape here is thinner than the stats endpoints, so a
    miss degrades to an absent field rather than a failed run.
    """
    meta = {}
    # Not routed through get(): that helper always sends start/end, and this
    # endpoint rejects an unknown query parameter with a 400 rather than
    # ignoring it — the same trap documented on /stats/hits and `offset`.
    try:
        r = requests.get(BASE + "/sites", headers=HEADERS, timeout=30)
        data = r.json() if r.status_code == 200 else {}
    except (requests.RequestException, ValueError) as e:
        print("[WARN] /sites: %s" % e)
        return meta
    sites = (data or {}).get("sites") or []
    site = next((s for s in sites if s.get("code") == SITE_NAME), sites[0] if sites else None)
    if not site:
        return meta
    # `timezone` used to be an object with a `Zone` field; the API now returns
    # the zone name as a plain string. Both shapes are read so neither a stale
    # nor a current response blanks the panel — and so a shape change cannot
    # crash the run again.
    tz = (site.get("user_defaults") or {}).get("timezone")
    zone = tz.get("Zone") if isinstance(tz, dict) else tz
    # The string form carries GoatCounter's country prefix ("TR.Europe/Istanbul");
    # the panel prints this verbatim, so only the IANA name is kept.
    if isinstance(zone, str) and "." in zone and "/" in zone:
        zone = zone.split(".", 1)[1]
    if zone and isinstance(zone, str):
        meta["timezone"] = zone
    if site.get("first_hit_at"):
        meta["first_hit_at"] = site["first_hit_at"]
    # The field is misspelled "setttings" in the API response, and has been
    # for as long as the v0 schema has existed; both spellings are read so a
    # future correction upstream does not silently blank the panel.
    settings = site.get("setttings") or site.get("settings") or {}
    if settings.get("data_retention") is not None:
        meta["data_retention_days"] = int(settings["data_retention"])
    return meta


def fetch_window(label, days, offset):
    """Build one window block. Returns (block, raw_total) or (None, None)."""
    start, end = window_bounds(days, offset)
    total = get("/stats/total", start, end)
    if total is None:
        return None, None

    block = {
        "label": label,
        "start": start.isoformat(),
        "end": end.isoformat(),
        "pageviews": int(total.get("total") or 0),
    }

    # One /stats/hits response feeds three panels: the page ranking, the
    # tracked-interaction ranking, and the hour-of-day profile.
    hits = stats_list("/stats/hits", start, end)
    rows = normalize("pages", hits)
    pages = [r for r in rows if not r["event"]]
    events = [r for r in rows if r["event"]]
    block["pages_total"] = len(pages)
    block["pages"] = attach_refs(pages[:LIST_CAP], start, end)
    block["events_total"] = len(events)
    block["events"] = events[:LIST_CAP]
    block["hourly"] = hour_profile(hits)

    for key, path in DIMENSIONS:
        rows = normalize(key, stats_list(path, start, end))
        block[key + "_total"] = len(rows)
        block[key] = rows if key in UNCAPPED else rows[:LIST_CAP]

    regions, unmatched = fetch_regions(block["countries"], start, end)
    block["regions_total"] = len(regions)
    # Turkish rows are kept in full because the province map paints every one of
    # them; the rest of the world stays capped, as only the ranked list reads it.
    block["regions"] = regions[:LIST_CAP] + [
        r for r in regions[LIST_CAP:] if r["country_code"] == "TR" and r["code"]]
    block["regions_unmatched"] = unmatched

    return block, total


def fetch_regions(countries, start, end):
    """Sub-country regions for the busiest countries.

    GoatCounter resolves visitors to a country and, below it, an ISO 3166-2
    region — it has no city data at all (upstream request: arp242/goatcounter
    issue 850). For Turkey a region is a province, which is the closest this
    source gets to a city breakdown. The detail endpoint is best-effort: if it
    returns nothing, the report simply omits the panel.

    Returns (rows, unmatched). GoatCounter sends no ISO code for a region, only
    a name, so Turkish rows are matched to a province code by name; whatever
    fails to match is returned alongside rather than dropped, so a name the
    table does not know shows up in the snapshot instead of silently vanishing
    from the map.
    """
    out, unmatched = [], []
    for country in countries[:REGION_COUNTRIES]:
        cc = country.get("code")
        if not cc:
            continue
        for item in stats_list(f"/stats/locations/{cc}", start, end):
            name = (item.get("name") or item.get("id") or "").strip()
            count = int(item.get("count") or 0)
            if not name or not count:
                continue
            # The detail endpoint repeats the country row itself; skip it.
            if name == country.get("name"):
                continue
            code = item.get("id")
            if cc == "TR":
                code = TR_BY_KEY.get(province_key(name))
                if code:
                    name = TR_PROVINCES[code]
                else:
                    unmatched.append({"name": name, "country": cc, "count": count})
            out.append({"name": name, "country": country.get("name"),
                        "country_code": cc, "code": code, "count": count})
    out.sort(key=lambda r: r["count"], reverse=True)
    unmatched.sort(key=lambda r: r["count"], reverse=True)
    return out, unmatched


windows, all_raw = {}, None
for key, label, days, offset in WINDOWS:
    print(f"[..] window {key} ({label})")
    block, raw = fetch_window(label, days, offset)
    if block is None:
        if key == "all":
            sys.exit("ERROR: could not fetch the all-time window; aborting to avoid overwriting good data.")
        print(f"[WARN] window {key}: skipped")
        continue
    windows[key] = block
    if key == "all":
        all_raw = raw

# ---- daily series ---------------------------------------------------------
# Trimmed to the first day with recorded activity: the account was created
# well after TRACKING_START, and the empty prefix is both misleading in a
# "tracked since" line and the bulk of the file.
series = [{"date": d.get("day"), "views": int(d.get("daily") or 0)}
          for d in (all_raw.get("stats") or []) if d.get("day")]
first = next((i for i, p in enumerate(series) if p["views"] > 0), 0)
timeseries = series[first:]
tracked_since = timeseries[0]["date"] if timeseries else TRACKING_START.isoformat()

all_win = windows["all"]
out = {
    "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "range": {"start": tracked_since, "end": TODAY.isoformat()},
    "window_order": [key for key, _, _, _ in WINDOWS if key in windows],
    "windows": windows,
    "timeseries": timeseries,
    # Per-page daily series, stored once: the panel that draws it always
    # plots the full tracked period, so a copy per window would be dead weight.
    "page_series": fetch_page_series(*window_bounds(None, 0)),
    "site": fetch_site_meta(),
    # Flat mirror of the all-time window, kept for anything reading the
    # pre-window shape of this file.
    "totals": {"pageviews": all_win["pageviews"], "visitors": None},
    "pages": all_win["pages"],
    "countries": all_win["countries"],
    "referrers": all_win["referrers"],
    "browsers": all_win["browsers"],
    "systems": all_win["systems"],
    "sizes": all_win["sizes"],
}

if all_win["pageviews"] == 0:
    sys.exit("ERROR: all-time pageviews is 0. Check the API token / site.")

os.makedirs("_data", exist_ok=True)
with open("_data/site_stats.json", "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)

for key in out["window_order"]:
    w = windows[key]
    print(f"[OK] {key:>4}: views={w['pageviews']} pages={w['pages_total']} "
          f"events={w['events_total']} countries={w['countries_total']} refs={w['referrers_total']} "
          f"browsers={w['browsers_total']} systems={w['systems_total']} sizes={w['sizes_total']} "
          f"langs={w['languages_total']}")
print(f"[OK] tracked since {tracked_since}, {len(timeseries)} days of series")
print(f"[OK] per-page series for {len(out['page_series'])} pages; site meta: {out['site'] or 'unavailable'}")
print("[OK] Saved _data/site_stats.json")
