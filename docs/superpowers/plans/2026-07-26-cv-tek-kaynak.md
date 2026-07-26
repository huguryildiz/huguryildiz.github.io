# CV Tek Kaynak Senkronu — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CV içeriğini `_data/cv.yml` + `_data/publications.yml` içinde tek kaynağa taşımak; `main.tex`/PDF ve `/cv/`, `/publications/`, `/service/`, `/teaching/` sayfalarını bu kaynaktan üretmek.

**Architecture:** Tek yönlü üretim. YAML veri → (a) Liquid ile web sayfaları, (b) Python + Jinja2 ile `main.tex` → TeX Live ile PDF. Hiçbir çıktı kaynağa geri yazmaz. PDF git deposunda tutulmaz; her deploy'da derlenip `_site/files/` altına konur.

**Tech Stack:** Jekyll 3 + Liquid, Python 3.12 (stdlib + `PyYAML` + `Jinja2`), TeX Live (Docker, GitHub Actions), `unittest`.

**Tasarım dokümanı:** [docs/superpowers/specs/2026-07-26-cv-tek-kaynak-design.md](../specs/2026-07-26-cv-tek-kaynak-design.md)

## Global Constraints

Her task'ın gereksinimleri bu bölümü kapsar.

- **Sayfa JS'inde `//` yorumu KESİNLİKLE yasak.** `compress` layout satır sonlarını sildiği için satır yorumu kalan tüm scripti yutar ve sayfa boş render edilir. Yalnızca `/* */`, satır sonundaki yorumlar dahil.
- **Görünen isim Türkçe:** `Hüseyin Uğur Yıldız`. Metadata kasten ASCII: `Huseyin Ugur Yildiz`. Global normalizasyon yapılmaz.
- **Yayın, metrik, ödül, öğrenci kaydı, atıf uydurulmaz.** Belirsiz bilgi kesin iddiaya dönüştürülmez. Tüm veri mevcut dosyalardan birebir taşınır.
- **Bibliyometrik sayılar elle düzenlenmez.** `_data/scholar_metrics.json` script üretimidir; `citations_display` önceden biçimlendirilmiş (`1,075`) çünkü Liquid'de binlik ayraç filtresi yok.
- **Cerrahi değişiklik.** Her değişen satır doğrudan bu plana izlenebilir olmalı. İlgisiz kod iyileştirilmez, yeniden biçimlendirilmez.
- **Root-relative iç URL'ler**, çevre kodun kullandığı yerde `relative_url` filtresi.
- **Yeni dosya = yeni public URL.** `_config.yml` `exclude` listesi neyin yayına gittiğine karar verir, `.gitignore` değil. Alt çizgi/nokta ile başlamayan her tracked yol `_site/`'a kopyalanır.
- **Stil:** Mevcut elle yazılmış HTML stiline uyulur. Yeni CSS `assets/css/redesign.css` içine; mevcut token, class ve `_includes/icons.html` SVG sembolleri yeniden kullanılır. Frontend build sistemi eklenmez.
- **`_site/` ve `vendor/` düzenlenmez.**
- **Push yalnızca kullanıcı istediğinde.** Commit serbest.
- **Yerel build komutu** (sistem Ruby 2.6 ve Ruby 4.0 çalışmaz):
  ```bash
  export PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH
  JEKYLL_ENV=production bundle exec jekyll build
  ```
- **Python arm64 olmalı.** `python3 -c "import platform; print(platform.machine())"` → `arm64`. `/opt/anaconda3/bin/python3` (x86_64) kullanılmaz; `/opt/homebrew/bin/python3.12` tercih edilir.
- **Scratchpad:** Geçici dosyalar `/private/tmp/claude-501/-Users-huguryildiz-Documents-GitHub-huguryildiz-github-io/93914f2b-3100-491c-b076-081e01d88bea/scratchpad` altına. Aşağıda `$SCRATCH` olarak geçer.

## Doğrulama Omurgası: Built-HTML Diff

Bu planın ana regresyon testi. Bir sayfayı şablonlaştırmak **üretilen HTML'i değiştirmemelidir**. Yöntem:

```bash
export PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH
export SCRATCH=/private/tmp/claude-501/-Users-huguryildiz-Documents-GitHub-huguryildiz-github-io/93914f2b-3100-491c-b076-081e01d88bea/scratchpad

# Değişiklikten ÖNCE
JEKYLL_ENV=production bundle exec jekyll build
cp _site/cv/index.html "$SCRATCH/baseline-cv.html"

# Değişiklikten SONRA
JEKYLL_ENV=production bundle exec jekyll build
diff "$SCRATCH/baseline-cv.html" _site/cv/index.html && echo "REGRESYON YOK"
```

Boşluk farkı beklenen tek gürültüdür; anlamlı fark (eksik kayıt, bozuk sıra, kaçırılmış link) task'ı reddeder. Boşluk farklarını göz ardı etmek için `diff -w` kullanılır.

---

### Task 1: Yayın verisini `_data/publications.yml`'a taşı

