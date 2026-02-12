import os, json, sys, requests
from datetime import datetime, timezone

AUTHOR_ID = os.getenv("OPENALEX_AUTHOR_ID", "").strip()
MAILTO    = os.getenv("OPENALEX_MAILTO", "").strip()

if not AUTHOR_ID:
    sys.exit("ERROR: OPENALEX_AUTHOR_ID env var is missing.")

if AUTHOR_ID.startswith("http"):
    AUTHOR_ID = AUTHOR_ID.rstrip("/").split("/")[-1]

AUTHOR_ID = AUTHOR_ID.upper()
print(f"[INFO] Author ID: {AUTHOR_ID}")

url = f"https://api.openalex.org/authors/{AUTHOR_ID}"
params = {"mailto": MAILTO} if MAILTO else {}
r = requests.get(url, params=params, timeout=30)
print(f"[INFO] Status: {r.status_code}")

if r.status_code == 404:
    sys.exit(f"ERROR: {AUTHOR_ID} not found on OpenAlex.")
if r.status_code != 200:
    sys.exit(f"ERROR: {r.status_code} - {r.text[:300]}")

data     = r.json()
works    = int(data.get("works_count") or 0)
cites    = int(data.get("cited_by_count") or 0)
h_index  = int((data.get("summary_stats") or {}).get("h_index") or 0)
name     = data.get("display_name", "")

print(f"[OK] {name}: works={works}, citations={cites}, h_index={h_index}")

if works == 0 and cites == 0 and h_index == 0:
    sys.exit("ERROR: All metrics are zero. Check your Author ID.")

metrics = {
    "citations":    cites,
    "works":        works,
    "h_index":      h_index,
    "updated_utc":  datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "profile_url":  f"https://openalex.org/{AUTHOR_ID}",
    "display_name": name,
}

os.makedirs("_data", exist_ok=True)
with open("_data/research_metrics.json", "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=2)

print("[OK] Saved _data/research_metrics.json")
print(json.dumps(metrics, indent=2))