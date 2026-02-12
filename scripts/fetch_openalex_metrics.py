"""
OpenAlex Research Metrics Fetcher
----------------------------------
Kullanım:
  OPENALEX_AUTHOR_ID=A1234567890 python fetch_metrics.py

  Author ID'yi bulmak için:
  https://openalex.org/authors?filter=display_name.search:Adın+Soyadın
  veya: https://api.openalex.org/authors?search=Adın+Soyadın
"""

import os
import json
import sys
import requests
from datetime import datetime, timezone

# ── 1. Ortam değişkenini oku ──────────────────────────────────────────────────
AUTHOR_ID = os.getenv("OPENALEX_AUTHOR_ID", "A5085505896").strip()
MAILTO    = os.getenv("OPENALEX_MAILTO", "").strip()   # isteğe bağlı ama önerilir

# ── 2. ID'yi normalleştir ─────────────────────────────────────────────────────
# Tam URL gelebilir: https://openalex.org/A508...
if AUTHOR_ID.startswith("http"):
    AUTHOR_ID = AUTHOR_ID.rstrip("/").split("/")[-1]

# "authors/A508..." formatı da gelebilir
if "/" in AUTHOR_ID:
    AUTHOR_ID = AUTHOR_ID.rstrip("/").split("/")[-1]

# Büyük harfe çevir (küçük 'a' ile girilmiş olabilir)
AUTHOR_ID = AUTHOR_ID.upper()

print(f"[INFO] Kullanılacak Author ID: {AUTHOR_ID}")

# ── 3. ID formatını doğrula ───────────────────────────────────────────────────
if not (AUTHOR_ID.startswith("A") and AUTHOR_ID[1:].isdigit()):
    sys.exit(
        f"HATA: Geçersiz Author ID formatı → '{AUTHOR_ID}'\n"
        "Doğru format: A1234567890  (A + rakamlar)\n"
        "Bulmak için:  https://api.openalex.org/authors?search=Adın+Soyadın"
    )

# ── 4. OpenAlex API'yi çağır ──────────────────────────────────────────────────
url    = f"https://api.openalex.org/authors/{AUTHOR_ID}"
params = {}
if MAILTO:
    params["mailto"] = MAILTO

headers = {"User-Agent": "personal-site OpenAlex metrics fetcher"}

print(f"[INFO] İstek atılıyor: {url}")
try:
    r = requests.get(url, params=params, headers=headers, timeout=30)
except requests.exceptions.ConnectionError:
    sys.exit("HATA: İnternet bağlantısı kurulamadı.")
except requests.exceptions.Timeout:
    sys.exit("HATA: API isteği zaman aşımına uğradı.")

print(f"[INFO] HTTP Durum: {r.status_code}")

# ── 5. Hata durumlarını yakala ────────────────────────────────────────────────
if r.status_code == 404:
    sys.exit(
        f"HATA: '{AUTHOR_ID}' OpenAlex'te bulunamadı.\n"
        "→ ID'yi doğrulamak için:\n"
        f"   https://openalex.org/authors/{AUTHOR_ID}"
    )
if r.status_code != 200:
    sys.exit(f"HATA: API {r.status_code} döndürdü:\n{r.text[:400]}")

# ── 6. JSON'u ayrıştır ────────────────────────────────────────────────────────
try:
    data = r.json()
except Exception as e:
    sys.exit(f"HATA: JSON ayrıştırılamadı: {e}\nYanıt: {r.text[:300]}")

works        = int(data.get("works_count")  or 0)
cites        = int(data.get("cited_by_count") or 0)
summary      = data.get("summary_stats") or {}
h_index      = int(summary.get("h_index") or 0)
i10_index    = int(summary.get("i10_index") or 0)
display_name = data.get("display_name", "")
openalex_id  = data.get("id", "")

print(f"\n[OK] Yazar     : {display_name}")
print(f"[OK] OpenAlex  : {openalex_id}")
print(f"[OK] Makale    : {works}")
print(f"[OK] Atıf      : {cites}")
print(f"[OK] h-index   : {h_index}")
print(f"[OK] i10-index : {i10_index}\n")

# ── 7. Sıfır kontrolü ────────────────────────────────────────────────────────
if works == 0 and cites == 0 and h_index == 0:
    print("⚠️  UYARI: Tüm değerler sıfır!")
    print("Olası nedenler:")
    print("  1. Yanlış Author ID (en sık neden)")
    print("  2. Yazar OpenAlex'te henüz yayın eşleştirmemiş")
    print("  3. OpenAlex profiliniz henüz oluşturulmamış")
    print(f"\nKontrol için: https://openalex.org/authors/{AUTHOR_ID}")
    sys.exit(1)

# ── 8. Dosyaya yaz ───────────────────────────────────────────────────────────
metrics = {
    "citations":    cites,
    "works":        works,
    "h_index":      h_index,
    "i10_index":    i10_index,
    "updated_utc":  datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "profile_url":  f"https://openalex.org/{AUTHOR_ID}",
    "display_name": display_name,
}

os.makedirs("_data", exist_ok=True)
out_path = "_data/research_metrics.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=2, ensure_ascii=False)

print(f"[OK] Kaydedildi: {out_path}")
print(json.dumps(metrics, indent=2, ensure_ascii=False))