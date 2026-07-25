"""Append GoatCounter's raw hit export to a permanent local archive.

Everything else in this repository reads GoatCounter's *aggregates*, which the
service computes server-side and which therefore only exist for as long as it
keeps the underlying hits. This script keeps the hits themselves: it asks for
an export starting just after the last hit already archived, downloads it, and
writes it into `analytics-archive/goatcounter/` without touching anything
previously stored. The archive is append-only by construction — a file, once
written, is never rewritten.

That makes the archive the durable record and the API the transport. Should
the account's retention change, the site move to another counter, or a
breakdown be wanted that GoatCounter does not compute, the raw rows are still
here to derive it from.

The archive is excluded from the Jekyll build (`_config.yml`), so it never
becomes a public URL, and it lives outside `_data/` so Jekyll does not parse
it on every build.

Requires GOATCOUNTER_API_TOKEN. Not wired to a workflow — run it when you want
a checkpoint, then inspect and commit the diff.
"""

import os
import sys
import csv
import gzip
import json
import time

import requests

TOKEN = os.getenv("GOATCOUNTER_API_TOKEN", "").strip()
if not TOKEN:
    sys.exit("ERROR: GOATCOUNTER_API_TOKEN env var is missing.")

SITE = "huguryildiz.goatcounter.com"
BASE = f"https://{SITE}/api/v0"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

ARCHIVE = os.path.join("analytics-archive", "goatcounter")
STATE = os.path.join(ARCHIVE, "state.json")

# The export is prepared in the background; these bound the wait.
POLL_SECONDS = 3
POLL_ATTEMPTS = 40


def load_state():
    """Cursor of the last archived hit. Absent on the first run, which is what
    makes that run fetch the entire history."""
    try:
        with open(STATE, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def start_export(last_hit_id):
    """Ask for a CSV export of everything after `last_hit_id`."""
    body = {"format": "csv"}
    if last_hit_id:
        body["start_from_hit_id"] = int(last_hit_id)
    r = requests.post(f"{BASE}/export", headers=HEADERS, json=body, timeout=30)
    if r.status_code >= 400:
        sys.exit(f"ERROR: could not start export: HTTP {r.status_code} - {r.text[:300]}")
    return r.json()


def wait_for(export_id):
    """Poll until the export reports a finish time or an error."""
    for _ in range(POLL_ATTEMPTS):
        r = requests.get(f"{BASE}/export/{export_id}", headers=HEADERS, timeout=30)
        if r.status_code >= 400:
            sys.exit(f"ERROR: export status: HTTP {r.status_code} - {r.text[:300]}")
        info = r.json()
        if info.get("error"):
            sys.exit(f"ERROR: export failed: {info['error']}")
        if info.get("finished_at"):
            return info
        time.sleep(POLL_SECONDS)
    sys.exit("ERROR: export did not finish in time; nothing was written.")


def download(export_id):
    r = requests.get(f"{BASE}/export/{export_id}/download", headers=HEADERS, timeout=120)
    if r.status_code >= 400:
        sys.exit(f"ERROR: download: HTTP {r.status_code} - {r.text[:300]}")
    return r.content


def describe(blob):
    """Row count and column names of a downloaded export.

    The v0 schema documents the export's *metadata* but not its columns, so
    they are read off the file itself and printed. Anyone extending this
    script can see the real header without a round trip to the dashboard.
    """
    try:
        text = gzip.decompress(blob).decode("utf-8", "replace") if blob[:2] == b"\x1f\x8b" \
            else blob.decode("utf-8", "replace")
    except (OSError, EOFError) as e:
        print(f"[WARN] could not read the export for a summary: {e}")
        return None, []
    rows = list(csv.reader(text.splitlines()))
    if not rows:
        return 0, []
    return max(0, len(rows) - 1), rows[0]


state = load_state()
last_hit_id = state.get("last_hit_id")
print(f"[..] requesting an export from hit id {last_hit_id or 'the beginning'}")

started = start_export(last_hit_id)
export_id = started.get("id")
if not export_id:
    sys.exit(f"ERROR: export response carried no id: {json.dumps(started)[:300]}")

info = wait_for(export_id)
rows_reported = int(info.get("num_rows") or 0)
if not rows_reported:
    print("[OK] no new hits since the last archive run; nothing written.")
    sys.exit(0)

# The cursor must move forward. If it does not, the export does not describe
# hits beyond what is already archived, and writing it would either duplicate
# rows or produce a file whose name spans backwards.
new_hit_id = int(info.get("last_hit_id") or 0)
if last_hit_id and new_hit_id <= int(last_hit_id):
    sys.exit(f"ERROR: export reports {rows_reported} rows but its last hit id "
             f"({new_hit_id}) does not advance the cursor ({last_hit_id}); nothing written.")

blob = download(export_id)
rows_seen, columns = describe(blob)

os.makedirs(ARCHIVE, exist_ok=True)
# The file is named for the hit-id span it covers, so the archive sorts into a
# contiguous chain and a gap would be visible in a directory listing.
first_id = (int(last_hit_id) + 1) if last_hit_id else 1
name = f"hits-{first_id:012d}-{new_hit_id:012d}.csv.gz"
target = os.path.join(ARCHIVE, name)
if os.path.exists(target):
    sys.exit(f"ERROR: {target} already exists; refusing to overwrite an archived file.")

with open(target, "wb") as f:
    f.write(blob if blob[:2] == b"\x1f\x8b" else gzip.compress(blob))

state = {
    "last_hit_id": new_hit_id,
    "last_export_id": export_id,
    "last_run": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "files": sorted(state.get("files", []) + [name]),
}
with open(STATE, "w", encoding="utf-8") as f:
    json.dump(state, f, indent=2)
    f.write("\n")

print(f"[OK] {target}")
print(f"[OK] {rows_seen if rows_seen is not None else rows_reported} rows, "
      f"{info.get('size', '?')} MB, sha256 {(info.get('hash') or '')[:16]}")
if columns:
    print(f"[OK] columns: {', '.join(columns)}")
print(f"[OK] cursor advanced to hit id {state['last_hit_id']}")
