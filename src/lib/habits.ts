import type { Category, Habit } from "./types";

/**
 * Koyu pano uzerinde okunan hat renkleri. Parlakliklari birbirine yakin
 * tutuldu ki bir sutunda alt alta dururken hicbiri one firlamasin.
 */
export const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: "zihin", label: "Zihin", color: "#6e9bd1" },
  { id: "beden", label: "Beden", color: "#e0674a" },
  { id: "yaratici", label: "Yaratıcı", color: "#e5a93f" },
  { id: "beceri", label: "Beceri", color: "#8fbe68" },
  { id: "sosyal", label: "Sosyal", color: "#d07ba6" },
  { id: "huzur", label: "Huzur", color: "#5fc0ae" },
];

export const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Kolay başlangıç",
  2: "Orta",
  3: "Meydan okuma",
};

export const HABITS: Habit[] = [
  {
    id: "rubik",
    name: "Rubik Küp Çözmek",
    icon: "cube",
    category: "beceri",
    difficulty: 2,
    minMinutes: 20,
    maxMinutes: 60,
    description:
      "Katman katman çözüm yöntemiyle küpü çözmeyi öğren. Kas hafızası birkaç günde oturuyor.",
    firstStep:
      "Sadece beyaz artıyı (white cross) yapmayı öğren. Bugünün tek hedefi bu.",
    gear: "Bir adet 3x3 küp",
  },
  {
    id: "kitap",
    name: "Kitap Okumak",
    icon: "book",
    category: "zihin",
    difficulty: 1,
    minMinutes: 20,
    maxMinutes: 90,
    description:
      "Telefon başka odada, tek iş okumak. Dikkat süresini geri kazanmanın en hızlı yolu.",
    firstStep:
      "Yarım bıraktığın ya da hep merak ettiğin kitabı aç, 20 sayfa oku.",
  },
  {
    id: "gitar",
    name: "Gitar Çalmak",
    icon: "guitar",
    category: "yaratici",
    difficulty: 2,
    minMinutes: 20,
    maxMinutes: 60,
    description:
      "4 akorla çalabileceğin yüzlerce şarkı var. Parmak uçların ilk hafta acır, sonra geçer.",
    firstStep: "Em, G, C, D akorlarını temiz basmaya çalış.",
    gear: "Gitar",
  },
  {
    id: "cizim",
    name: "Çizim / Eskiz",
    icon: "pen",
    category: "yaratici",
    difficulty: 1,
    minMinutes: 20,
    maxMinutes: 60,
    description:
      "Yetenek değil tekrar işi. Gördüğünü çizmek gözünü hızla eğitiyor.",
    firstStep: "Masandaki bir nesneyi 20 dakika boyunca tek bir çizimde çiz.",
    gear: "Kağıt ve kalem",
  },
  {
    id: "kod",
    name: "Kod Yazmak",
    icon: "terminal",
    category: "beceri",
    difficulty: 3,
    minMinutes: 45,
    maxMinutes: 120,
    description:
      "Tutorial izlemek değil, küçük de olsa çalışan bir şey bitirmek.",
    firstStep: "Tek dosyalık küçük bir script yaz ve çalıştır.",
  },
  {
    id: "yazma",
    name: "Günlük / Yazı Yazmak",
    icon: "notebook",
    category: "zihin",
    difficulty: 1,
    minMinutes: 15,
    maxMinutes: 45,
    description:
      "Kafandakileri boşaltmak hem düşünceyi hem yazma kasını güçlendiriyor.",
    firstStep: "Durmadan 15 dakika yaz; silme yok, düzeltme yok.",
  },
  {
    id: "kosu",
    name: "Koşu",
    icon: "run",
    category: "beden",
    difficulty: 2,
    minMinutes: 25,
    maxMinutes: 75,
    description:
      "Yavaş tempo, konuşabildiğin hız. Dayanıklılık haftalar içinde katlanıyor.",
    firstStep: "5 dk yürü, 20 dk çok yavaş koş, 5 dk yürü.",
  },
  {
    id: "guc",
    name: "Kuvvet Antrenmanı",
    icon: "dumbbell",
    category: "beden",
    difficulty: 2,
    minMinutes: 30,
    maxMinutes: 75,
    description:
      "Şınav, squat, barfiks. Ekipman olmadan da ciddi ilerleme mümkün.",
    firstStep: "3 tur: 10 squat, 8 şınav, 30 sn plank.",
  },
  {
    id: "yoga",
    name: "Yoga / Esneme",
    icon: "stretch",
    category: "huzur",
    difficulty: 1,
    minMinutes: 20,
    maxMinutes: 60,
    description:
      "Masa başı sırtını ve kalçanı geri açar. Uykuyu da belirgin iyileştiriyor.",
    firstStep: "20 dakikalık bir başlangıç akışını takip et.",
  },
  {
    id: "meditasyon",
    name: "Meditasyon",
    icon: "breath",
    category: "huzur",
    difficulty: 1,
    minMinutes: 10,
    maxMinutes: 40,
    description:
      "Dikkatini nefese getirip geri getirmek. Doom scrolling'in tam tersi egzersiz.",
    firstStep: "Zamanlayıcıyı kur, sadece nefesini say: 1'den 10'a, tekrar.",
  },
  {
    id: "dil",
    name: "Yabancı Dil",
    icon: "language",
    category: "zihin",
    difficulty: 2,
    minMinutes: 25,
    maxMinutes: 60,
    description: "Günde 30 dakika, bir yılda konuşulabilir seviye demek.",
    firstStep: "20 yeni kelime seç, sesli tekrar et, cümle içinde kullan.",
  },
  {
    id: "yemek",
    name: "Yemek Pişirmek",
    icon: "chef",
    category: "beceri",
    difficulty: 1,
    minMinutes: 30,
    maxMinutes: 90,
    description:
      "Ömür boyu kullanacağın, parayı ve sağlığı doğrudan etkileyen tek beceri.",
    firstStep: "Daha önce yapmadığın tek tencerelik bir tarif seç ve yap.",
  },
  {
    id: "fotograf",
    name: "Fotoğrafçılık",
    icon: "camera",
    category: "yaratici",
    difficulty: 1,
    minMinutes: 30,
    maxMinutes: 90,
    description:
      "Telefon kamerası fazlasıyla yeter. Mesele ekipman değil, bakmayı öğrenmek.",
    firstStep:
      "Dışarı çık, tek bir tema seç (gölge, kırmızı, doku) ve 30 kare çek.",
  },
  {
    id: "satranc",
    name: "Satranç",
    icon: "chess",
    category: "zihin",
    difficulty: 2,
    minMinutes: 20,
    maxMinutes: 60,
    description:
      "Taktik bulmacaları, oyun oynamaktan daha hızlı seviye atlatıyor.",
    firstStep: "20 dakika sadece mat bulmacası çöz.",
  },
  {
    id: "piyano",
    name: "Piyano",
    icon: "piano",
    category: "yaratici",
    difficulty: 2,
    minMinutes: 25,
    maxMinutes: 60,
    description: "İki el bağımsızlığı beyni ciddi şekilde çalıştırıyor.",
    firstStep: "Do majör gamını iki elle, metronomla yavaş çalış.",
    gear: "Piyano ya da klavye",
  },
  {
    id: "yuzme",
    name: "Yüzme",
    icon: "swim",
    category: "beden",
    difficulty: 2,
    minMinutes: 45,
    maxMinutes: 90,
    description: "Eklem dostu, tüm vücudu çalıştıran tek kardiyo.",
    firstStep: "Teknik düşünmeden 20 dakika rahat tempoda yüz.",
  },
  {
    id: "yuruyus",
    name: "Uzun Yürüyüş",
    icon: "hike",
    category: "huzur",
    difficulty: 1,
    minMinutes: 30,
    maxMinutes: 120,
    description:
      "Kulaklıksız yürüyüş, tıkanan düşünceleri açan en ucuz yöntem.",
    firstStep: "Telefonu cebe koy, 45 dakika hiç durmadan yürü.",
  },
  {
    id: "origami",
    name: "Origami",
    icon: "origami",
    category: "beceri",
    difficulty: 1,
    minMinutes: 15,
    maxMinutes: 45,
    description: "Ucuz, sessiz ve tamamen elle yapılan iş. Sabır egzersizi gibi.",
    firstStep: "Klasik turnayı katlamayı öğren.",
    gear: "Birkaç kare kağıt",
  },
  {
    id: "muzik-yapim",
    name: "Müzik Prodüksiyon",
    icon: "mixer",
    category: "yaratici",
    difficulty: 3,
    minMinutes: 45,
    maxMinutes: 120,
    description:
      "8 bar loop bile bitirmek, tüketmekten çok farklı hissettiriyor.",
    firstStep: "Bir DAW aç ve 8 barlık tek bir loop bitir.",
  },
  {
    id: "bahce",
    name: "Bitki / Bahçe",
    icon: "plant",
    category: "huzur",
    difficulty: 1,
    minMinutes: 20,
    maxMinutes: 60,
    description: "Yavaş geri bildirim veren, ekrandan tamamen uzak bir uğraş.",
    firstStep: "Bir saksı hazırla, tohum ek ya da bitkilerini elden geçir.",
  },
  {
    id: "kaligrafi",
    name: "Kaligrafi",
    icon: "calligraphy",
    category: "yaratici",
    difficulty: 2,
    minMinutes: 20,
    maxMinutes: 45,
    description: "El yazını da doğrudan düzeltiyor, sonucu hemen görünüyor.",
    firstStep: "Tek bir harfi bir sayfa boyunca tekrar et.",
    gear: "Uçlu kalem",
  },
  {
    id: "sohbet",
    name: "Gerçek Sohbet",
    icon: "coffee",
    category: "sosyal",
    difficulty: 1,
    minMinutes: 30,
    maxMinutes: 120,
    description: "Mesajlaşmak değil: telefonla ara ya da yüz yüze buluş.",
    firstStep: "Uzun süredir konuşmadığın birini ara, 30 dakika konuş.",
  },
  {
    id: "gonullu",
    name: "Gönüllülük",
    icon: "handshake",
    category: "sosyal",
    difficulty: 2,
    minMinutes: 60,
    maxMinutes: 120,
    description: "Sokak hayvanları, mahalle temizliği, komşuya yardım.",
    firstStep: "Mahallende bugün yapabileceğin tek somut iş bul ve yap.",
  },
  {
    id: "tamir",
    name: "Tamir / El İşi",
    icon: "wrench",
    category: "beceri",
    difficulty: 2,
    minMinutes: 30,
    maxMinutes: 90,
    description:
      "Bozuk eşyayı atmak yerine sökmek, hem öğretici hem tatmin edici.",
    firstStep: "Evdeki bozuk bir şeyi seç, söküp neyin bozulduğunu bul.",
  },
];

export function getHabit(id: string): Habit | undefined {
  return HABITS.find((h) => h.id === id);
}

export function categoryMeta(id: Category) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
