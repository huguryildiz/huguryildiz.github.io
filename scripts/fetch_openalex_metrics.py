import os
import requests
import json
from datetime import datetime, timezone

# -------------------------------------------------
# Configuration
# -------------------------------------------------

AUTHOR_ID = os.getenv("OPENALEX_AUTHOR_ID")

if not AUTHOR_ID:
    raise ValueError("OPENALEX_AUTHOR_ID environment variable is not set.")

AUTHOR_ID = AUTHOR_ID.strip()

API_URL = f"https://api.openalex.org/authors/{AUTHOR_ID}"

# -------------------------------------------------
# Fetch data
# -------------------------------------------------

print(f"Fetching OpenAlex data for Author ID: {AUTHOR_ID}")

response = requests.get(API_URL, timeout=15)

if response.status_code != 200:
    raise RuntimeError(f"OpenAlex API error: {response.status_code}")

data = response.json()

# -------------------------------------------------
# Extract metrics
# -------------------------------------------------

citations = data.get("cited_by_count", 0)
works = data.get("works_count", 0)

summary = data.get("summary_stats", {})
h_index = summary.get("h_index", 0)
i10_index = summary.get("i10_index", 0)

# Safety check — prevent writing empty/invalid data
if works == 0 and citations == 0:
    raise RuntimeError("OpenAlex returned zero metrics. Check Author ID.")

metrics = {
    "citations": citations,
    "works": works,
    "h_index": h_index,
    "i10_index": i10_index,
    "updated_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "profile_url": data.get("id", f"https://openalex.org/{AUTHOR_ID}")
}

# -------------------------------------------------
# Write JSON
# -------------------------------------------------

output_path = "_data/research_metrics.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=2)

print("OpenAlex metrics updated successfully.")
print(json.dumps(metrics, indent=2))