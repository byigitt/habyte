# habyte — görsel dil

Bu dosya bağlayıcıdır. Yeni bir ekran yazan herkes (insan ya da model) önce
bunu okur ve token'ların dışına çıkmaz. Amaç: ürünün kendine ait bir görüşü
olsun, "her yerdeki üretilmiş arayüz" gibi durmasın.

## Yön: Kalkış panosu

Havalimanı salonundaki Solari panosu. Koyu panel, kehribar karakterler,
menteşesinden dönen flap hücreleri. Ürünün tezi "ekrandan çık, gerçek bir şey
yap" olduğu için arayüz bir uygulama gibi değil, bir **tarife** gibi davranır:
sana bir uğraş atar, saatini tutar, indiğinde kaydeder.

Metafor arayüzün her yerinde tutarlı — süsleme değil, bilgi mimarisi:

| Ekran       | Pano karşılığı                                         |
| ----------- | ------------------------------------------------------ |
| `/`         | Kalkış panosu — konsoldan koşulu kur, tamburu çevir     |
| `/session`  | Biniş — dev flip saat, durum lambası, ilerleme şeridi   |
| `/gecmis`   | Varışlar — inen her oturum bir satır                    |
| `/siralama` | Hatlar — uğraşlarının kendi içindeki tablosu            |

Sözlük de buna uyar: _kalkış_, _biniş_, _iniş_, _hat_, _tarife_, _künye_.
"Çark" kelimesi arayüzde geçmez; dönen şey tamburdur.

## Yasaklar (slop testi)

Aşağıdakiler kod incelemesinde doğrudan geri çevrilir. `npm run design:check`
bunların çoğunu makine olarak da kovalar:

- Mor→cyan / indigo→pembe gradient, herhangi bir dekoratif gradient blob.
- Glassmorphism: `backdrop-blur` + yarı saydam kart + neon parıltı.
- Renkli `box-shadow` glow. Gölge sadece nötr ve çok düşük opaklıkta.
- Yan yana altı özdeş kart; her biri ikon + başlık + iki satır metin.
- Hover'da `scale`/zıplama, sebepsiz `animate-pulse`.
- Arayüzde emoji. Anlam taşıyan her simge lucide ikonudur.
- Tailwind varsayılan palet adları (`indigo-500`, `slate-800`).
- Emekli kağıt token'ları (`bg-paper`, `text-ink`, `text-accent`). Bunlar
  "Almanak" döneminden kalma; geri sızarlarsa iki dil karışır.
- Ortalanmış tek sütun düzeni. Pano geniştir, sola dayanır, sütunlar hizalıdır.

## Renk

Palet koyu ve sıcak; saf siyah da saf beyaz da yok. Tek vurgu kehribar.

| Token           | Değer     | Kullanım                            |
| --------------- | --------- | ----------------------------------- |
| `--deck`        | `#0B0C0E` | sayfa zemini, panonun dışı          |
| `--board`       | `#15171B` | panel gövdesi                       |
| `--cell`        | `#1C1F25` | flap hücresi, konsol tuşu           |
| `--seam`        | `#08090A` | menteşe, panel başlığı, girinti     |
| `--rule`        | `#2B2F37` | 1px çerçeve                         |
| `--rule-soft`   | `#21252B` | satır ayırıcı                       |
| `--char`        | `#EFE7D6` | karakter, ana metin                 |
| `--char-2`      | `#9B978A` | ikincil metin                       |
| `--char-3`      | `#7A766C` | meta etiket                         |
| `--amber`       | `#E9A33A` | tek vurgu: kalkış, seri, birincil   |
| `--amber-wash`  | `#2A2115` | seçili satır / tuş dolgusu          |
| `--go`          | `#85AC5E` | tamamlandı                          |
| `--halt`        | `#C8543A` | yıkıcı işlem                        |

Hat renkleri koyu pano üzerinde okunacak parlaklıkta ve birbirine yakın
tutuldu ki bir sütunda alt alta dururken hiçbiri öne fırlamasın:

`zihin #6E9BD1` · `beden #E0674A` · `yaratici #E5A93F` · `beceri #8FBE68` ·
`sosyal #D07BA6` · `huzur #5FC0AE`

## Tipografi

İki aile. Pano yüzü mono, çevresindeki her şey tek bir grotesk.

- **Archivo** — `--font-display` ve `--font-sans`. Değişken, `latin-ext`.
  Sıkı, endüstriyel, tabela kökenli bir grotesk. Başlıklarda `-0.015em`.
- **JetBrains Mono** — `--font-mono`. Flap karakterleri, sayaç, sütun
  başlıkları, konsol tuşları, bütün sayısal veri.

Ölçek: `h1 26 · h2 19-24 · body 14/1.6 · small 13 · meta 10 mono`.
`meta` her zaman mono, `uppercase`, `0.18em` aralıklı. Sayı gösteren her yerde
`font-variant-numeric: tabular-nums`.

## Düzen

- Her bölüm bir **panel**: `board-panel` çerçevesi, üstünde `board-head`
  bandı (sol tarafta ne olduğu, sağ tarafta durumu).
- Tablolar `board-cols` sütun başlığı satırıyla açılır; hücreler grid ile
  hizalanır, `gap` ile değil. Başlık grid'i satır grid'iyle aynı olmalı.
- Ana ekran asimetrik: solda sabit 236px konsol rayı, sağda pano. Simetrik
  iki sütun yok.
- Yarıçap: `1px` (buton), `2px` (panel), flap hücresi ve konsol tuşu `0`.
  `rounded-full` yalnızca gerçek daireler için.
- Panel içi dolgu `16px`, geniş ekranda `24px`. Satır yüksekliği sabit
  kalsın diye uzun sayısal değerler `whitespace-nowrap`.

## Hareket

- Süre `140ms`, `ease-out`; renk ve kenarlık geçişleri.
- Tek karakterli hareket flap'tir: `flap-drop`, `110ms`, üst menteşeden
  `rotateX(-78deg)` → `0`. Her karakter değişiminde yeniden oynar.
- Tambur **yalnızca ileri** döner ve `easeOutCubic` ile yavaşlar. Hücreler
  soldan sağa `stagger` ile gecikir; pano dalga hâlinde durur.
- İki tambur var: `full` (alfabe) ve `clock` (yalnızca rakam). Saat için
  `full` kullanılmaz, yoksa 9'dan 0'a geçmek bütün alfabeyi dolaşır.
- `prefers-reduced-motion` açıkken tambur dönmez, hedefe anında oturur.

## İkon

`lucide-react`, `strokeWidth 1.5`, boyut 13/15/22. Her uğraşın ikonu
`src/lib/icons.ts` içindeki kayıt defterinde tanımlıdır; katalogda serbest
string yoktur, `IconKey` tipiyle derleme zamanında doğrulanır.
