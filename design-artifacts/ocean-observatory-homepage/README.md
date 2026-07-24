# Ocean Observatory — Ana Sayfa Motion-Design Prototipi

Tasarım onayı için hazırlanmış, **repo dışı** çalışan prototip. Hiçbir repo dosyası
değiştirilmedi; Git durumu olduğu gibi bırakıldı.

## Çalıştırma

```bash
cd ~/.codex/visualizations/ocean-observatory-homepage
python3 -m http.server 8137
# → http://localhost:8137/index.html
```

(`file://` ile de açılır; ancak Chrome yerel fontları CORS nedeniyle engelleyebilir,
bu yüzden küçük bir HTTP sunucusu önerilir.)

Dosyalar: `index.html` (statik-önce içerik), `styles.css` (redesign.css token'larının
aynası + yeni hero/plaque düzeni), `twin.js` (bağımsız canvas sahnesi),
`assets/` (siteden kopyalanan portre, fontlar, yazılım ikonları), `screens/` (ekran görüntüleri).

---

## 1. Animasyon konsepti: “Acoustic Network Awakening”

Ana sayfanın imza hareketi **tek bir bilimsel olayı** anlatır: yüzey şamandırası
BS-1'in gönderdiği akustik senkronizasyon darbesinin, convergecast topolojisi
üzerinden 21 sensöre ulaşması.

- **Faz 1 — Yüzey işareti (0–0.55 s):** BS-1'den tek, ölçülü camgöbeği halka.
  Parlama yok; “iletim” anlamı taşır, süsleme değil.
- **Faz 2 — Ağ senkronizasyonu (0.45–2.3 s):** Düğümler BS-1'e hop mesafesine göre
  sıralanır ve ~88 ms arayla griden (offline) operasyonel renklerine geçer; ebeveyn→çocuk
  kenarı stroke-progression ile çizilir; birincil (düz) ve yedek (kesikli, k=2) rotalar
  sona doğru belirir.
- **Faz 3 — Operasyonel durum (~2.4 s):** BS-1'de tek onay halkası; plaque
  180–240 ms crossfade ile “Network synchronized — all 21 sensors reporting” metnine
  geçer; “SIMULATED SCENARIO” çipi hep görünür kalır. **≤2.5 s** içinde sahne tamamen durur.

Bu hareket araştırma kimliğini doğrudan taşır: sayfa, “fiziksel kısıtlar altında
dayanıklı ağlar için optimizasyon” önermesini *söylerken*, sahne aynı önermeyi
*çalışır hâlde gösterir* (yönlendirme, k-bağlantılılık, enerji-verimli convergecast).
Animasyon dekor değil, ağın nasıl çalıştığının açıklamasıdır.

### Rehberli gözlem döngüsü

Uyanıştan ~3.5 s sonra, 8 s'de bir tek katman vurgulanır:
**Network → Security → Habitat → Seismic**. Her geçişte kamera 620 ms'lik tek bir
ease-out-quint interpolasyonu ile ilgili bölgeye odaklanır ve **tamamen durur**
(sürekli orbit yok); diğer katmanlar %38'e soluklaşır ama kaybolmaz. Katman başına
anlamlı minimum hareket: cyan paketler topoloji üzerinde (network), belirsizlik
bölgesinde tek yavaş genişleme (security), yosunlarda hafif akıntı salınımı (habitat),
FZ-1 üzerinde tek okunabilir dalga cephesi (seismic, <3 Hz).

---

## 2. Motion spec tablosu