Yayınlar en sık değişen ve en yapılandırılmış veri. Bağımsız olarak değer üretir: bittiğinde LaTeX yayın listesi hazır bir kaynaktan beslenebilir hâle gelir.

**Files:**
- Create: `_data/publications.yml`
- Create: `scripts/convert_pubs_to_yaml.py` (tek seferlik dönüştürücü, iş bitince repoda kalır — `scripts/` zaten `exclude` içinde)
- Modify: `_pages/publications.md:74` civarı — `var PUBS = [ … ];` bloğu
- Modify: `scripts/README.md` — yeni scripti "one-off utility" olarak kaydet

**Interfaces:**
- Produces: `site.data.publications` — her kayıt şu alanlara sahip: `type` (`"journal"` | `"conference"` | `"conference_tr"` | `"editorial"`), `year` (int), `authors` (str, `**…**` vurgulu), `title` (str), `venue` (str), `detail` (str), `q` (str, opsiyonel), `scie` (bool, opsiyonel), `doi` (str, opsiyonel), `pdf` (str, opsiyonel), `slides` (str, opsiyonel). Task 4 bu şemayı LaTeX üretiminde tüketir.

- [ ] **Step 1: Mevcut `PUBS` dizisinin tam sınırlarını ve alan kümesini tespit et**

```bash
grep -n 'var PUBS = \[' _pages/publications.md
awk '/var PUBS = \[/,/^\];/' _pages/publications.md | wc -l
grep -o '[a-z]*:' <(awk '/var PUBS = \[/,/^\];/' _pages/publications.md) | sort -u
```

Beklenen: dizinin başlangıç/bitiş satırı ve kullanılan tüm alan adları. Alan listesi yukarıdaki "Produces" bloğuyla karşılaştırılır; fazladan alan varsa şemaya eklenir.

- [ ] **Step 2: Dönüştürücüyü yaz**

Elle kopyalama 40+ kayıtta insan hatası demektir. `_pages/publications.md` içindeki JS dizisi ayrıştırılıp YAML'a çevrilir.

```python
#!/usr/bin/env python3
"""Tek seferlik: _pages/publications.md içindeki `var PUBS = [...]` JS dizisini
_data/publications.yml dosyasına çevirir. HTML <b>…</b> vurgusu nötr **…** olur."""
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
    records = [normalise(r) for r in json.loads(js_to_json(extract_array(SRC.read_text())))]
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
```

- [ ] **Step 3: Dönüştürücüyü çalıştır ve kayıt sayısını doğrula**

```bash
/opt/homebrew/bin/python3.12 -c "import platform; print(platform.machine())"   # arm64 olmalı
/opt/homebrew/bin/python3.12 -m pip install --quiet pyyaml
/opt/homebrew/bin/python3.12 scripts/convert_pubs_to_yaml.py
```

Beklenen: **43 kayıt** (bu plan yazılırken ölçüldü; `awk '/var PUBS = \[/,/^\];/' _pages/publications.md | grep -c '{type:'` ile teyit edilir). Eşleşmiyorsa dur ve ayrıştırıcıyı düzelt — sessiz kayıp kabul edilemez.

Not: `main.tex`'teki yayın sayısı da J24 + E1 + C13 + CT5 = **43**. İki liste birebir örtüşüyor; bu Task 4'te numaralandırmanın doğruluğu için kontrol noktasıdır.

- [ ] **Step 4: Baseline HTML'i al**

```bash
export PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH
JEKYLL_ENV=production bundle exec jekyll build
cp _site/publications/index.html "$SCRATCH/baseline-publications.html"
```

- [ ] **Step 5: `publications.md`'yi YAML'dan besle**

`var PUBS = [ … ];` bloğunun tamamı aşağıdakiyle değiştirilir. `jsonify` Liquid'in yerleşik filtresidir; `**…**` işareti `<b>` etiketine geri çevrilir.

```liquid
var PUBS = {{ site.data.publications | jsonify }};
/* **…** vurgusunu <b>…</b> etiketine çevir (kaynak nötr işaret tutar) */
PUBS = PUBS.map(function (p) {
  if (p.authors) {
    p.authors = p.authors.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  }
  return p;
});
```

Uyarı: bu blokta `//` yorumu kullanılamaz — sayfa boş render edilir.

- [ ] **Step 6: Built-HTML diff ile regresyonu doğrula**

```bash
JEKYLL_ENV=production bundle exec jekyll build
diff -w "$SCRATCH/baseline-publications.html" _site/publications/index.html
```

Beklenen: `PUBS` satırının biçimi değişir (tek satır JSON), **kayıt içerikleri birebir aynı** kalır. Fark yalnızca serialization biçiminde olmalı. Kayıp alan, değişen sıra veya kaçmış karakter varsa task reddedilir.

- [ ] **Step 7: Tarayıcıda işlevsel doğrulama**

Sunucuyu başlat: `bundle exec jekyll serve --port 4011 --no-watch`, `http://localhost:4011/publications/` aç.

