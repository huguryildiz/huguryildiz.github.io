"""scripts/test_render_cv_tex.py — stdlib unittest, harici bağımlılık yok."""
import json
import re
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import render_cv_tex
from render_cv_tex import (emphasise, host_initials, load_scholar, mdlink_to_href,
                           scholar_date, sentence_case, tex_escape, tex_text)

TEMPLATE = Path(render_cv_tex.TEMPLATE_DIR) / "cv.tex.j2"
SCHOLAR_SNAPSHOT = {"citations_display": "1,075", "h_index": 16, "i10_index": 24,
                    "updated_utc": "2026-07-25T19:45:11Z",
                    "profile_url": "https://scholar.google.com/citations?user=x"}


class TestTexEscape(unittest.TestCase):
    def test_ampersand_escaped(self):
        self.assertEqual(tex_escape("Computer Standards & Interfaces"),
                         r"Computer Standards \& Interfaces")

    def test_percent_and_underscore_escaped(self):
        self.assertEqual(tex_escape("99.9% uptime_x"), r"99.9\% uptime\_x")

    def test_turkish_characters_untouched(self):
        """inputenc[utf8] + fontenc[T1] mevcut; kaçış gerekmez."""
        self.assertEqual(tex_escape("Hüseyin Uğur Yıldız"), "Hüseyin Uğur Yıldız")

    def test_en_dash_untouched(self):
        self.assertEqual(tex_escape("47817–47826"), "47817–47826")

    def test_other_specials_escaped(self):
        self.assertEqual(tex_escape(r"$100 #1 ~x ^y {z}"),
                         r"\$100 \#1 \textasciitilde{}x \textasciicircum{}y \{z\}")


class TestEmphasise(unittest.TestCase):
    def test_double_star_becomes_textbf(self):
        self.assertEqual(emphasise("Kurt, S., **Yildiz, H. U.**, & Tavli, B."),
                         r"Kurt, S., \textbf{Yildiz, H. U.}, & Tavli, B.")

    def test_plain_text_unchanged(self):
        self.assertEqual(emphasise("Yildiz, H. U."), "Yildiz, H. U.")

    def test_escape_runs_before_emphasis(self):
        """Sıra kritik: önce kaçış, sonra vurgu — aksi hâlde \\textbf kaçışlanır."""
        self.assertEqual(emphasise(tex_escape("A & **B**")), r"A \& \textbf{B}")


class TestMdlinkToHref(unittest.TestCase):
    def test_single_link_converted(self):
        self.assertEqual(
            mdlink_to_href("Developed [VERA](https://vera-eval.app/), a platform"),
            r"Developed \href{https://vera-eval.app/}{\underline{VERA}}, a platform")

    def test_plain_text_unchanged(self):
        self.assertEqual(mdlink_to_href("no links here"), "no links here")

    def test_stray_bracket_then_paren_elsewhere_not_corrupted(self):
        """A `]` followed later by an unrelated `(` must not be mistaken for a link —
        the pattern requires the `(` to immediately follow the `]`."""
        text = "See item [3] (which is unrelated) for details"
        self.assertEqual(mdlink_to_href(text), text)

    def test_multiple_links_converted(self):
        text = "[A](https://a.com/) and [B](https://b.com/)"
        self.assertEqual(
            mdlink_to_href(text),
            r"\href{https://a.com/}{\underline{A}} and \href{https://b.com/}{\underline{B}}")


class TestHostInitials(unittest.TestCase):
    def test_strips_prof_and_abbreviates_given_names(self):
        self.assertEqual(host_initials("Prof. Ian F. Akyildiz"), "I. F. Akyildiz")

    def test_single_given_name(self):
        self.assertEqual(host_initials("Prof. Murat Torlak"), "M. Torlak")


class TestSentenceCase(unittest.TestCase):
    def test_lowercases_all_but_first_word(self):
        self.assertEqual(
            sentence_case("Prolonging the Lifetime of Underwater Sensor Networks"),
            "Prolonging the lifetime of underwater sensor networks")

    def test_single_word_unchanged(self):
        self.assertEqual(sentence_case("Networks"), "Networks")


class TestTexText(unittest.TestCase):
    def test_link_url_with_special_chars_not_escaped(self):
        """A URL containing & and _ must survive \\href verbatim — tex_escape
        must never touch the url portion of [text](url), only the link text
        and the surrounding prose. Regression for the naive
        mdlink_to_href(emphasise(tex_escape(text))) composition, which
        escaped the whole string — including the url — before converting
        the link syntax, corrupting any url with LaTeX special characters."""
        result = tex_text("[VERA](https://vera-eval.app/some_path?x=1&y=2)")
        self.assertEqual(
            result,
            r"\href{https://vera-eval.app/some_path?x=1&y=2}{\underline{VERA}}")

    def test_prose_around_link_still_escaped(self):
        result = tex_text("A & B [C](https://x.com/) D & E")
        self.assertEqual(
            result,
            r"A \& B \href{https://x.com/}{\underline{C}} D \& E")


class TestScholarMetrics(unittest.TestCase):
    """Bibliyometrik hiçbir sayı şablona elle yazılmamalı: PDF CV ile web CV
    aynı `_data/scholar_metrics.json` anlık görüntüsünü göstermek zorunda."""

    def test_citation_section_interpolates_every_number(self):
        body = TEMPLATE.read_text(encoding="utf-8")
        section = body.split(r"\section{\faChartBar~Citations}", 1)[1].split(r"\section", 1)[0]
        for token in ("scholar.citations_display", "scholar.h_index",
                      "scholar.i10_index"):
            self.assertIn(token, section, f"{token} şablonda enterpole edilmiyor")
        """LaTeX'in kendi ölçü/aralık argümanları (\\vspace{-10pt}) sayı içerir;
        aranan şey metrik konumundaki çıplak sayı — yani komut argümanı
        olmayan her rakam dizisi."""
        prose = re.sub(r"\\[a-zA-Z]+\*?(\[[^\]]*\])?(\{[^{}]*\})?", " ", section)
        prose = re.sub(r"\{\{.*?\}\}", " ", prose, flags=re.S)
        self.assertNotRegex(prose, r"\d",
                            "Citations bölümünde elle yazılmış sayı kaldı")

    def test_no_rounded_citation_claim(self):
        """Canlı PDF yıllarca 'Citations > 1K' dedi; gerçek değer 1.075 idi."""
        self.assertNotIn("1K", TEMPLATE.read_text(encoding="utf-8"))

    def test_date_matches_web_format(self):
        self.assertEqual(scholar_date("2026-07-25T19:45:11Z"), "Jul 2026")

    def _load_from(self, payload):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "scholar_metrics.json"
            if payload is not None:
                path.write_text(json.dumps(payload), encoding="utf-8")
            with mock.patch.object(render_cv_tex, "SCHOLAR_JSON", path):
                return load_scholar()

    def test_valid_snapshot_gets_display_date(self):
        self.assertEqual(self._load_from(SCHOLAR_SNAPSHOT)["updated_display"], "Jul 2026")

    def test_missing_file_fails_closed(self):
        with self.assertRaises(SystemExit):
            self._load_from(None)

    def test_missing_metric_fails_closed(self):
        for key in ("citations_display", "h_index", "i10_index", "updated_utc", "profile_url"):
            partial = {k: v for k, v in SCHOLAR_SNAPSHOT.items() if k != key}
            with self.subTest(missing=key), self.assertRaises(SystemExit):
                self._load_from(partial)


if __name__ == "__main__":
    unittest.main()
