import requests
import json
from datetime import datetime, timezone

AUTHOR_ID = "A0000001556-2634"  # Senin OpenAlex ID

url = f"https://api.openalex.org/authors/{AUTHOR_ID}"
response = requests.get(url, timeout=10)
data = response.json()

metrics = {
    "citations": data.get("cited_by_count", 0),
    "works": data.get("works_count", 0),
    "h_index": data.get("summary_stats", {}).get("h_index", 0),
    "updated_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "profile_url": f"https://openalex.org/{AUTHOR_ID}"
}

with open("_data/research_metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

print("OpenAlex metrics updated successfully.")