# CV tek kaynak senkronu — tasarım

**Tarih:** 2026-07-26
**Durum:** onaylandı, uygulama planı bekliyor

## Problem

CV üç ayrı yerde, elle, birbirinden bağımsız tutuluyor:

1. Overleaf'teki `main.tex` → elle derlenip `files/Yildiz_HuseyinUgur_CV.pdf` olarak yüklenen PDF (son yükleme: Şubat 2026)
2. `_pages/cv.md` → 272 satır elle yazılmış HTML
3. `_pages/publications.md`, `_pages/service.md`, `_pages/teaching.md` → LaTeX CV'nin yayın, hizmet ve ders bölümlerinin web karşılıkları

Üçü şimdiden ayrışmış durumda. Somut örnek: LaTeX özetinde *"quantum communication systems"*, web özetinde *"quantum network routing"*. Bir yere yapılan ekleme diğerlerine yansımıyor ve hangisinin güncel olduğu belirsiz.

## Hedef

Tek yazım noktası. Bir kayıt bir kez girilir; hem PDF hem ilgili web sayfaları ondan üretilir. PDF her deploy'da yeniden derlenir, dolayısıyla footer tarihi güncel kalır.

## Reddedilen alternatif: çift yönlü senkron

İlk istek "web'e ekleyince .tex güncellensin, .tex'e ekleyince web güncellensin" biçimindeydi. Bu iki ayrı yazılabilir kaynak demektir; çakışma çözümü gerektirir ve kaçınılmaz olarak bozulur. Aynı sonucu tek yönlü üretimle veren tek kaynak modeli seçildi.

## Temel ilke

**`cv.yml` veri tutar, anlatı tutmaz.**

