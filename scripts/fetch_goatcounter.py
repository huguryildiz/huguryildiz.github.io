"""Fetch aggregated GoatCounter statistics into _data/site_stats.json.

The /stats/ report lets a reader switch between preset and arbitrary date
ranges. Presets are queried directly, while ``daily_breakdowns`` stores one
small, exact aggregate per site-calendar day. The browser can therefore merge the daily
blocks for a custom range without exposing raw hits or falling back to
all-time figures.

GoatCounter reports tracked events in the same totals and hit list as real
page views. This script separates them before it computes page-view totals,
daily trends, and hourly profiles; clicks never inflate a page-view KPI.

Requires GOATCOUNTER_API_TOKEN. Run by .github/workflows/update-goatcounter.yml.
"""

import os, sys, json, time, unicodedata, requests
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

TOKEN = os.getenv("GOATCOUNTER_API_TOKEN", "").strip()
if not TOKEN:
    sys.exit("ERROR: GOATCOUNTER_API_TOKEN env var is missing.")

SITE = "huguryildiz.goatcounter.com"
SITE_NAME = SITE.split(".goatcounter.com")[0]
BASE = f"https://{SITE}/api/v0"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

TRACKING_START = date(2019, 1, 1)
SITE_TIMEZONE = os.getenv("GOATCOUNTER_SITE_TIMEZONE", "Europe/Istanbul").strip()
try:
    SITE_ZONE = ZoneInfo(SITE_TIMEZONE)
except ZoneInfoNotFoundError:
    sys.exit(f"ERROR: unknown GOATCOUNTER_SITE_TIMEZONE: {SITE_TIMEZONE}")
TODAY = datetime.now(SITE_ZONE).date()

# A clean first run needs seven API calls per tracked day: hits plus six
# dimension lists. Keep the bootstrap batch below the provider's rate-limit
# window; each successful run commits the batch, so later runs can continue
# from the remaining gap instead of repeating an uncommitted full backfill.
DAILY_CALL_BUDGET = int(os.getenv("GOATCOUNTER_DAILY_CALL_BUDGET", "280"))
DAILY_CALLS_PER_DAY = 1 + 6
DAILY_REFRESH_DAYS = 2
REQUEST_DELAY_SECONDS = float(os.getenv("GOATCOUNTER_REQUEST_DELAY_SECONDS", "0.5"))

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

# These lists partition page views and therefore must sum to the same total as
# the non-event /stats/hits rows. Screen sizes are optional in GoatCounter, but
# when present they must reconcile as well.
COMPLETE_PAGEVIEW_DIMENSIONS = ("pages", "countries", "browsers", "systems", "languages")
OPTIONAL_PAGEVIEW_DIMENSIONS = ("sizes",)

# Ranked lists remain complete in the snapshot; the page itself decides how
# many rows to display. Keeping the tail is what lets a merged custom range
# produce a correct ranking and distinct-country count.
LIST_CAP = 12
UNCAPPED = {key for key, _ in DIMENSIONS}
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
    # The API accepts timestamps, and its end bound is a time rather than an
    # inclusive calendar date. Sending the same bare YYYY-MM-DD for both ends
    # produces an empty interval on /stats/total and /stats/hits. The dimension
    # endpoints then convert these timestamps back to the site's calendar date,
    # so UTC 23:59 would become the next day in Istanbul and silently widen
    # only those endpoints. Site-zone boundaries keep both endpoint families
    # on one interval.
    start_at = datetime.combine(start, datetime.min.time(), SITE_ZONE)
    end_at = datetime.combine(end, datetime.max.time().replace(microsecond=0), SITE_ZONE)
    q = {
        "start": start_at.isoformat(timespec="seconds"),
        "end": end_at.isoformat(timespec="seconds"),
    }
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
        time.sleep(REQUEST_DELAY_SECONDS)  # stay below GoatCounter's 4 req/s limit
        if r.status_code == 200:
            try:
                return r.json()
            except ValueError:
                print(f"[WARN] {path} [{start}..{end}]: non-JSON response, skipping")
                return None
        print(f"[WARN] {path} [{start}..{end}]: HTTP {r.status_code} - {r.text[:200]}")
        if r.status_code == 429:
            reset = r.headers.get("X-Rate-Limit-Reset") or r.headers.get("Retry-After")
            if reset:
                print(f"[WARN] GoatCounter rate limit reset hint: {reset}; skipping this request")
            return None
        # 404 is normally "we got the path wrong", but GoatCounter intermittently
        # answers a valid stats path with its HTML 404 page around the scheduled
        # run time; those runs aborted while a manual re-run minutes later
        # succeeded. It is retried like a 5xx, and still gives up after three.
        if r.status_code < 500 and r.status_code not in (404, 429):
            return None
    return None


