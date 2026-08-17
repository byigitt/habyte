<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Arayüz yazmadan önce

`DESIGN.md` bağlayıcıdır: renk, tipografi, yarıçap, hareket ve düzen kuralları
orada kilitli. Yeni ekran ya da bileşen yazmadan önce oku.

- Arayüzde emoji yok. Simgeler `lucide-react`, uğraş ikonları
  `src/lib/icons.ts` kayıt defterinden gelir.
- Renkler token'dan (`bg-board`, `text-char-2`, `border-rule`, `text-amber`),
  Tailwind varsayılan paletinden değil. Emekli kağıt token'ları (`bg-paper`,
  `text-ink`, `text-accent`) geri gelmez; `design:check` bunları reddediyor.
- Bitirmeden önce: `npm run design:check && npm run lint && npm run build`.
