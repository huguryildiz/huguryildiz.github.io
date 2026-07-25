"""scripts/test_render_cv_tex.py — stdlib unittest, harici bağımlılık yok."""
import unittest

from render_cv_tex import emphasise, host_initials, mdlink_to_href, sentence_case, tex_escape


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


if __name__ == "__main__":
    unittest.main()