def stats_list(path, start, end, limit=100, max_pages=10, extra=None, strict=False):
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
            if strict:
                return None
            break
        # Each list endpoint names its payload differently: `stats` for the
        # dimension breakdowns, `hits` for pages, `refs` for the per-page
        # referrer detail.
        payload_keys = ("stats", "hits", "refs")
        items = data.get("stats") or data.get("hits") or data.get("refs") or []
        if not items:
            # A 200 with nothing readable means the payload keys differ from
            # what we look for; print them so the next run can be diagnosed.
            print(f"[INFO] {path} [{start}..{end}]: no items; response keys = {sorted(data)}")
            if strict and not any(key in data for key in payload_keys):
                return None
            break
        out.extend(items)
        if not data.get("more"):
            break
        if not paged:
            print(f"[WARN] {path} [{start}..{end}]: response is truncated but endpoint takes no offset")
            if strict:
                return None
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


def pageview_path_filter(pages):
    """Limit dimension endpoints to non-event paths from /stats/hits.

    GoatCounter's browser, system, location, language, size, and referrer
    endpoints include tracked events unless ``include_paths`` is supplied.
    Returning None for a malformed hit row prevents an unfiltered request from
    silently mixing event clicks into a page-view breakdown.
    """
    ids = [page.get("path_id") for page in pages]
    if any(path_id is None for path_id in ids):
        return None
    return {"include_paths": [str(path_id) for path_id in ids]}


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
        if hit.get("event"):
            continue
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
    hits = stats_list("/stats/hits", start, end, extra={"group": "day"}, strict=True)
    if hits is None:
        return out
    for hit in hits:
        if hit.get("event") or not hit.get("path"):
            continue
        points = [{"date": d.get("day"), "views": int(d.get("daily") or 0)}
                  for d in (hit.get("stats") or []) if d.get("day")]
        if not points:
            continue
        first = next((i for i, point in enumerate(points) if point["views"] > 0), len(points))
        if first == len(points):
            continue
        points = points[first:]
        out.append({"path": hit["path"], "title": (hit.get("title") or "").strip(),
                    "count": int(hit.get("count") or 0), "stats": points})
    out.sort(key=lambda r: r["count"], reverse=True)
    return out[:SERIES_PAGES]


def daily_series_from_hits(hits):
    """Merge per-path daily buckets into a page-view-only site series."""
    by_day = {}
    for hit in hits:
        if hit.get("event"):
            continue
        for point in hit.get("stats") or []:
            day = point.get("day")
            if day:
                by_day[day] = by_day.get(day, 0) + int(point.get("daily") or 0)
    return [{"date": day, "views": by_day[day]} for day in sorted(by_day)]


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
    """Build one preset window block.

    The total endpoint remains a required health check and supplies no public
    count: its ``total`` includes events. Page-view totals are derived from the
    non-event hit rows, the same rows shown in the readership panel.
    """
    start, end = window_bounds(days, offset)
    total = get("/stats/total", start, end)
    if total is None:
        return None, None, None

    block = {
        "label": label,
        "start": start.isoformat(),
        "end": end.isoformat(),
        "pageviews": 0,
    }

    # One /stats/hits response feeds three panels: the page ranking, the
    # tracked-interaction ranking, and the hour-of-day profile.
    hits = stats_list("/stats/hits", start, end, strict=True)
    if hits is None:
        return None, None, None
    rows = normalize("pages", hits)
    pages = [r for r in rows if not r["event"]]
    events = [r for r in rows if r["event"]]
    page_filter = pageview_path_filter(pages)
    if pages and page_filter is None:
        return None, None, None
    block["pages_total"] = len(pages)
    block["pages"] = attach_refs(pages, start, end)
    block["events_total"] = len(events)
    block["events"] = events
    block["pageviews"] = sum(r["count"] for r in pages)
    block["hourly"] = hour_profile(hits)

    for key, path in DIMENSIONS:
        rows = normalize(key, stats_list(path, start, end, extra=page_filter)) if pages else []
        block[key + "_total"] = len(rows)
        block[key] = rows if key in UNCAPPED else rows[:LIST_CAP]

    regions, unmatched = fetch_regions(block["countries"], start, end, page_filter)
    block["regions_total"] = len(regions)
    # Turkish rows are kept in full because the province map paints every one of
    # them; the rest of the world stays capped, as only the ranked list reads it.
    block["regions"] = regions[:LIST_CAP] + [
        r for r in regions[LIST_CAP:] if r["country_code"] == "TR" and r["code"]]
    block["regions_unmatched"] = unmatched

    return block, total, hits


