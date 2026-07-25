#!/usr/bin/env python3
"""_data/cv.yml + _data/publications.yml -> main.tex

GENERATED FILE: main.tex is not edited by hand. Source: _data/cv.yml and
_data/publications.yml. Regenerate with:

    python3 scripts/render_cv_tex.py --out main.tex
"""
import argparse
import re
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader

REPO_ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = REPO_ROOT / "cv-latex"
CV_YML = REPO_ROOT / "_data" / "cv.yml"
PUBLICATIONS_YML = REPO_ROOT / "_data" / "publications.yml"

_ESCAPES = {
    "\\": r"\textbackslash{}",
    "&": r"\&",
    "%": r"\%",
    "$": r"\$",
    "#": r"\#",
    "_": r"\_",
    "{": r"\{",
    "}": r"\}",
    "~": r"\textasciitilde{}",
    "^": r"\textasciicircum{}",
}


def tex_escape(text: str) -> str:
    """LaTeX özel karakterlerini kaçışlar. Türkçe karakterlere ve en dash'e
    dokunmaz (preamble'da inputenc[utf8] + fontenc[T1] var)."""
    return "".join(_ESCAPES.get(ch, ch) for ch in text)


def emphasise(text: str) -> str:
    r"""Nötr **…** vurgusunu \textbf{…} hâline getirir.
    tex_escape'ten SONRA çağrılmalı."""
    return re.sub(r"\*\*(.+?)\*\*", r"\\textbf{\1}", text)


def mdlink_to_href(text: str) -> str:
    r"""Inline [text](url) işaretini \href{url}{\underline{text}} hâline getirir.
    Kaçış YOK: url kısmı escape edilmez (zaten geçerli bir URL). `]` hemen
    ardından `(` gelmediği sürece eşleşmez, bu yüzden alâkasız bir
    ``[3] (bkz. ...)`` metnini bozmaz."""
    return re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: r"\href{%s}{\underline{%s}}" % (m.group(2), m.group(1)),
        text,
    )


def host_initials(name: str) -> str:
    """'Prof. Ian F. Akyildiz' -> 'I. F. Akyildiz': drops an honorific prefix and
    abbreviates every given name to its initial, keeping the surname in full."""
    name = re.sub(r"^(Prof\.|Dr\.)\s+", "", name)
    parts = name.split(" ")
    *given, surname = parts
    initials = [p if p.endswith(".") else p[0] + "." for p in given]
    return " ".join(initials + [surname])


def sentence_case(text: str) -> str:
    """Title Case -> sentence case: lowercases every word except the first."""
    words = text.split(" ")
    return " ".join([words[0]] + [w.lower() for w in words[1:]])


def tex_text(text: str) -> str:
    """Escape edilip vurgu ve link işaretleri LaTeX'e çevrilmiş düz metin.
    Sıra kritik: tex_escape ÖNCE (aksi hâlde **/[]/() kaçışlanır ve
    \\textbf/\\href üretilemez), emphasise ve mdlink_to_href SONRA."""
    return mdlink_to_href(emphasise(tex_escape(text)))


def load_data():
    cv = yaml.safe_load(CV_YML.read_text(encoding="utf-8"))
    pubs = yaml.safe_load(PUBLICATIONS_YML.read_text(encoding="utf-8"))
    return cv, pubs


def numbered_by_type(pubs, pub_type, prefix):
    """Verilen type için yıla göre azalan sırada [PREFIX<n>] numaralarını hesaplar.
    En yeni kayıt en yüksek numarayı alır (örn. 24 kayıttan en yeni [J24])."""
    items = [p for p in pubs if p["type"] == pub_type]
    n = len(items)
    numbered = []
    for i, p in enumerate(items):
        numbered.append({"num": n - i, "id": f"{prefix}{n - i}", **p})
    return numbered


def split_detail(detail: str):
    """'VOL(ISSUE), PAGES' ya da 'VOL, PAGES' -> (vol, rest).
    rest, kapanan \\emph parantezinden hemen sonra basılan kısımdır
    (issue varsa parantezle başlar, yoksa virgülle)."""
    paren = detail.find("(")
    comma = detail.find(",")
    if paren != -1 and (comma == -1 or paren < comma):
        return detail[:paren], detail[paren:]
    if comma != -1:
        return detail[:comma], detail[comma:]
    return detail, ""


def split_conf_detail(detail: str):
    """'pp. 1-4, IEEE' -> ('pp. 1-4', 'IEEE') for confint/confnat/proceedings entries."""
    pages, _, publisher = detail.rpartition(",")
    return pages.strip(), publisher.strip()


def prepare_publication(p):
    out = dict(p)
    out["authors_tex"] = tex_text(p["authors"])
    out["title_tex"] = tex_escape(p["title"])
    out["venue_tex"] = tex_escape(p["venue"])
    if p["type"] in ("journal", "editorial"):
        vol, rest = split_detail(p["detail"])
        out["vol_tex"] = tex_escape(vol)
        out["detail_rest_tex"] = tex_escape(rest)
    else:
        pages, publisher = split_conf_detail(p["detail"])
        out["pages_tex"] = tex_escape(pages)
        out["publisher_tex"] = tex_escape(publisher)
    if p.get("month"):
        out["date_tex"] = f"{p['year']}, {p['month']}"
    else:
        out["date_tex"] = str(p["year"])
    return out


def build_context(cv, pubs):
    journals = [prepare_publication(p) for p in numbered_by_type(pubs, "journal", "J")]
    editorials = [prepare_publication(p) for p in numbered_by_type(pubs, "editorial", "E")]
    confints = [prepare_publication(p) for p in numbered_by_type(pubs, "confint", "C")]
    confnats = [prepare_publication(p) for p in numbered_by_type(pubs, "confnat", "CT")]

    journals_by_id = {j["id"]: j for j in journals}
    research_areas_tex = ", ".join(tex_escape(a) for a in cv["research_areas"])

    return {
        "cv": cv,
        "tex": tex_text,
        "esc": tex_escape,
        "host_initials": host_initials,
        "sentence_case": sentence_case,
        "journals": journals,
        "editorials": editorials,
        "confints": confints,
        "confnats": confnats,
        "journals_by_id": journals_by_id,
        "research_areas_tex": research_areas_tex,
    }


def render(cv: dict, pubs: list, out_path: Path) -> None:
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATE_DIR)),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    template = env.get_template("cv.tex.j2")
    ctx = build_context(cv, pubs)
    out_path.write_text(template.render(**ctx), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Render main.tex from _data/cv.yml + _data/publications.yml")
    parser.add_argument("--out", type=Path, default=REPO_ROOT / "main.tex")
    args = parser.parse_args()
    cv, pubs = load_data()
    render(cv, pubs, args.out)
    print(f"wrote {args.out}")


if __name__ == "__main__":
    main()
