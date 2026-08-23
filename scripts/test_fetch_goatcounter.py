import importlib.util
import os
import sys
import types
from datetime import date
from pathlib import Path
import unittest
from unittest import mock


os.environ.setdefault("GOATCOUNTER_API_TOKEN", "test-token")
try:
    import requests  # noqa: F401
except ModuleNotFoundError:
    requests_stub = types.ModuleType("requests")
    requests_stub.get = None
    requests_stub.RequestException = Exception
    sys.modules["requests"] = requests_stub
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

    def test_get_does_not_retry_rate_limit_response(self):
        response = Response()
        response.status_code = 429
        response.text = "rate limited"
        response.headers = {"X-Rate-Limit-Reset": "40"}
        with mock.patch.object(stats.requests, "get", return_value=response) as get, \
             mock.patch.object(stats.time, "sleep"):
            result = stats.get("/stats/hits", date(2026, 8, 5), date(2026, 8, 5))

        self.assertIsNone(result)
        self.assertEqual(1, get.call_count)

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

    def test_daily_dimensions_are_filtered_to_page_view_paths(self):
        hits = [
            {"path": "/research", "title": "Research", "path_id": 11,
             "event": False, "count": 5, "stats": []},
            {"path": "cv-pdf", "title": "CV", "path_id": 22,
             "event": True, "count": 2, "stats": []},
        ]
        dimension_filters = []

        def fake_list(path, *_args, **kwargs):
            if path == "/stats/hits":
                return hits
            dimension_filters.append(kwargs.get("extra"))
            if path == "/stats/locations":
                return [{"id": "TR", "name": "Turkey", "count": 5}]
            return [{"name": "Recorded", "count": 5}]

        with mock.patch.object(stats, "stats_list", side_effect=fake_list):
            block = stats.fetch_daily_breakdown(date(2026, 8, 5))

        self.assertIsNotNone(block)
        self.assertEqual(6, len(dimension_filters))
        self.assertTrue(all(value == {"include_paths": ["11"]}
                            for value in dimension_filters))
        self.assertEqual({}, stats.pageview_breakdown_mismatches(block))

    def test_event_only_day_does_not_query_unfiltered_dimensions(self):
        hits = [{"path": "cv-pdf", "title": "CV", "path_id": 22,
                 "event": True, "count": 2, "stats": []}]

        with mock.patch.object(stats, "stats_list", return_value=hits) as fetch:
            block = stats.fetch_daily_breakdown(date(2026, 8, 5))

        self.assertEqual(0, block["pageviews"])
        self.assertEqual([], block["countries"])
        fetch.assert_called_once_with(
            "/stats/hits", date(2026, 8, 5), date(2026, 8, 5), strict=True)

    def test_region_detail_uses_the_page_view_path_filter(self):
        page_filter = {"include_paths": ["11"]}
        with mock.patch.object(stats, "stats_list", return_value=[]) as fetch:
            regions, unmatched = stats.fetch_regions(
                [{"code": "TR", "name": "Turkey", "count": 5}],
                date(2026, 8, 5), date(2026, 8, 5), page_filter)

        self.assertEqual([], regions)
        self.assertEqual([], unmatched)
        fetch.assert_called_once_with(
            "/stats/locations/TR", date(2026, 8, 5), date(2026, 8, 5),
            extra=page_filter)

    def test_dimension_breakdowns_can_exclude_unidentified_pageviews(self):
        block = {
            "pageviews": 5,
            "pages": [{"count": 5}],
            "countries": [{"count": 4}],
            "browsers": [{"count": 4}],
            "systems": [{"count": 4}],
            "sizes": [],
            "languages": [{"count": 4}],
            "events": [{"count": 9}],
            "referrers": [{"count": 2}],
        }

        self.assertEqual({}, stats.pageview_breakdown_mismatches(block))

    def test_page_breakdown_must_reconcile_with_kpi(self):
        block = {
            "pageviews": 5,
            "pages": [{"count": 4}],
            "countries": [{"count": 4}],
            "browsers": [{"count": 4}],
            "systems": [{"count": 4}],
            "sizes": [],
            "languages": [{"count": 4}],
        }

        self.assertEqual({"pages": 4}, stats.pageview_breakdown_mismatches(block))

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

    def test_daily_cache_keeps_temporal_block_when_dimension_does_not_reconcile(self):
        block = {
            "pageviews": 5,
            "pages": [{"count": 5}],
            "events": [],
            "hourly": [5] + [0] * 23,
            "countries": [{"count": 4}],
            "browsers": [{"count": 4}],
            "systems": [{"count": 4}],
            "languages": [{"count": 4}],
            "sizes": [],
        }

        with mock.patch.object(stats, "fetch_daily_breakdown", return_value=block):
            cache = stats.refresh_daily_cache({}, stats.TODAY, stats.TODAY)

        self.assertEqual(block, cache[stats.TODAY.isoformat()])


if __name__ == "__main__":
    unittest.main()
