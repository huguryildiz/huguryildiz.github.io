#!/usr/bin/env python3
"""Tek seferlik: _pages/publications.md içindeki `var PUBS = [...]` JS dizisini
_data/publications.yml dosyasına çevirir. HTML <b>...</b> vurgusu nötr **...** olur,
DRIVE("id") çağrıları çözülmüş Google Drive URL'sine indirgenir."""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "_pages" / "publications.md"
DST = REPO / "_data" / "publications.yml"


def extract_array(text: str) -> str:
    start = text.index("var PUBS = [")
    depth = 0
    for i in range(text.index("[", start), len(text)):
        if text[i] == "[":
            depth += 1
        elif text[i] == "]":
            depth -= 1
            if depth == 0:
                return text[text.index("[", start):i + 1]
    raise ValueError("PUBS dizisi kapanmadı")


def resolve_drive_calls(src: str) -> str:
    """DRIVE("id") -> "https://drive.google.com/file/d/id/view" (aynı fonksiyonun
    sayfa üzerinde ürettiği URL ile birebir)."""
    return re.sub(
        r'DRIVE\("([^"]+)"\)',
        lambda m: '"https://drive.google.com/file/d/' + m.group(1) + '/view"',
        src,
    )


def js_to_json(src: str) -> str:
    """Alan adlarını tırnakla (type: -> "type":), sondaki virgülleri temizle."""
    src = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', src)
    src = re.sub(r',(\s*[}\]])', r'\1', src)
    return src


def normalise(rec: dict) -> dict:
    out = {}
    for key, value in rec.items():
        if isinstance(value, str):
            value = value.replace("<b>", "**").replace("</b>", "**")
            if "<" in value and ">" in value:
                raise ValueError(f"kalan HTML etiketi: {key}={value!r}")
        out[key] = value
    return out


def main() -> int:
    array_src = resolve_drive_calls(extract_array(SRC.read_text()))
    records = [normalise(r) for r in json.loads(js_to_json(array_src))]
    if len(records) != 43:
        raise SystemExit(f"beklenen 43 kayıt, bulunan {len(records)} — dur ve ayrıştırıcıyı düzelt")
    import yaml
    DST.write_text(
        "# ÜRETİLEN DEĞİL — elle düzenlenir. Tek kaynak: yayın künyeleri.\n"
        "# Web: _pages/publications.md · LaTeX: scripts/render_cv_tex.py\n"
        + yaml.safe_dump(records, allow_unicode=True, sort_keys=False, width=10**6)
    )
    print(f"{len(records)} kayıt yazıldı → {DST}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
