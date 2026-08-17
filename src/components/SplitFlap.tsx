"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tamburun üzerindeki karakter dizisi. Sıra önemli: hücre yalnızca ileri
 * döner, tıpkı gerçek Solari panolarındaki gibi. "A" hedefindeyken "Z"de olan
 * bir hücre geri sarmaz, turu tamamlar.
 *
 * Saat için ayrı bir tambur var: gerçek flip saatlerde de yalnızca rakam
 * bulunur, yoksa 9'dan 0'a geçmek bütün alfabeyi dolaşırdı.
 */
const DRUMS = {
  full: " ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVWXYZ0123456789.,:'&/-+()!?",
  clock: " 0123456789:",
} as const;

type Drum = keyof typeof DRUMS;

const INDEXES: Record<Drum, Map<string, number>> = {
  full: new Map(),
  clock: new Map(),
};
for (const drum of Object.keys(DRUMS) as Drum[]) {
  const chars = DRUMS[drum];
  for (let i = 0; i < chars.length; i++) INDEXES[drum].set(chars[i], i);
}

const SIZES = {
  xs: { cell: "h-5 w-[11px] text-[10px]", gap: "gap-px" },
  sm: { cell: "h-7 w-[16px] text-[13px]", gap: "gap-px" },
  md: { cell: "h-10 w-[23px] text-[18px]", gap: "gap-[2px]" },
  // lg ve xl dar ekranda tek satıra sığsın diye küçülüyor; tambur şeridinin
  // ortadan kırılması pano hissini bozuyor.
  lg: {
    cell: "h-9 w-[14px] text-[11px] sm:h-14 sm:w-[32px] sm:text-[26px]",
    gap: "gap-[2px]",
  },
  xl: {
    cell: "h-16 w-[36px] text-[30px] sm:h-[72px] sm:w-[44px] sm:text-[38px]",
    gap: "gap-[3px]",
  },
} as const;

type Size = keyof typeof SIZES;

type Props = {
  value: string;
  /** Sabit hücre sayısı. Kısa değer boşlukla dolar, uzun değer kırpılır. */
  length: number;
  size?: Size;
  drum?: Drum;
  /** Hücreler arası gecikme (ms); soldan sağa akan dalgayı bu üretiyor. */
  stagger?: number;
  /** Hedefe varmadan atılacak en az adım. Panonun "arama" hissi. */
  minSteps?: number;
  className?: string;
  label?: string;
};

function normalize(value: string, length: number, drum: Drum): string {
  const index = INDEXES[drum];
  return [...value.toLocaleUpperCase("tr")]
    .map((ch) => (index.has(ch) ? ch : " "))
    .join("")
    .slice(0, length)
    .padEnd(length, " ");
}

type Cell = { ch: string; seq: number };

export function SplitFlap({
  value,
  length,
  size = "md",
  drum = "full",
  stagger = 55,
  minSteps = 0,
  className = "",
  label,
}: Props) {
  const target = normalize(value, length, drum);

  // İlk kare sunucuda da aynı olsun diye hedefle başlıyoruz; tambur yalnızca
  // değer sonradan değiştiğinde dönüyor.
  const [cells, setCells] = useState<Cell[]>(() =>
    [...target].map((ch) => ({ ch, seq: 0 })),
  );

  const shownRef = useRef(target);
  const seqRef = useRef<number[]>(new Array(length).fill(0));

  useEffect(() => {
    if (shownRef.current === target) return;

    // Hücre sayısı değiştiyse (saat bir saati geçince) animasyon değil,
    // panoyu yeniden dizmek gerekir.
    if (shownRef.current.length !== length) {
      seqRef.current = new Array(length).fill(0);
      shownRef.current = target;
      setCells([...target].map((ch) => ({ ch, seq: 0 })));
      return;
    }

    const from = shownRef.current;
    const bump = (i: number) => (seqRef.current[i] += 1);

    const land = () => {
      for (let i = 0; i < length; i++) if (from[i] !== target[i]) bump(i);
      shownRef.current = target;
      setCells([...target].map((ch, i) => ({ ch, seq: seqRef.current[i] })));
    };

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      land();
      return;
    }

    const chars = DRUMS[drum];
    const index = INDEXES[drum];
    const n = chars.length;

    const plans = [...target].map((ch, i) => {
      const start = index.get(from[i]) ?? 0;
      let steps = ((index.get(ch) ?? 0) - start + n) % n;
      while (steps < minSteps) steps += n;
      return {
        start,
        steps,
        delay: i * stagger,
        duration: steps === 0 ? 0 : 200 + steps * 24,
      };
    });

    const total = Math.max(0, ...plans.map((p) => p.delay + p.duration));
    const startedAt = performance.now();
    let frame = 0;
    let shown = from;

    const tick = (now: number) => {
      const t = now - startedAt;
      let next = "";
      for (let i = 0; i < length; i++) {
        const plan = plans[i];
        const local = t - plan.delay;
        if (plan.steps === 0 || local >= plan.duration) {
          next += target[i];
        } else if (local <= 0) {
          next += from[i];
        } else {
          // easeOutCubic: tambur hızlı açılır, hedefe yaklaşırken yavaşlar.
          const eased = 1 - Math.pow(1 - local / plan.duration, 3);
          const step = Math.min(plan.steps, Math.floor(eased * plan.steps));
          next += chars[(plan.start + step) % n];
        }
      }

      if (next !== shown) {
        for (let i = 0; i < length; i++) if (next[i] !== shown[i]) bump(i);
        shown = next;
        shownRef.current = next;
        setCells([...next].map((ch, i) => ({ ch, seq: seqRef.current[i] })));
      }

      if (t < total) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, length, drum, stagger, minSteps]);

  const { cell, gap } = SIZES[size];

  return (
    <div
      className={`flex flex-wrap ${gap} ${className}`}
      role="img"
      aria-label={label ?? value.trim()}
    >
      {cells.map((c, i) => (
        <span key={i} className={`flap ${cell}`} aria-hidden="true">
          <span key={`${c.ch}-${c.seq}`} className="flap-char">
            {c.ch === " " ? "\u00A0" : c.ch}
          </span>
          <span className="flap-hinge" />
        </span>
      ))}
    </div>
  );
}