Kontrol listesi:
1. Tarayıcı konsolu temiz (JS hatası yok — `//` tuzağının kanıtı)
2. Yayın sayısı sayfada doğru görünüyor
3. Tür / yıl / quartile filtreleri çalışıyor
4. Donut grafikleri, yıl histogramı ve atıf grafiği çiziliyor; histogram per-year/cumulative toggle'ı çalışıyor
5. Yazar adı vurgusu (`Yildiz, H. U.` kalın) doğru render ediliyor
6. Açık ve koyu temada kontrol edildi
7. Dar viewport'ta (375px) düzen bozulmuyor

- [ ] **Step 8: `scripts/README.md`'ye kaydet**

Mevcut dosyanın "live / dormant / one-off" sınıflandırma biçimine uyularak `convert_pubs_to_yaml.py` **one-off utility** olarak eklenir: bir kez çalıştırıldı, `_data/publications.yml` artık elle düzenlenen kaynak, script yeniden çalıştırılırsa elle yapılan düzenlemeleri ezer.

- [ ] **Step 9: Commit**

```bash
git add _data/publications.yml scripts/convert_pubs_to_yaml.py scripts/README.md _pages/publications.md
git commit -m "refactor: yayın verisini _data/publications.yml tek kaynağına taşı"
```

---

### Task 2: `_data/cv.yml` oluştur ve `/cv/` sayfasını ondan besle

**Files:**
- Create: `_data/cv.yml`
- Modify: `_pages/cv.md` (272 satır — `cvrow` blokları döngüye çevrilir)

