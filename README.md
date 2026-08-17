# habyte

Doom scrolling yerine kalkış panosunu çevir, günde 1-2 saatlik gerçek bir uğraş
edin, yaptığını kaydet.

## Akış

1. **Kalkış** (`/`) — Soldaki konsoldan süreyi, hattı ve zorluk tavanını kur; panoyu çevir. Tambur döner ve sana bir uğraş atar.
2. **Biniş** (`/session?habit=<id>&minutes=<n>`) — Flip saat başlar; duraklat, devam et, hedefi geçersen sayaç yukarı sayar.
3. **İniş raporu** — Bitirince ruh hali + not ekleyip kaydet.
4. **Varışlar** (`/gecmis`) — Seri, toplam süre, seviye/XP, son 14 gün, iniş kayıtları, yedek al/yükle.
5. **Hatlar** (`/siralama`) — Uğraşlarının kendi içindeki tablosu; global sıralama hesaplarla birlikte gelecek.

## Çalıştırma

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # üretim derlemesi
npm run lint
```

## Mimari

```
src/
  app/            # Next.js App Router sayfaları
  components/     # SplitFlap, SessionRunner, HistoryView, Nav, Mark, Glyph
  lib/
    habits.ts     # aktivite katalogu (24 uğraş)
    icons.ts      # ikon kayıt defteri + v1 emoji göçü
    types.ts      # Habit, SessionLog, Profile
    storage.ts    # HabyteRepository arayüzü + localStorage implementasyonu
    stats.ts      # XP, seviye, seri, günlük kırılım, formatlayıcılar
    useHabyte.ts  # React tarafı veri erişimi
```

MVP'de bütün veri `localStorage`'da (`habyte.v1.*` anahtarları). Uygulama koduna bu
detay sızmıyor: her okuma/yazma `HabyteRepository` üzerinden geçiyor.

### Puanlama

XP = dakika × zorluk katsayısı (1x / 1.25x / 1.5x). Seviye eşikleri 300 XP'den
başlayıp her seviyede 150 XP artıyor. Seri, gün bazında hesaplanır; bugün henüz
bir oturum yoksa seri kırılmaz, dünden geriye sayılır.

## Tasarım

Görsel dil [`DESIGN.md`](./DESIGN.md) içinde kilitli: "Kalkış panosu" yönü, koyu
pano paleti, tek kehribar vurgu, panel + sütun düzeni ve mono meta etiketler.
Yeni ekran yazmadan önce o dosya okunur; gradient/glassmorphism gibi kalıplar
orada açıkça yasaklı ve `npm run design:check` bunları makine olarak kovalıyor.

- **Tipografi**: Archivo (başlık ve metin), JetBrains Mono (pano yüzü, sayaç,
  etiketler) — ikisi de değişken ve Türkçe (`latin-ext`).
- **Tambur**: `src/components/SplitFlap.tsx`. Yalnızca ileri dönen, hedefe
  `easeOutCubic` ile oturan Solari hücreleri. Alfabe ve saat için iki ayrı
  tambur var; `prefers-reduced-motion` açıkken dönmez.
- **İkonlar**: `lucide-react`. Arayüzde emoji yok; her uğraşın simgesi
  `src/lib/icons.ts` içindeki kayıt defterinde `IconKey` tipiyle tanımlı.
  Emoji saklayan v1 kayıtları okunurken otomatik olarak ikon anahtarına çevriliyor.

## Sonraki adımlar

- **Hesaplar + sunucu**: `HabyteRepository`'nin API'ye konuşan bir implementasyonu.
  Oturum kaydı zaten cihazdan bağımsız bir şema (`SessionLog`) kullanıyor.
- **Global sıralama**: Haftalık XP'ye göre; `computeStats` sunucuda da aynı sonucu
  üretecek şekilde saf fonksiyon olarak yazıldı.
- **Mobil**: `src/lib` (katalog, tipler, istatistik, ikon anahtarları) React Native/Expo
  ile paylaşılabilir; `lucide-react-native` aynı isimleri kullanıyor. Taşınması gereken
  tek şey depolama katmanı (AsyncStorage) ve ekranlar.
- Arkadaş/grup meydan okumaları, hatırlatıcılar, aktivite başına ilerleme rehberleri.
