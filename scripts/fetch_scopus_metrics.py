#!/usr/bin/env python3
"""
Fetch Scopus author metrics using Elsevier Scopus Author Retrieval API
and write them into _data/scopus.json for Jekyll (GitHub Pages).
"""

import os
import json
import time
from pathlib import Path
import requests


API_URL = "https://api.elsevier.com/content/author/author_id/"


def fetch_metrics(api_key: str, author_id: str) -> dict:
    """
    Call Scopus Author Retrieval API and return JSON response.
    """
    url = f"{API_URL}{author_id}"

    headers = {
        "Accept": "application/json",
        "X-ELS-APIKey": api_key,
    }

    params = {"view": "METRICS"}

    response = requests.get(url, headers=headers, params=params, timeout=30)

    if response.status_code == 429:
        # Handle rate limiting
        time.sleep(10)
        response = requests.get(url, headers=headers, params=params, timeout=30)

    response.raise_for_status()
    return response.json()


def safe_int(x, default=0) -> int:
    """
    Convert to int safely (Scopus sometimes returns numbers as strings).
    """
    try:
        return int(x)
    except (TypeError, ValueError):
        return default


def extract_data(api_response: dict) -> dict:
    """
    Extract citation metrics from API response.
    """
    core = api_response["author-retrieval-response"][0]["coredata"]

    return {
        "source": "Scopus (Elsevier API)",
        "updated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "author_name": core.get("dc:creator"),
        "document_count": safe_int(core.get("document-count")),
        "cited_by_count": safe_int(core.get("cited-by-count")),
        "h_index": safe_int(core.get("h-index")),
    }


def main():
    api_key = os.environ["SCOPUS_API_KEY"]
    author_id = os.environ["SCOPUS_AUTHOR_ID"]  # 56242674200 in your GitHub Secrets

    api_response = fetch_metrics(api_key, author_id)
    metrics = extract_data(api_response)

    output_path = Path("_data/scopus.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print("Scopus metrics updated successfully.")


if __name__ == "__main__":
    main()