**Interfaces:**
- Consumes: yok (Task 1'den bağımsız)
- Produces: `site.data.cv` — Task 3 ve Task 4 bu şemayı tüketir. Şema aşağıda tam olarak tanımlı.

- [ ] **Step 1: `_data/cv.yml` şemasını yaz**

Veri `_pages/cv.md`, `_pages/service.md`, `_pages/teaching.md` ve `main.tex`'ten **birebir** taşınır. Anlatı metinleri (öğretim felsefesi, ders tanıtım kartları) taşınmaz — sayfada kalır.

```yaml
# Tek kaynak. Elle düzenlenir.
# Tüketiciler: _pages/cv.md, _pages/service.md, _pages/teaching.md,
#              scripts/render_cv_tex.py (→ main.tex → PDF)

person:
  name_display: "Hüseyin Uğur Yıldız"     # web
  name_ascii: "Huseyin Ugur Yildiz"       # LaTeX ve metadata
  title: "Associate Professor of Electrical and Electronics Engineering"
  phone: "+90 (312) 585 02 21"
  email: "hugur.yildiz@tedu.edu.tr"
  website: "huguryildiz.com"
  linkedin: "huguryildiz"
  location: "Ankara, Turkey"

identifiers:
  orcid: "0000-0002-1556-2634"
  scopus: "56242674200"
  researcherid: "S-6587-2016"
  scholar: "nQwHS1gAAAAJ"

summary_web: >-
  (mevcut _pages/cv.md:33-40 metni birebir)
summary_tex: >-
  (mevcut main.tex Summary bölümü birebir — iki metin şu an ayrışmış durumda;
  hangisinin kalacağına Step 2'de karar verilir)

appointments:
  - years: "2016 – present"
    org: "TED University"
    org_url: "https://www.tedu.edu.tr/en"
    location: "Ankara, Turkey"
    unit: "Department of Electrical and Electronics Engineering"
    roles:
      - { title: "Associate Professor", period: "Mar 2021 – present" }
      - { title: "Department Chair", period: "Jul 2021 – Jul 2024" }
      - { title: "Assistant Professor", period: "Sep 2016 – Mar 2021" }
    bullets:
      - "Founded the department's IEEE Student Branch, established a new teaching laboratory, and launched the M.Sc. program."
      - "Led academic operations for 100+ students and 12 faculty members; oversaw accreditation and curriculum development."
      - "Authored 20+ peer-reviewed publications (14 in IEEE journals); supervised 7 graduate theses and 40+ senior design teams."

education:
  - { years: "2014 – 2016", degree: "Ph.D., Electrical and Electronics Engineering",
      org: "TOBB University of Economics and Technology", org_url: "https://www.etu.edu.tr/en",
      location: "Ankara, Turkey" }

theses_own:                                 # kendi tezleri (/cv/ Graduate theses)
  - { year: 2016, kind: "Ph.D. dissertation", title: "…", advisor: "Prof. Bulent Tavli",
      pdf: "/files/Yildiz_HuseyinUgur_PhD_Dissertation.pdf", yok_url: "https://tez.yok.gov.tr/…",
      goatcounter: "thesis-pdf/phd-dissertation" }

theses_supervised:                          # main.tex [TH7]…[TH1]
  - { id: "TH7", year: 2025, student: "Tantur Karagul, C.", title: "…",
      kind: "Doctoral dissertation", org: "TOBB University of Economics and Technology",
      location: "Ankara, Turkey" }

honors:
  - { id: "A2", year: 2021, title: "IEEE Senior Member", icon: "ieee", detail: "…" }

toolbox:                                    # /cv/ Technical toolbox — LaTeX'te düz metin
  - group: "Programming & scientific computing"
    items:
      - { name: "Python", icon: "python.jpg" }

certificates:
  - { year: 2025, title: "Machine Learning Specialization", org: "DeepLearning.AI (Coursera)",
      url: "https://www.coursera.org/account/accomplishments/specialization/FGT2PNQ9NYVL" }

languages:
  - { name: "English", level_web: "Business & academic proficiency", level_tex: "Business and academic proficiency" }
  - { name: "Turkish", level_web: "Native", level_tex: "Native" }

research_areas:                             # yalnızca LaTeX
  - "Wireless Ad Hoc and Sensor Networks"

service:
  tpc:            [ "IEEE International Conference on Communications (ICC 2018–2022)" ]
  chairing:       [ { session: "PHY-II: Physical Layer Communications-II", venue: "IEEE BlackSeaCom 2021" } ]
  reviewing:      [ "Ad Hoc Networks" ]
  memberships:    [ { name: "IEEE Senior Member", period: "2021 – present" } ]
  institutional:  [ { role: "External Advisory Board Member", org: "…", period: "2022 – 2024" } ]   # yalnızca web

talks:
  - { date_web: "Oct 2019", date_tex: "2019, October 24", title: "…",
      venue: "Georgia Institute of Technology, Atlanta, GA, USA", host: "Prof. Ian F. Akyildiz",
      kind: "Invited talk", slides: "https://drive.google.com/…" }

courses:
  - { code: "EE 304", name: "Probability and Random Variables", level: "undergraduate",
      terms: "Spring'17 – Present", current: true }
```

- [ ] **Step 2: Ayrışmış metinleri kullanıcıya sor, uydurma**

`summary_web` ile `summary_tex` şu an farklı (`quantum network routing` / `quantum communication systems`). Aynı şekilde `main.tex` Professional Experience madde işaretleri ile `/cv/` Appointments madde işaretleri farklı ifadeler kullanıyor.

Bu bir içerik kararıdır, teknik karar değil. Farkların listesi çıkarılır ve **kullanıcıya sorulur**: hangi metin kalacak? Cevap gelene kadar her iki alan da korunur (`summary_web` + `summary_tex`), böylece iş bloke olmaz. Metin uydurulmaz veya kendi başına birleştirilmez.

- [ ] **Step 3: Veriyi doldur ve YAML geçerliliğini doğrula**

```bash
/opt/homebrew/bin/python3.12 -c "
import yaml, sys
d = yaml.safe_load(open('_data/cv.yml'))
print('bölümler:', list(d))
print('appointments:', len(d['appointments']))
print('theses_supervised:', len(d['theses_supervised']))
print('talks:', len(d['talks']))
print('courses:', len(d['courses']))
"
```

Beklenen sayılar (kaynaktan sayılmış): `theses_supervised` = 7 (`main.tex` TH1–TH7), `talks` = 10 (`service.md` cvrow sayısı), `courses` = 7 (`main.tex` Courses Taught listesi).

- [ ] **Step 4: Baseline HTML al**

```bash
JEKYLL_ENV=production bundle exec jekyll build
cp _site/cv/index.html "$SCRATCH/baseline-cv.html"
```

- [ ] **Step 5: `cv.md`'de tekrar eden blokları döngüye çevir**

Örnek — Education bölümü (`_pages/cv.md:92-113`) üç `cvrow` bloğu tek döngüye iner:

```liquid
<h2 class="sec" id="cv-education"><svg class="hicon" aria-hidden="true"><use href="#i-cap"/></svg>Education</h2>
{% for e in site.data.cv.education %}
<div class="cvrow">
  <div class="when tnum">{{ e.years }}</div>
  <div class="what">
    <div class="t">{{ e.degree }}</div>
    <div class="w"><a class="instlink" href="{{ e.org_url }}" target="_blank" rel="noopener">{{ e.org }}</a>, {{ e.location }}</div>
  </div>
</div>
{% endfor %}
```

Aynı dönüşüm Appointments, Graduate theses, Honors, Technical toolbox ve Professional development bölümlerine uygulanır. `cvtoc` navigasyonu (`_pages/cv.md:256-270`) sabit kalır — bölüm listesi veri değil, sayfa yapısıdır.

- [ ] **Step 6: Built-HTML diff**

```bash
JEKYLL_ENV=production bundle exec jekyll build
diff -w "$SCRATCH/baseline-cv.html" _site/cv/index.html && echo "REGRESYON YOK"
```

Beklenen: **fark yok**. Herhangi bir fark, taşıma sırasında veri kaybı veya biçim kayması demektir; düzeltilmeden devam edilmez.

- [ ] **Step 7: Görsel doğrulama**

`http://localhost:4011/cv/` — her iki tema, 375px viewport, konsol temiz. `statgrid` sayıları (`scholar_metrics`) hâlâ doğru; `cvtoc` bağlantıları doğru bölümlere atlıyor.

- [ ] **Step 8: Commit**

```bash
git add _data/cv.yml _pages/cv.md
git commit -m "refactor: CV verisini _data/cv.yml tek kaynağına taşı, /cv/ sayfasını ondan besle"
```

---

### Task 3: `/service/` ve `/teaching/` sayfalarını `cv.yml`'dan besle

**Files:**
- Modify: `_pages/service.md` (151 satır)
- Modify: `_pages/teaching.md` (169 satır — yalnızca ders **listesi**; tanıtım kartları ve öğretim felsefesi sayfada kalır)

**Interfaces:**
- Consumes: Task 2'nin ürettiği `site.data.cv.service` (`tpc`, `chairing`, `reviewing`, `memberships`, `institutional`), `site.data.cv.talks`, `site.data.cv.courses`

- [ ] **Step 1: Baseline HTML al**

```bash
JEKYLL_ENV=production bundle exec jekyll build
cp _site/service/index.html "$SCRATCH/baseline-service.html"
cp _site/teaching/index.html "$SCRATCH/baseline-teaching.html"
```

- [ ] **Step 2: `service.md`'nin liste bölümlerini döngüye çevir**

`_pages/service.md:12-23` (TPC), `:26-32` (chairing), `:35-54` (peer review), `:57-63` (memberships), `:66-73` (institutional), `:76-150` (talks).

```liquid
<h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-clipboard"/></svg>Technical program committee service</h2>
<ul class="dotlist">
  {% for t in site.data.cv.service.tpc %}<li>{{ t }}</li>
  {% endfor %}
</ul>
```

Talks bölümü `cvrow` yapısını korur; `slides` alanı yoksa `links` div'i hiç basılmaz:

```liquid
{% for t in site.data.cv.talks %}
<div class="cvrow">
  <div class="when tnum">{{ t.date_web }}</div>
  <div class="what">
    <div class="t">{{ t.title }}</div>
    <div class="d">{{ t.venue }}{% if t.host %} — host: {{ t.host }}{% endif %}</div>
    {% if t.slides %}<div class="links"><a class="ext" href="{{ t.slides }}" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-slides"/></svg> Slides</a></div>{% endif %}
  </div>
</div>
{% endfor %}
```

- [ ] **Step 3: `teaching.md`'de yalnızca ders listesini bağla**

Ders tanıtım kartlarındaki açıklama metinleri ve öğretim felsefesi bölümü **dokunulmadan kalır**. `cv.yml`'dan gelen yalnızca ders kodu, adı ve dönem bilgisidir. Bu sınır, `cv.yml`'ın içerik yönetim sistemine dönüşmesini engeller (spec'in temel ilkesi).

- [ ] **Step 4: Built-HTML diff — iki sayfa birden**

```bash
JEKYLL_ENV=production bundle exec jekyll build
diff -w "$SCRATCH/baseline-service.html"  _site/service/index.html  && echo "SERVICE: REGRESYON YOK"
diff -w "$SCRATCH/baseline-teaching.html" _site/teaching/index.html && echo "TEACHING: REGRESYON YOK"
```

Beklenen: her ikisinde de fark yok.

- [ ] **Step 5: Görsel doğrulama**

`/service/` ve `/teaching/` — her iki tema, 375px, konsol temiz. `collist` çok sütunlu peer-review listesi düzgün akıyor; slayt linki olmayan konuşmalarda boş `links` kutusu görünmüyor.

- [ ] **Step 6: Commit**

```bash
git add _pages/service.md _pages/teaching.md
git commit -m "refactor: /service/ ve /teaching/ liste verisini cv.yml'dan besle"
```

---

### Task 4: LaTeX şablonu ve `main.tex` üretimi

En riskli task. Çıktı, gönderilen `main.tex` ile anlamlı fark içermemeli.

**Files:**
- Create: `cv-latex/cv.tex.j2`
- Create: `scripts/render_cv_tex.py`
- Create: `scripts/test_render_cv_tex.py`
- Modify: `_config.yml` — `exclude` listesine `cv-latex/`
- Modify: `scripts/README.md`

**Interfaces:**
- Consumes: `_data/cv.yml` (Task 2), `_data/publications.yml` (Task 1)
- Produces: `render(cv: dict, pubs: list, out_path: Path) -> None` ve saf yardımcılar `tex_escape(s: str) -> str`, `emphasise(s: str) -> str`

- [ ] **Step 1: Referans kopyayı sabitle**

Gönderilen `main.tex` karşılaştırma temeli olarak scratchpad'e konur (repoya **girmez** — spec gereği `main.tex` üretilen artefakttır):

```bash
cp <gönderilen main.tex> "$SCRATCH/main.reference.tex"
wc -l "$SCRATCH/main.reference.tex"
```

- [ ] **Step 2: Saf fonksiyonlar için önce testleri yaz**

```python
"""scripts/test_render_cv_tex.py — stdlib unittest, harici bağımlılık yok."""
import unittest

from render_cv_tex import emphasise, tex_escape


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


class TestEmphasise(unittest.TestCase):
    def test_double_star_becomes_textbf(self):
        self.assertEqual(emphasise("Kurt, S., **Yildiz, H. U.**, & Tavli, B."),
                         r"Kurt, S., \textbf{Yildiz, H. U.}, & Tavli, B.")

    def test_plain_text_unchanged(self):
        self.assertEqual(emphasise("Yildiz, H. U."), "Yildiz, H. U.")

    def test_escape_runs_before_emphasis(self):
        """Sıra kritik: önce kaçış, sonra vurgu — aksi hâlde \\textbf kaçışlanır."""
        self.assertEqual(emphasise(tex_escape("A & **B**")), r"A \& \textbf{B}")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 3: Testleri çalıştır, başarısız olduklarını gör**

```bash
cd scripts && /opt/homebrew/bin/python3.12 -m unittest test_render_cv_tex -v
```

Beklenen: FAIL — `ModuleNotFoundError: No module named 'render_cv_tex'`.

- [ ] **Step 4: Saf fonksiyonları uygula**

```python
#!/usr/bin/env python3
"""_data/cv.yml + _data/publications.yml → main.tex

ÜRETİLEN DOSYA: main.tex elle düzenlenmez. Kaynak _data/cv.yml.
"""
import re

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
    """LaTeX özel karakterlerini kaçışlar. Türkçe karakterlere dokunmaz
    (preamble'da inputenc[utf8] + fontenc[T1] var)."""
    return "".join(_ESCAPES.get(ch, ch) for ch in text)


def emphasise(text: str) -> str:
    r"""Nötr **…** vurgusunu \textbf{…} hâline getirir.
    tex_escape'ten SONRA çağrılmalı."""
    return re.sub(r"\*\*(.+?)\*\*", r"\\textbf{\1}", text)
```

- [ ] **Step 5: Testleri çalıştır, geçtiklerini gör**

```bash
cd scripts && /opt/homebrew/bin/python3.12 -m unittest test_render_cv_tex -v
```

Beklenen: tüm testler PASS.

- [ ] **Step 6: Şablonu mevcut `main.tex`'ten türet**

`$SCRATCH/main.reference.tex` **kopyalanarak** `cv-latex/cv.tex.j2` yapılır, sonra yalnızca tekrar eden bloklar döngüye çevrilir.

Birebir korunacaklar — tek karakter değiştirilmez:
- Tüm preamble (`\documentclass` … `\pdfgentounicode=1`)
- `\titleformat` kuralları, `\fancyfoot` tanımı (`\today` dahil), margin ayarları
- Bölüm başlıkları ve `fontawesome5` ikonları (`\faUser~Summary` vb.)
- Tüm `\vspace{…}` değerleri
- `\begin{comment}` blokları (ölü içerik — kapsam dışı, olduğu gibi kalır)

Döngüye çevrilecekler: yayın listeleri (J/E/C/CT), Professional Experience madde işaretleri, TPC listesi, reviewer listesi, session chair listesi, Courses Taught, Seminars and Invited Talks, Theses Supervised, Certificates, Research Areas.

Jinja2 varsayılan sınırlayıcıları (`{{ }}`, `{% %}`) LaTeX ile çakışmaz — değiştirilmez. Şablonda `{{ }}` yalnızca değişken enterpolasyonu için görünür.

Yayın bloğu örneği:

```jinja
{% for p in journals %}
\noindent [J{{ p.num }}] {{ p.entry }}
{% if not loop.last %}
\vspace{5pt}
{% endif %}
{% endfor %}
```

- [ ] **Step 7: `render()` fonksiyonunu tamamla ve `main.tex` üret**

Yayın numaralandırması (`J24`, `C13`, `CT5`, `E1`) `type` bazında yıla göre azalan sırada otomatik hesaplanır — `publications.yml`'da elle numara tutulmaz.

```bash
/opt/homebrew/bin/python3.12 -m pip install --quiet jinja2 pyyaml
/opt/homebrew/bin/python3.12 scripts/render_cv_tex.py --out "$SCRATCH/main.generated.tex"
```

- [ ] **Step 8: Referans ile diff — planın en kritik kapısı**

```bash
diff "$SCRATCH/main.reference.tex" "$SCRATCH/main.generated.tex" | tee "$SCRATCH/tex.diff"
wc -l "$SCRATCH/tex.diff"
```

**Referans dosya:** `~/Downloads/main.tex` — kanonik sürüm, **temiz UTF-8** (651 satır). Task 2'de doğrudan incelendi. Bu planın ilk sürümünde "mojibake var" denmişti; yanlıştı — o bozulma dosyanın sohbete ek olarak aktarılmasının artefaktıydı. Gerçek karakterler en dash: `link–level`, `47817–47826`, `network flow–based`, `optimization–learning`.

**Yalnızca şu farklar kabul edilir:**
1. Dosya başına eklenen "GENERATED — edit `_data/cv.yml`" uyarı yorumu
2. Boşluk/satır sonu normalizasyonu

**KAPI DEĞİŞTİRİLDİ (Task 4 uygulaması sırasında, kullanıcı kararıyla).** Yukarıdaki "içerik farkı beklenmiyor" kriteri gerçekçi değildi ve terk edildi. Sebep: `_data/cv.yml` verisi web sayfalarından türetildi ve referans `.tex`'ten sistematik olarak ayrışıyor — PDF'te konferans adları baskı için kısaltılmış, hizmet listesi web'de güncellenmiş ama `.tex`'te eski kalmış, tipografi konvansiyonu farklı (`–` ↔ `--`), ayrıca referansta düzeltilmiş yazım hataları var. Bu ayrışma Task 2'de 7 metin çifti olarak zaten görülmüştü; venue ve hizmet düzeyinde de mevcutmuş.

**Yürürlükteki kabul kriteri:** üretilen `main.tex`, referansı taklit etmek yerine **tek kaynaktaki güncel veriyi doğru yansıtmalıdır**. Kullanıcı kararı: güncel veri kazanır. PDF bir kerelik değişir, sonrasında kaynakla kalıcı senkron olur.

Buna göre doğrulama:
1. **Preamble birebir korunmuş** — `\documentclass`…`\pdfgentounicode=1`, `\titleformat`, `\fancyfoot` (`\today` dahil), margin ayarları, bölüm ikonları, `\vspace` değerleri karakter karakter aynı
2. **Veri kaybı yok** — 43 yayın, tür başına doğru numaralandırma (J24/E1/C13/CT5), tüm bölümler, `\begin{comment}` blokları korunmuş
3. **Uydurma veri yok** — çıktıdaki her kayıt `cv.yml`, `publications.yml` veya referansa izlenebilir
4. **PDF derleniyor** — iki geçiş, 6 sayfa (mevcutla aynı), uyarı sayısı referansı derlemekle karşılaştırılabilir
5. Kalan farklar kategorize edilmiş ve her biri gerekçelendirilmiş olmalı

**Başka her fark task'ı reddeder.** Özellikle: kaybolan yayın, değişen sıra, bozulan LaTeX komutu, kaçmış `\&`. Diff'in tamamı kullanıcıya sunulur.

- [ ] **Step 9: Yerel derleme ile PDF'i karşılaştır**

```bash
which pdflatex || echo "TeX Live yerelde yok — bu adım Task 5'te Actions içinde doğrulanacak"
cd "$SCRATCH" && pdflatex -interaction=nonstopmode main.generated.tex >/dev/null 2>&1
pdflatex -interaction=nonstopmode main.generated.tex >/dev/null 2>&1   # \pageref{LastPage} için iki geçiş
/opt/homebrew/bin/python3.12 -c "
import sys
try:
    import pypdf
except ImportError:
    sys.exit('pypdf yok: pip install pypdf')
a = len(pypdf.PdfReader('$SCRATCH/main.generated.pdf').pages)
b = len(pypdf.PdfReader('files/Yildiz_HuseyinUgur_CV.pdf').pages)
print(f'üretilen: {a} sayfa · mevcut: {b} sayfa')
assert a == b, 'SAYFA SAYISI FARKLI — biçim kaymış olabilir'
"
```

Yerelde TeX Live yoksa bu adım atlanır ve doğrulama Task 5'e devredilir; atlandığı açıkça raporlanır.

- [ ] **Step 10: `_config.yml` exclude ve README güncellemesi**

`cv-latex/` `exclude` listesine eklenir — aksi hâlde şablon `huguryildiz.com/cv-latex/cv.tex.j2` adresinden yayına girer. Build sonrası doğrulanır:

```bash
JEKYLL_ENV=production bundle exec jekyll build
ls _site/cv-latex 2>&1 | grep -q "No such file" && echo "EXCLUDE ÇALIŞIYOR"
```

- [ ] **Step 11: Commit**

```bash
git add cv-latex/ scripts/render_cv_tex.py scripts/test_render_cv_tex.py scripts/README.md _config.yml
git commit -m "feat: cv.yml'dan main.tex üreten LaTeX şablonu ve render scripti"
```

---

### Task 5: GitHub Actions entegrasyonu — derleme, yayınlama, fail-closed

**Files:**
- Modify: `.github/workflows/jekyll.yml`

**Interfaces:**
- Consumes: `scripts/render_cv_tex.py` (Task 4)
- Produces: `_site/files/Yildiz_HuseyinUgur_CV.pdf`

- [ ] **Step 1: Build job'ına LaTeX adımlarını ekle**

Mevcut `Build with Jekyll` adımı ile `Upload artifact` adımı **arasına** girer. Sıra kritik: Jekyll `_site/`'ı sıfırdan oluşturduğu için PDF ondan sonra yerleştirilmeli.

```yaml
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install CV renderer dependencies
        run: pip install --quiet jinja2 pyyaml

      - name: Render main.tex from _data/cv.yml
        run: python scripts/render_cv_tex.py --out main.tex

      - name: Compile CV PDF
        uses: xu-cheng/latex-action@v3
        with:
          root_file: main.tex
          latexmk_use_xelatex: false

      - name: Place PDF into the built site
        run: |
          test -s main.pdf || { echo "PDF üretilmedi veya boş"; exit 1; }
          mkdir -p _site/files
          cp main.pdf _site/files/Yildiz_HuseyinUgur_CV.pdf
```

`test -s` kontrolü fail-closed davranışının ikinci katmanı: derleme sessizce boş dosya bırakırsa build burada durur.

- [ ] **Step 2: Günlük cron ekle**

`on:` bloğuna eklenir. `update-goatcounter.yml` zaten günlük deploy tetikliyor; bu, o workflow bir gün veri değişikliği bulamazsa PDF'in yine de tazelenmesini garanti eder.

```yaml
on:
  push:
    branches: ["master"]
  schedule:
    - cron: "17 4 * * *"
  workflow_dispatch:
```

- [ ] **Step 3: Değişikliği push et ve koşuyu izle**

Push deploy tetikler — kullanıcı onayı alınarak yapılır.

```bash
gh run watch
gh run view --log | grep -A5 "Compile CV PDF"
```

- [ ] **Step 4: Canlı PDF'i doğrula**

```bash
curl -sI https://huguryildiz.com/files/Yildiz_HuseyinUgur_CV.pdf | head -3
curl -s https://huguryildiz.com/files/Yildiz_HuseyinUgur_CV.pdf -o "$SCRATCH/live.pdf"
/opt/homebrew/bin/python3.12 -c "
import pypdf
r = pypdf.PdfReader('$SCRATCH/live.pdf')
print(len(r.pages), 'sayfa')
print(r.pages[0].extract_text()[:200])
"
```

Beklenen: HTTP 200, `content-type: application/pdf`, sayfa sayısı Task 4 Step 9 ile aynı, footer'da bugünün tarihi.

- [ ] **Step 5: `/cv/` sayfasındaki indirme butonunu canlıda test et**

`https://huguryildiz.com/cv/` → "Download PDF" tıklanır, dosya iner, açılır. Bu, spec'in "indirme akışı değişmiyor" iddiasının kanıtıdır.

- [ ] **Step 6: Fail-closed davranışını kasten doğrula**

Güvenlik ağı test edilmeden güvenlik ağı sayılmaz.

```bash
git checkout -b test-fail-closed
# cv-latex/cv.tex.j2 içine kasten bozuk LaTeX ekle: \begin{itemize} kapatılmadan bırakılır
git commit -am "test: kasten bozuk LaTeX"
git push origin test-fail-closed
```

Beklenen: workflow **fail** eder, `deploy` job'ı hiç çalışmaz, `https://huguryildiz.com/files/Yildiz_HuseyinUgur_CV.pdf` **hâlâ eski PDF'i** servis eder. Doğrulandıktan sonra branch silinir:

```bash
git checkout master && git branch -D test-fail-closed && git push origin --delete test-fail-closed
```

- [ ] **Step 7: Belgeleri güncelle**

- `CLAUDE.md`: "Data layer" tablosuna `_data/cv.yml` ve `_data/publications.yml` satırları; `_pages/cv.md` ve `files/…CV.pdf`'in "bağımsız artefaktlar" olduğunu söyleyen bölüm artık **yanlış** — düzeltilir. "GitHub Actions" bölümüne LaTeX derleme adımı eklenir.
- `AGENTS.md`: source-of-truth tablosuna aynı satırlar.
- `README.md`: içerik bakım prosedürüne "CV güncellemek = `_data/cv.yml` düzenlemek" eklenir.
- `scripts/README.md`: `render_cv_tex.py` **live** olarak sınıflandırılır.

- [ ] **Step 8: Commit**

```bash
git add .github/workflows/jekyll.yml CLAUDE.md AGENTS.md README.md scripts/README.md
git commit -m "ci: CV PDF'ini her deploy'da derle ve _site/files/ altına yayınla"
```

---

## Self-Review Notları

**Spec kapsamı:** Spec'teki her gereksinim bir task'a bağlı — `_data/cv.yml` (T2), `_data/publications.yml` (T1), `cv-latex/cv.tex.j2` + `render_cv_tex.py` (T4), web sayfaları (T2, T3), Actions + fail-closed + cron (T5), `_config.yml` exclude (T4 `cv-latex/`; `docs/` bu plan yazılmadan önce eklendi ve `b126318` ile push edildi), mojibake düzeltmeleri (T4 Step 8), `\today` korunumu (T4 Step 6).

**Açık kalan karar:** Task 2 Step 2 — web ve LaTeX özet metinleri ayrışmış durumda. Bu içerik kararı kullanıcıya sorulacak; iş bloke olmasın diye her iki alan da şemada tutuluyor.

**Bilinçli kapsam dışı:** `_pages/students.md`, Scholar/OpenAlex'ten otomatik yayın büyütme, `scripts/cv_markdown_to_json.py` ve `_data/cv.json` (dormant), Overleaf ↔ GitHub senkronu.

**Bilinen sürtünme:** Yerelde TeX Live kurulu olmayabilir; o durumda PDF doğrulaması Task 5'e devredilir ve atlandığı raporlanır (Task 4 Step 9).
