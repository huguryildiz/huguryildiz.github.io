#!/usr/bin/env python3
"""
Fetch Scopus author metrics using Elsevier Scopus Author Retrieval API
and write them into _data/scopus.json for Jekyll (GitHub Pages).

This version outputs a UI-friendly schema:
- citations
- h_index
- works
- profile_url
- updated_utc
(+ source, author_name)
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

    # METRICS view typically includes document count, cited-by count, and h-index.
    params = {"view": "METRICS"}

    response = requests.get(url, headers=headers, params=params, timeout=30)

    # Handle rate limiting (HTTP 429)
    if response.status_code == 429:
        retry_after = int(response.headers.get("Retry-After", "10"))
        time.sleep(retry_after)
        response = requests.get(url, headers=headers, params=params, timeout=30)

    response.raise_for_status()
    return response.json()


def safe_int(value, default: int = 0) -> int:
    """
    Convert a value to int safely.
    Scopus may return numeric fields as strings.
    """
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def extract_data(api_response: dict, author_id: str) -> dict:
    """
    Extract citation metrics from API response and map them
    to a UI-friendly JSON schema used by the website.
    """
    core = api_response["author-retrieval-response"][0]["coredata"]

    return {
        "citations": safe_int(core.get("cited-by-count")),
        "h_index": safe_int(core.get("h-index")),
        "works": safe_int(core.get("document-count")),
        "profile_url": f"https://www.scopus.com/authid/detail.uri?authorId={author_id}",
        "updated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "Scopus (Elsevier API)",
        "author_name": core.get("dc:creator"),
    }


def main() -> None:
    """
    Main entry point. Reads secrets from environment variables (GitHub Actions),
    fetches metrics, and writes _data/scopus.json.
    """
    api_key = os.environ["SCOPUS_API_KEY"]
    author_id = os.environ["SCOPUS_AUTHOR_ID"]  # e.g., 56242674200

    api_response = fetch_metrics(api_key, author_id)
    metrics = extract_data(api_response, author_id)

    output_path = Path("_data/scopus.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print(f"Scopus metrics updated successfully -> {output_path}")


if __name__ == "__main__":
    main()