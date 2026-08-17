import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * DESIGN.md'deki yasakları koda uygular. Amaç, arayüzün zamanla
 * "her yerdeki üretilmiş arayüz" kalıplarına geri kaymasını engellemek.
 */
const RULES = [
  [/backdrop-blur/, "glassmorphism bulanıklığı"],
  [
    /\b(indigo|violet|fuchsia|purple|pink|cyan|sky|emerald|slate|zinc|neutral|stone|gray)-\d{3}\b/,
    "Tailwind varsayılan paleti",
  ],
  [/linear-gradient|bg-gradient-/, "dekoratif gradient"],
  [/hover:scale-|animate-pulse|animate-bounce/, "gereksiz hareket"],
  [/rounded-(md|lg|xl|2xl|3xl|full)(?![a-z-])/, "yarıçap ölçeği dışı"],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, "emoji"],
  // Almanak dönemindeki kağıt token'ları: pano diline geçildi, geri sızmasın.
  [
    /\b(bg|text|border|from|to|fill|stroke)-(paper|raised|sunken|ink|ink-soft|ink-faint|accent|accent-ink|accent-wash)\b/,
    "emekli kağıt token'ı",
  ],
];

// Eski kayıtları göç ettiren tablo emoji içermek zorunda.
const EXEMPT = [/src\/lib\/icons\.ts$/];
// Gerçek daireler (avatar, gösterge noktası) rounded-full kullanabilir.
const ALLOW_ROUND_FULL = /rounded-full/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (/\.(tsx?|css)$/.test(path)) out.push(path);
  }
  return out;
}

let violations = 0;
for (const file of walk("src")) {
  if (EXEMPT.some((re) => re.test(file))) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    for (const [pattern, label] of RULES) {
      if (!pattern.test(line)) continue;
      if (label === "yarıçap ölçeği dışı" && ALLOW_ROUND_FULL.test(line)) continue;
      console.error(`${label}: ${file}:${index + 1}\n  ${line.trim()}`);
      violations += 1;
    }
  });
}

if (violations > 0) {
  console.error(`\n${violations} tasarım ihlali. DESIGN.md'ye bak.`);
  process.exit(1);
}
console.log("Tasarım kontrolü temiz.");
