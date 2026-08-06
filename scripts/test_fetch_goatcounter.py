import importlib.util
import os
from datetime import date
from pathlib import Path
import unittest
from unittest import mock


os.environ.setdefault("GOATCOUNTER_API_TOKEN", "test-token")
MODULE_PATH = Path(__file__).with_name("fetch_goatcounter.py")
SPEC = importlib.util.spec_from_file_location("fetch_goatcounter", MODULE_PATH)
stats = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(stats)


class Response:
    status_code = 200

    def __init__(self, payload=None):
        self.payload = payload or {"ok": True}

    def json(self):
        return self.payload


class GoatCounterAggregationTests(unittest.TestCase):
    def test_get_sends_a_complete_site_calendar_day(self):
        with mock.patch.object(stats.requests, "get", return_value=Response()) as get, \
             mock.patch.object(stats.time, "sleep"):
            result = stats.get("/stats/hits", date(2026, 8, 5), date(2026, 8, 5))

        self.assertEqual({"ok": True}, result)
        query = get.call_args.kwargs["params"]
        self.assertEqual("2026-08-05T00:00:00+03:00", query["start"])
        self.assertEqual("2026-08-05T23:59:59+03:00", query["end"])

    def test_page_view_series_and_hours_exclude_events(self):
        hits = [
            {"event": False, "stats": [
                {"day": "2026-08-05", "daily": 3, "hourly": [1, 2] + [0] * 22}
            ]},
            {"event": True, "stats": [
                {"day": "2026-08-05", "daily": 4, "hourly": [4] + [0] * 23}
            ]},
        ]

        self.assertEqual([{"date": "2026-08-05", "views": 3}],
                         stats.daily_series_from_hits(hits))
        self.assertEqual(3, sum(stats.hour_profile(hits)))

    def test_strict_daily_fetch_rejects_an_unknown_payload_shape(self):
        with mock.patch.object(stats, "get", return_value={"unexpected": []}):
            self.assertIsNone(stats.stats_list(
                "/stats/locations", date(2026, 8, 5), date(2026, 8, 5), strict=True))

    def test_daily_block_keeps_clicks_separate_from_page_views(self):
        hits = [
            {"path": "/research", "title": "Research", "path_id": 1,
             "event": False, "count": 5, "stats": []},
            {"path": "cv-pdf", "title": "CV", "path_id": 2,
             "event": True, "count": 2, "stats": []},
        ]

        def fake_list(path, *_args, **_kwargs):
            if path == "/stats/hits":
                return hits
            return []

        with mock.patch.object(stats, "stats_list", side_effect=fake_list):
            block = stats.fetch_daily_breakdown(date(2026, 8, 5))

        self.assertEqual(5, block["pageviews"])
        self.assertEqual(5, sum(row["count"] for row in block["pages"]))
        self.assertEqual(2, sum(row["count"] for row in block["events"]))

    def test_pageview_breakdowns_must_reconcile_with_kpi(self):
        block = {
            "pageviews": 5,
            "pages": [{"count": 5}],
            "countries": [{"count": 4}],
            "browsers": [{"count": 5}],
            "systems": [{"count": 5}],
            "sizes": [],
            "languages": [{"count": 5}],
            "events": [{"count": 9}],
            "referrers": [{"count": 2}],
        }

        self.assertEqual({"countries": 4}, stats.pageview_breakdown_mismatches(block))

    def test_present_optional_screen_sizes_must_reconcile(self):
        block = {
            "pageviews": 5,
            "pages": [{"count": 5}],
            "countries": [{"count": 5}],
            "browsers": [{"count": 5}],
            "systems": [{"count": 5}],
            "sizes": [{"count": 3}],
            "languages": [{"count": 5}],
        }

        self.assertEqual({"sizes": 3}, stats.pageview_breakdown_mismatches(block))


if __name__ == "__main__":
    unittest.main()