Kayıt/liste verisi (ders kodları ve dönemleri, TPC üyelikleri, tez kayıtları, görev tarihleri, yayın künyeleri) tek kaynaktan gelir. Uzun açıklama metinleri (öğretim felsefesi, `teaching.md`'deki ders tanıtım kartları) ilgili sayfada kalır. Bu sınır olmazsa `cv.yml` bir içerik yönetim sistemine dönüşür.

## Mimari

Akış tek yönlü. Hiçbir çıktı kaynağa geri yazmaz.

```text
_data/cv.yml ──────────┬─→ Liquid ─→ /cv/  /service/  /teaching/ ─┐
_data/publications.yml ┤                                          ├─→ _site/
                       ├─→ Liquid ─→ /publications/ ──────────────┘
                       │
                       └─→ scripts/render_cv_tex.py + cv-latex/cv.tex.j2
                             └─→ main.tex ─→ TeX Live ─→ _site/files/Yildiz_HuseyinUgur_CV.pdf
```

### Bileşenler

| Yol | Rolü | Public? |
|---|---|---|
| `_data/cv.yml` | Tek kaynak: kişi bilgileri, özet, görevler, eğitim, tezler, ödüller, beceriler, sertifikalar, diller, hizmet (TPC / hakemlik / oturum başkanlığı / kurumsal), dersler, seminerler, üyelikler, araştırma alanları | hayır (`_data`) |
| `_data/publications.yml` | `_pages/publications.md:74`'teki `PUBS` dizisinin taşınmış hâli, alanlar aynen | hayır (`_data`) |
| `cv-latex/cv.tex.j2` | Jinja2 şablonu. Mevcut `main.tex`'ten türetilir | **exclude gerekir** |
| `scripts/render_cv_tex.py` | YAML → `main.tex`; LaTeX kaçışı ve işaretleme dönüşümü | hayır (`scripts/` zaten exclude) |

`main.tex` **repoda tutulmaz.** Üretilen bir artefakttır; Actions içinde üretilir, derlenir, atılır. Yerelde denetim için script elle çalıştırılabilir. Repoda bir kopya tutmak, zamanla kaynakla drift edecek ikinci bir gerçek yaratırdı.

### LaTeX şablonu

Şablon sıfırdan yazılmaz. Mevcut `main.tex` doğrudan şablona dönüştürülür:

- **Birebir korunur:** tüm preamble (`titlesec`, `fancyhdr`, `fontawesome5`, `bold-extra`, `enumitem`, margin ayarları), `\titleformat` kuralları, bölüm ikonları, `\vspace` değerleri, footer biçimi (`\today · Huseyin Ugur Yildiz · \thepage/\pageref{LastPage}`)
- **Döngüye çevrilir:** yalnızca tekrar eden içerik blokları (`\noindent [J24] …`, görev kalemleri, TPC listesi, ders listesi, tez kayıtları)
- **Yorum bloklarında duran ölü içerik** (`\begin{comment}` içindeki eski özet, biyografi, referanslar) şablonda olduğu gibi bırakılır — kapsam dışı

### İki uyum sorunu

1. **Yazar vurgusu.** `publications.md`'de `authors` alanı `<b>Yildiz, H. U.</b>` HTML'i içeriyor. YAML'da nötr `**Yildiz, H. U.**` işareti kullanılır; Liquid `<b>`'ye, Python `\textbf{}`'ye çevirir.
2. **LaTeX kaçışı.** `&`, `%`, `_`, `#`, `$` gibi LaTeX özel karakterleri `render_cv_tex.py` içinde kaçışlanır. Kaynakta halihazırda `Computer Standards \& Interfaces` gibi kaçışlı metinler var; YAML'a taşınırken kaçışsız yazılır, kaçış tek yerde (üretimde) yapılır. Türkçe karakterler kaçış gerektirmez — preamble'da `inputenc[utf8]` ve `fontenc[T1]` mevcut, doğrudan yazılabilirler.

3. **Encoding — düzeltilmiş tespit.** Bu spec ilk yazıldığında kaynak dosyada mojibake olduğu sanılmıştı (`Â·`, `linkâlevel`, `47817â47826`). Task 2 sırasında kanonik dosya (`~/Downloads/main.tex`) doğrudan incelendi: dosya **temiz UTF-8**, gerçek karakterler en dash (`link–level`, `47817–47826`, `network flow–based`, `optimization–learning`) ve `·`. Mojibake, dosyanın sohbete ek olarak aktarılırken latin-1 yorumlanmasının artefaktıydı. Sonuç: YAML'a bu karakterler **olduğu gibi** taşınır ve doğrulama kriteri 1'de mojibake düzeltmesi **beklenmez** — üretilen `main.tex` referansla karşılaştırıldığında içerik farkı çıkmamalıdır.

## Otomasyon

`jekyll.yml`'a LaTeX derleme adımı eklenir:

1. `python scripts/render_cv_tex.py` → `main.tex`
2. TeX Live (Docker image) ile derle
3. Çıktıyı `_site/files/Yildiz_HuseyinUgur_CV.pdf` olarak yerleştir
4. Artifact yükle, deploy et

PDF git deposunda durmaz. Yayın adresi değişmez: `https://huguryildiz.com/files/Yildiz_HuseyinUgur_CV.pdf`. `_pages/cv.md:13`'teki indirme butonu ve tüm mevcut linkler olduğu gibi çalışır.

**Günlük tazelik.** `update-goatcounter.yml` zaten günlük commit atıp deploy tetikliyor. Garanti için `jekyll.yml`'a ayrıca günlük `schedule` cron'u eklenir.

**Footer tarihi.** `\today` mevcut hâliyle korunur — PDF her derlemede o günün tarihini taşır. (İçerik tarihi ile derleme tarihini ayrı gösterme önerisi sunuldu, reddedildi.)

**Başarısızlık davranışı — fail-closed.** LaTeX derlemesi hata verirse build job'ı fail eder ve deploy hiç gerçekleşmez. Canlıda bir önceki site ve bir önceki PDF olduğu gibi kalır. Bozuk veya eksik bir PDF ziyaretçiye asla ulaşmaz.

## `_config.yml` exclude eklemeleri

Bu repoda `exclude` listesinde olmayan her tracked yol public URL'e dönüşür. Eklenecekler:

- `cv-latex/` — LaTeX şablonu
- `docs/` — bu spec dosyası dahil

## Doğrulama kriterleri

Uygulama ancak bunların hepsi sağlandığında tamamlanmış sayılır:

1. Üretilen `main.tex`, mevcut Overleaf sürümüyle `diff`'lendiğinde yalnızca kabul edilmiş farkları gösterir
2. Derlenen PDF'in sayfa sayısı mevcutla aynı; iki PDF sayfa sayfa görsel olarak karşılaştırılır ve biçimsel fark bulunmaz
3. `/cv/`, `/service/`, `/teaching/`, `/publications/` sayfaları şablona geçmeden önce ve sonra screenshot ile karşılaştırılır; görsel regresyon yok
4. `/publications/` sayfasındaki tür/yıl/quartile filtreleri, donut grafikleri, yıl histogramı ve atıf grafiği çalışır durumda; tarayıcı konsolu temiz
5. Her iki tema (açık/koyu) ve dar viewport'ta kontrol edilir
6. LaTeX derlemesi kasten bozulduğunda build fail eder ve deploy tetiklenmez

## Riskler

- **`publications.md` en kırılgan nokta.** 485 satır HTML+JS; filtreleme ve grafikler `PUBS` dizisine bağlı. Dizi Liquid `jsonify` ile üretilecek. Repo CLAUDE.md'sindeki tuzak burada özellikle geçerli: `compress` layout satır sonlarını sildiği için sayfa JS'inde `//` yorumu kalan tüm scripti yutar — yalnızca `/* */` kullanılır.
- **Deploy süresi.** Her deploy'a TeX Live derlemesi için ~2-3 dk eklenir. Site build'i şu an <1 sn.
- **Kapsam büyüklüğü.** Beş sayfa (`cv`, `publications`, `service`, `teaching` ve dolaylı olarak `index`) şablona dönüşüyor. Bu tek seferlik iş, bir günlük mertebede.

## Kapsam dışı

- `_pages/students.md` — bu turda dokunulmaz
- Yayın listesinin Scholar/OpenAlex'ten otomatik büyütülmesi — bibliyometrik API'ler eksik ve yanlış kayıt döndürebilir; uydurma yayın riski taşır
- `scripts/cv_markdown_to_json.py` ve `_data/cv.json` — dormant utility, bu tasarımla ilgisi yok
- Overleaf ↔ GitHub senkronu — Overleaf akıştan çıkarıldı