| # | Hareket | Trigger | Süre | Easing | Anime edilen özellikler | Kesilme davranışı | Reduced-motion alternatifi |
|---|---|---|---|---|---|---|---|
| 1 | Yüzey darbesi (BS-1 halkası) | Sayfa idle (load + ~700 ms, `requestIdleCallback`) | 550 ms | ease-out-quart | canvas halka yarıçapı + opaklık | Drag/klavye → kalan sekans çalışmaya devam eder, kamera kullanıcıya geçer | Çalışmaz; sahne senkronize hâlde statik açılır |
| 2 | Düğüm aktivasyonu (21 düğüm) | Darbe bitişi (t=0.45 s) | düğüm başına 280 ms, 88 ms stagger (toplam ~1.9 s) | smoothstep/ease-out-quart | düğüm opaklığı, ölçek (0.72→1), kenar stroke-progression | Aynı; katman butonları ve seçim her an çalışır | Tüm düğümler baştan aktif, rotalar görünür |
| 3 | Rota belirmesi (birincil/yedek) | t≈1.6 s | ~700 ms | linear alpha ramp | çizgi opaklığı | Aynı | Baştan görünür |
| 4 | Senkron onayı + plaque değişimi | Son düğüm aktif (t≈2.4 s) | halka 1.2 s; metin 210 ms crossfade | ease-out; CSS opacity | halka; `#plq-text` opacity | — | Statik “Network overview” metni |
| 5 | Spotlight kamera odağı | Döngü zamanlayıcısı (8 s'de bir) | 620 ms | ease-out-quint | camera yaw/pitch/zoom/pan (canvas) | Pointer-down anında tween iptal, doğrudan drag; hover/focus/kontrol açma döngüyü bekletir; seçim kilitler | Kamera interpolasyonu yok; manuel katman filtreleri anlık |
| 6 | Plaque crossfade | Spotlight değişimi | 210 ms | CSS ease | opacity | Yeni metin anında yazılır (fade iptal) | Anlık metin değişimi |
| 7 | Katman vurgusu (dim/emphasize) | Spotlight değişimi | ~350 ms | exponansiyel yaklaşım | katman alpha çarpanı | Aynı | Vurgu yok; tüm katmanlar eşit |
| 8 | Network paketleri | Network spotlight aktifken | paket başına 0.8 s/segment; 1.35 s arayla | smoothstep | paket konumu (topoloji kenarları üzerinde) | Pause → durur; spotlight bitince biter | Çalışmaz |
| 9 | Security belirsizlik bölgesi | Security spotlight girişi | tek 3.2 s döngü, sonra statik | sinüs zarfı (tek sefer) | elips yarıçapı ±%22, opaklık | Pause → durur | Statik kesikli amber elips |
| 10 | Seismic dalga cephesi | Seismic spotlight girişi | tek yayılım ~3.5 s (0.24 birim/s), sonra statik | lineer yayılım + fade-out | çift halka (turuncu + menekşe) yarıçapı/opaklığı | Pause → durur | Statik epicentre işareti + kesikli bağlam halkası |
| 11 | Habitat akıntı salınımı | Habitat spotlight aktifken | sürekli, 0.8 rad/s, ±2 px | sinüs | yosun uç kontrol noktası | Spotlight bitince durur | Çalışmaz |
| 12 | Drag bırakma yavaşlaması | pointerup (hareketli drag sonrası) | ~300–400 ms (v×0.86/frame) | üstel sönüm | camera yaw | Yeni pointerdown anında iptal | Yavaşlama yok; drag bırakınca anında durur |

Genel kurallar: hiçbir CSS layout özelliği anime edilmez (yalnızca canvas içi çizim +
DOM'da opacity); rAF sekme gizliyken ve hero viewport dışındayken durur
(`visibilitychange` + `IntersectionObserver`); DPR ≤ 2; sahne statik olduğunda kare
çizimi atlanır (dirty-flag).

---

## 3. Ekran görüntüleri (`screens/`)

| Dosya | Viewport |
|---|---|
| `desktop-1440x900-dark.png` | 1440×900, koyu tema, network spotlight |
| `desktop-1440x900-light.png` | 1440×900, açık tema |
| `tablet-1024x768.png` | 1024×768, iki kolon korunur, plaque tek kolon |
| `mobile-390x844.png` | 390×844, sıra: kimlik → ikiz (security spotlight) |
| `mobile-390x844-plaque.png` | 390×844, plaque + birincil aksiyonlar + metrik rayı |
| `mobile-320x720.png` | 320×720, yatay taşma yok, ≥44 px dokunma hedefleri |

Doğrulananlar: 320 px'te `scrollWidth == innerWidth` (taşma yok); reduced-motion
modunda statik tam topoloji + çalışan katman kontrolleri; Pause `aria-pressed` +
“Resume” etiketi; seçim plaque'ta detay alanları (Depth, Hops→BS, Route, Data: Simulated);
canlı bölge (`aria-live=polite`) spotlight ve seçim duyuruları.

---

## 4. Uygulama etki notu (repo'da nihai olarak değişecek dosyalar — DEĞİŞTİRİLMEDİ)

| Dosya | Beklenen değişiklik |
|---|---|
| `index.md` | Hero yeniden yapılanır: `home-intro-grid` (biyografi+ikiz yan yana) kalkar; kimlik/aksiyonlar sol, ikiz+plaque sağ; biyografi kısaltılıp metrik rayının hemen altına (kullanıcı tercihiyle Current research program'ın üstüne) iner; LinkedIn embed bölümü korunur/aşağıda kalır |
| `_includes/hero-uwsn.html` | Uyanış sekansı (`phase` durum makinesi), rehberli spotlight döngüsü, plaque API'si, “Explore” progressive-disclosure eklenir; mevcut `tScale/EVENTS`, zaman çubuğu, olay kaydı ve seçim paneli **full/explore modda** korunur; idle kamera salınımı (`camYawT=−0.45+0.05·sin`) kaldırılır (spatially stable gereksinimi) |
| `assets/css/redesign.css` | `.hero` 42/58 grid'e; `.plaque`, `.twin-state`, mobil sıralama (grid-template-areas) ve 1180/860/400 px kırılımları eklenir |
| `_pages/` diğerleri | Değişiklik yok |
| `_includes/icons.html`, `_layouts/academic.html` | Değişiklik gerekmez (belki 1–2 ikon eklenir) |

Prototipteki `twin.js`, canlı `hero-uwsn.html`'in sadeleştirilmiş bir uyarlamasıdır;
gerçek entegrasyonda yeni bir dosya değil, mevcut include'a yama olarak uygulanması önerilir.

---

## 5. Belirsizlikler

1. **“21 sensör” sayısı** mevcut sahne topolojisinden (6 OBS + 12 röle + 3 habitat)
   türetildi ve simülasyon etiketi altındadır; canlı bileşendeki sayıyla birebir aynıdır.
2. **Mevcut zaman çubuğu/olay kaydı** prototipte yok (progressive disclosure'ın
   "full mode" katmanına ait); entegrasyonda korunacakları varsayıldı — onaylanmalı.
3. **LinkedIn embed'leri** prototipe alınmadı (dış iframe yasağı); ana sayfadaki yeri
   entegrasyonda tartışılmalı.
4. **Biyografi konumu** kullanıcı isteğiyle metrik rayının hemen altına alındı; brief
   "daha geç" diyordu — mevcut sıra kullanıcı tercihidir.
5. **Akademisyen ikonları (Academicons)** prototipte metin bağlantısı olarak duruyor;
   canlı sitede CDN ikonları korunur.
6. **Işık temasında ikiz çerçevesi** her zaman koyu (okyanus sahnesi); tasarım gereği
   böyle bırakıldı.
