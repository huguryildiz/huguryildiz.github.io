import os
import json
import requests
from datetime import datetime, timezone

AUTHOR_ID = os.getenv("OPENALEX_AUTHOR_ID", "").strip()
MAILTO = os.getenv("OPENALEX_MAILTO", "").strip()  # optional but recommended by OpenAlex

if not AUTHOR_ID:
    raise SystemExit("ERROR: OPENALEX_AUTHOR_ID env var is missing.")

# Accept both "A508..." and full URL
if AUTHOR_ID.startswith("http"):
    AUTHOR_ID = AUTHOR_ID.rstrip("/").split("/")[-1]

# Must look like A##########
if not (AUTHOR_ID.startswith("A") and AUTHOR_ID[1:].isdigit()):
    raise SystemExit(f"ERROR: OPENALEX_AUTHOR_ID must look like 'A##########'. Got: {AUTHOR_ID}")

url = f"https://api.openalex.org/authors/{AUTHOR_ID}"
params = {}
if MAILTO:
    params["mailto"] = MAILTO

headers = {
    "User-Agent": "huguryildiz.com OpenAlex metrics fetcher"
}

print(f"[INFO] Fetching: {url}  params={params}")

r = requests.get(url, params=params, headers=headers, timeout=30)
print(f"[INFO] Status: {r.status_code}")

if r.status_code != 200:
    raise SystemExit(f"ERROR: OpenAlex API returned {r.status_code}: {r.text[:300]}")

data = r.json()

works = int(data.get("works_count") or 0)
cites = int(data.get("cited_by_count") or 0)
h_index = int((data.get("summary_stats") or {}).get("h_index") or 0)
display_name = data.get("display_name", "")
openalex_id = data.get("id", "")

print(f"[INFO] display_name={display_name}")
print(f"[INFO] openalex_id={openalex_id}")
print(f"[INFO] works={works} cites={cites} h_index={h_index}")

# If everything is zero, fail so workflow cannot "succeed" silently
if works == 0 and cites == 0 and h_index == 0:
    raise SystemExit(
        "ERROR: Metrics are all zero. Wrong author ID or unexpected API response.\n"
        f"DEBUG display_name={display_name}, id={openalex_id}"
    )

metrics = {
    "citations": cites,
    "works": works,
    "h_index": h_index,
    "updated_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "profile_url": f"https://openalex.org/{AUTHOR_ID}",
    "display_name": display_name,
}

os.makedirs("_data", exist_ok=True)
out_path = "_data/research_metrics.json"

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=2, ensure_ascii=False)

print("[OK] Wrote _data/research_metrics.json:")
print(json.dumps(metrics, indent=2, ensure_ascii=False))