def fetch_daily_breakdown(day):
    """Fetch one exact site-calendar-day block used for custom ranges."""
    hits = stats_list("/stats/hits", day, day, strict=True)
    if hits is None:
        return None
    rows = normalize("pages", hits)
    pages = [r for r in rows if not r["event"]]
    events = [r for r in rows if r["event"]]
    page_filter = pageview_path_filter(pages)
    if pages and page_filter is None:
        return None
    block = {
        "pageviews": sum(r["count"] for r in pages),
        "pages": pages,
        "events": events,
        "hourly": hour_profile(hits),
    }
    for key, path in DIMENSIONS:
        if not pages:
            block[key] = []
            continue
        items = stats_list(path, day, day, extra=page_filter, strict=True)
        if items is None:
            return None
        block[key] = normalize(key, items)
    return block


def pageview_breakdown_mismatches(block):
    """Return page-view dimensions whose row sums disagree with the KPI."""
    expected = int(block.get("pageviews") or 0)
    mismatches = {}
    for key in COMPLETE_PAGEVIEW_DIMENSIONS + OPTIONAL_PAGEVIEW_DIMENSIONS:
        rows = block.get(key) or []
        if key in OPTIONAL_PAGEVIEW_DIMENSIONS and not rows:
            continue
        actual = sum(int(row.get("count") or 0) for row in rows)
        if actual != expected:
            mismatches[key] = actual
    return mismatches


def load_daily_cache():
    try:
        with open("_data/site_stats.json", encoding="utf-8") as f:
            old = json.load(f)
    except (OSError, ValueError):
        return {}
    cache = old.get("daily_breakdowns")
    return cache if isinstance(cache, dict) else {}


def refresh_daily_cache(cache, first_day, last_day):
    """Fill missing days and refresh the newest two within a hard call cap."""
    wanted = []
    cursor = first_day
    while cursor <= last_day:
        key = cursor.isoformat()
        if key not in cache or (last_day - cursor).days < DAILY_REFRESH_DAYS:
            wanted.append(cursor)
        cursor += timedelta(days=1)

    max_days = DAILY_CALL_BUDGET // DAILY_CALLS_PER_DAY
    if len(wanted) > max_days:
        # Prefer recent dates: they are the most likely custom ranges and the
        # oldest missing dates can be filled by subsequent scheduled runs.
        print(f"[WARN] daily backfill needs {len(wanted) * DAILY_CALLS_PER_DAY} calls; "
              f"budget is {DAILY_CALL_BUDGET}. Fetching the newest {max_days} days.")
        wanted = wanted[-max_days:]

    for i, day in enumerate(wanted, 1):
        print(f"[..] daily {day.isoformat()} ({i}/{len(wanted)})")
        block = fetch_daily_breakdown(day)
        # A day is cached only as a complete unit; an endpoint failure leaves
        # the date absent, so the browser shows "unavailable" rather than a
        # partial result as though it were exact.
        if block is None:
            print(f"[WARN] daily {day}: incomplete endpoint set; not caching")
            continue
        if sum(block["hourly"]) != block["pageviews"]:
            print(f"[WARN] daily {day}: hourly/page-view mismatch; not caching")
            continue
        mismatches = pageview_breakdown_mismatches(block)
        if mismatches:
            # GoatCounter may omit a dimension value (or report a different
            # visitor/page-view basis) even when the page-view-only hourly
            # series is complete. Keep the exact temporal/page/event block;
            # the browser will mark only the affected breakdown unavailable.
            print(f"[WARN] daily {day}: breakdown/page-view mismatch {mismatches}; caching temporal block")
        cache[day.isoformat()] = block
    return {key: cache[key] for key in sorted(cache) if first_day.isoformat() <= key <= last_day.isoformat()}


def fetch_regions(countries, start, end, page_filter):
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
        for item in stats_list(f"/stats/locations/{cc}", start, end, extra=page_filter):
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


def main():
    site_meta = fetch_site_meta()
    reported_zone = site_meta.get("timezone")
    if reported_zone and reported_zone != SITE_TIMEZONE:
        sys.exit(f"ERROR: GoatCounter reports timezone {reported_zone}, but the collector is configured "
                 f"for {SITE_TIMEZONE}. Set GOATCOUNTER_SITE_TIMEZONE before collecting.")

    windows, all_hits = {}, None
    for key, label, days, offset in WINDOWS:
        print(f"[..] window {key} ({label})")
        block, _, hits = fetch_window(label, days, offset)
        if block is None:
            if key == "all":
                sys.exit("ERROR: could not fetch the all-time window; aborting to avoid overwriting good data.")
            print(f"[WARN] window {key}: skipped")
            continue
        windows[key] = block
        if key == "all":
            all_hits = hits

    # The API's total series includes tracked events. Merge only non-event hit
    # rows, then trim the empty prefix from before the first real page view.
    series = daily_series_from_hits(all_hits or [])
    first = next((i for i, p in enumerate(series) if p["views"] > 0), 0)
    timeseries = series[first:]
    tracked_since = timeseries[0]["date"] if timeseries else TRACKING_START.isoformat()

    # Backfill the exact daily blocks once, then refresh just the newest two on
    # ordinary scheduled runs. A fully covered cache becomes the authoritative
    # site-calendar daily series used by the KPI row and custom-range breakdowns.
    daily_breakdowns = refresh_daily_cache(
        load_daily_cache(), date.fromisoformat(tracked_since), TODAY)
    expected_days = (TODAY - date.fromisoformat(tracked_since)).days + 1
    if len(daily_breakdowns) == expected_days:
        timeseries = [{"date": day, "views": int(block.get("pageviews") or 0)}
                      for day, block in daily_breakdowns.items()]
    else:
        print(f"[WARN] daily detail covers {len(daily_breakdowns)}/{expected_days} days; "
              "custom detailed panels remain unavailable across gaps")

    all_win = windows["all"]
    out = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "range": {"start": tracked_since, "end": TODAY.isoformat()},
        "window_order": [key for key, _, _, _ in WINDOWS if key in windows],
        "windows": windows,
        "timeseries": timeseries,
        "daily_breakdowns": daily_breakdowns,
        # Per-page daily series is stored once; the panel always plots the full
        # tracked period, so a copy per window would be dead weight.
        "page_series": fetch_page_series(*window_bounds(None, 0)),
        "site": site_meta,
        # Flat mirror of all-time data for older readers of this file.
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

    for key, block in windows.items():
        if sum(block.get("hourly") or []) != block["pageviews"]:
            sys.exit(f"ERROR: {key} hourly total does not equal its page-view total; snapshot not written.")
        mismatches = pageview_breakdown_mismatches(block)
        if mismatches:
            print(f"[WARN] {key} breakdown totals {mismatches} do not equal page-view total "
                  f"{block['pageviews']}; affected breakdowns will be unavailable")

    # When every day is available, preset totals must equal the sum of those
    # same daily blocks. This catches boundary drift before it reaches the KPI.
    if len(daily_breakdowns) == expected_days:
        for key, _, days, offset in WINDOWS:
            if key not in windows:
                continue
            start, end = window_bounds(days, offset)
            start = max(start, date.fromisoformat(tracked_since))
            expected = sum(block["pageviews"] for day, block in daily_breakdowns.items()
                           if start.isoformat() <= day <= end.isoformat())
            if expected != windows[key]["pageviews"]:
                sys.exit(f"ERROR: {key} page-view total {windows[key]['pageviews']} "
                         f"does not match daily sum {expected}; snapshot not written.")

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
    print(f"[OK] daily detail for {len(daily_breakdowns)}/{expected_days} tracked days")
    print(f"[OK] per-page series for {len(out['page_series'])} pages; site meta: {out['site'] or 'unavailable'}")
    print("[OK] Saved _data/site_stats.json")


if __name__ == "__main__":
    main()
