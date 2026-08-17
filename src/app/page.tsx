"use client";

import Link from "next/link";
import { ArrowRight, Flame, RefreshCw, Shuffle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Glyph } from "@/components/Glyph";
import { SplitFlap } from "@/components/SplitFlap";
import { CATEGORIES, DIFFICULTY_LABEL, HABITS, categoryMeta } from "@/lib/habits";
import { formatMinutes } from "@/lib/stats";
import { useHabyte } from "@/lib/useHabyte";
import type { Category, Difficulty, Habit } from "@/lib/types";

const MINUTE_OPTIONS = [15, 30, 45, 60, 90, 120];
const MANIFEST_ROWS = 8;
const NAME_CELLS = 20;
/** Hero tamburun son hücresinin durması bu kadar sürüyor; kapı ondan sonra açılır. */
const SETTLE_MS = 1900;

type Phase = "bekliyor" | "araniyor" | "kalkis";

/** Tohumlu karıştırma: aynı tohum her yerde aynı sırayı verir, hidrasyon bozulmaz. */
function shuffle<T>(items: T[], seed: number): T[] {
  if (seed === 0) return items;
  const copy = [...items];
  let state = seed >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function DifficultyBars({ level, lit }: { level: number; lit?: boolean }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`h-[9px] w-[3px] ${
            step <= level
              ? lit
                ? "bg-amber"
                : "bg-char-2"
              : "bg-rule"
          }`}
        />
      ))}
    </span>
  );
}

function Console({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule-soft px-4 py-4 last:border-b-0">
      <p className="meta mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function BoardPage() {
  const { stats, loaded } = useHabyte();
  const [categories, setCategories] = useState<Category[]>([]);
  const [maxDifficulty, setMaxDifficulty] = useState<Difficulty>(3);
  const [minutes, setMinutes] = useState(30);
  const [result, setResult] = useState<Habit | null>(null);
  const [phase, setPhase] = useState<Phase>("bekliyor");
  const [seed, setSeed] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const pool = useMemo(
    () =>
      HABITS.filter(
        (habit) =>
          (categories.length === 0 || categories.includes(habit.category)) &&
          habit.difficulty <= maxDifficulty &&
          habit.minMinutes <= minutes,
      ),
    [categories, maxDifficulty, minutes],
  );

  const manifest = useMemo(
    () => shuffle(pool, seed).slice(0, MANIFEST_ROWS),
    [pool, seed],
  );

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setResult(null);
    setPhase("bekliyor");
  }, []);

  const spin = useCallback(() => {
    if (pool.length === 0 || phase === "araniyor") return;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    if (timer.current) clearTimeout(timer.current);

    setResult(picked);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setPhase("kalkis");
      return;
    }
    setPhase("araniyor");
    timer.current = setTimeout(() => setPhase("kalkis"), SETTLE_MS);
  }, [phase, pool]);

  function toggleCategory(id: Category) {
    setCategories((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
    reset();
  }

  const empty = pool.length === 0;
  const statusWord = empty
    ? "EŞLEŞME YOK"
    : phase === "araniyor"
      ? "ARANIYOR"
      : phase === "kalkis"
        ? "KALKIŞ"
        : "BEKLİYOR";

  // Boş tambur ölü görünüyor; pano beklerken davetini kendisi yazıyor.
  const heroName =
    phase === "bekliyor" || !result ? "Panoyu çevir" : result.name;
  const heroLine = result
    ? `${minutes} DK  ${categoryMeta(result.category).label}`
    : `${minutes} DK`;

  return (
    <div className="flex flex-col gap-4">
      {/* Salon tabelası: sayılar panonun üstünde, tek satırlık bir bant. */}
      <section className="board-panel flex flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3">
        <p className="meta mr-auto">
          habyte · {HABITS.length} uğraş tarifeli · {pool.length} uygun
        </p>
        {loaded && stats.totalSessions > 0 ? (
          <>
            <span className="flex items-baseline gap-2">
              <span className="meta">seri</span>
              <span className="numeric flex items-center gap-1.5 text-[15px] text-amber">
                <Flame size={13} strokeWidth={1.5} />
                {stats.currentStreak} gün
              </span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="meta">bugün</span>
              <span className="numeric text-[15px]">
                {formatMinutes(stats.todayMinutes)}
              </span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="meta">seviye</span>
              <span className="numeric text-[15px]">{stats.level}</span>
            </span>
          </>
        ) : (
          <span className="meta">kayıt yok — ilk kalkışını yap</span>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-[236px_minmax(0,1fr)] md:items-start">
        {/* Konsol: kalkış koşullarını buradan kuruyorsun. */}
        <aside className="board-panel md:sticky md:top-[73px]">
          <div className="board-head">
            <p className="meta text-char-2">konsol</p>
          </div>

          <Console title="süre">
            <div className="flex flex-wrap gap-1">
              {MINUTE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setMinutes(option);
                    reset();
                  }}
                  className={`key hover:border-char-3 ${
                    minutes === option ? "key-on" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </Console>

          <Console title="hat">
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((category) => {
                const active = categories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`key justify-start hover:border-char-3 ${
                      active ? "key-on" : ""
                    }`}
                  >
                    <span
                      className="h-[9px] w-[9px] shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.label}
                  </button>
                );
              })}
              {categories.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setCategories([]);
                    reset();
                  }}
                  className="meta mt-1 self-start px-1 py-1 hover:text-char-2"
                >
                  hepsini aç
                </button>
              )}
            </div>
          </Console>

          <Console title="zorluk tavanı">
            <div className="flex flex-col gap-1">
              {([1, 2, 3] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    setMaxDifficulty(level);
                    reset();
                  }}
                  className={`key justify-start hover:border-char-3 ${
                    maxDifficulty === level ? "key-on" : ""
                  }`}
                >
                  <DifficultyBars level={level} lit={maxDifficulty === level} />
                  {DIFFICULTY_LABEL[level]}
                </button>
              ))}
            </div>
          </Console>

          <div className="border-t border-rule px-4 py-4">
            <button
              type="button"
              onClick={spin}
              disabled={empty || phase === "araniyor"}
              className="btn btn-amber w-full disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                strokeWidth={2}
                className={phase === "araniyor" ? "opacity-50" : ""}
              />
              {phase === "bekliyor" ? "Panoyu çevir" : "Yeniden çevir"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSeed(Date.now() % 100000);
                reset();
              }}
              className="meta mt-3 flex w-full items-center justify-center gap-2 py-1 hover:text-char-2"
            >
              <Shuffle size={12} strokeWidth={1.5} />
              tarifeyi karıştır
            </button>
          </div>
        </aside>

        {/* Pano. */}
        <section className="board-panel overflow-hidden">
          <div className="board-head">
            <p className="meta text-char-2">kalkış panosu</p>
            <span
              className={`ml-auto h-[7px] w-[7px] ${
                phase === "kalkis"
                  ? "bg-amber"
                  : phase === "araniyor"
                    ? "bg-char-2"
                    : "bg-rule"
              }`}
            />
            <p className="meta text-char-2">{statusWord}</p>
          </div>

          {/* Hero tambur. */}
          <div className="border-b border-rule px-4 py-6 sm:px-6 sm:py-8">
            <p className="meta mb-3">sıradaki uğraşın</p>
            <SplitFlap
              value={heroName}
              length={NAME_CELLS}
              size="lg"
              minSteps={26}
              stagger={52}
              label={heroName || "henüz seçilmedi"}
            />
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <p className="meta mb-2">süre / hat</p>
                <SplitFlap
                  value={heroLine}
                  length={14}
                  size="sm"
                  minSteps={16}
                  stagger={30}
                  label={heroLine || "boş"}
                />
              </div>
              <div>
                <p className="meta mb-2">durum</p>
                <SplitFlap
                  value={statusWord}
                  length={11}
                  size="sm"
                  minSteps={10}
                  stagger={26}
                />
              </div>
            </div>
          </div>

          {/* Tarife: filtrelere uyan uğraşlar. */}
          <div className="board-cols grid grid-cols-[52px_minmax(0,1fr)_auto] gap-3 sm:grid-cols-[52px_minmax(0,1fr)_88px_54px_84px]">
            <p className="meta">en az</p>
            <p className="meta">uğraş</p>
            <p className="meta hidden sm:block">hat</p>
            <p className="meta hidden sm:block">zorluk</p>
            <p className="meta text-right">durum</p>
          </div>

          {empty ? (
            <p className="px-4 py-12 text-center text-sm text-char-2">
              Bu koşullarda tarifede uğraş yok. Süreyi uzat ya da hat seçimini
              genişlet.
            </p>
          ) : (
            <ul>
              {manifest.map((habit) => {
                const chosen = phase === "kalkis" && result?.id === habit.id;
                const meta = categoryMeta(habit.category);
                return (
                  <li
                    key={habit.id}
                    className={`grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 border-b border-rule-soft px-4 py-2.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_88px_54px_84px] ${
                      chosen ? "bg-amber-wash" : ""
                    }`}
                  >
                    <span
                      className={`numeric text-[13px] ${
                        chosen ? "text-amber" : "text-char-2"
                      }`}
                    >
                      {`${habit.minMinutes}`.padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="shrink-0"
                        style={{ color: chosen ? meta.color : "var(--char-3)" }}
                      >
                        <Glyph icon={habit.icon} size={15} />
                      </span>
                      <span
                        className={`truncate text-[14px] ${
                          chosen ? "text-char" : "text-char-2"
                        }`}
                      >
                        {habit.name}
                      </span>
                    </span>
                    <span className="meta hidden items-center gap-1.5 sm:flex">
                      <span
                        className="h-[7px] w-[7px] shrink-0"
                        style={{ backgroundColor: meta.color }}
                      />
                      {meta.label}
                    </span>
                    <span className="hidden sm:block">
                      <DifficultyBars level={habit.difficulty} lit={chosen} />
                    </span>
                    <span
                      className={`meta text-right ${
                        chosen ? "text-amber" : ""
                      }`}
                    >
                      {chosen ? "kalkış" : "tarifede"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Biniş kartı: pano durduktan sonra açılır. */}
      {phase === "kalkis" && result && (
        <section className="board-panel">
          <div className="board-head">
            <p className="meta text-char-2">biniş kartı</p>
            <p className="meta ml-auto text-amber">kapı açık</p>
          </div>
          <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-rule bg-cell"
                  style={{ color: categoryMeta(result.category).color }}
                >
                  <Glyph icon={result.icon} size={22} />
                </span>
                <div className="min-w-0">
                  <h1 className="font-display text-[26px] leading-tight">
                    {result.name}
                  </h1>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-char-2">
                    {result.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-l-2 border-amber bg-amber-wash px-4 py-3">
                <p className="meta mb-2">bugünün ilk adımı</p>
                <p className="text-[14px] leading-relaxed">{result.firstStep}</p>
                {result.gear && (
                  <p className="meta mt-2.5">gerekli — {result.gear}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-rule md:border-l md:pl-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="meta mb-2">süre</p>
                  <p className="numeric text-[20px]">{minutes} dk</p>
                </div>
                <div>
                  <p className="meta mb-2">önerilen</p>
                  <p className="numeric text-[20px]">
                    {result.minMinutes}–{result.maxMinutes}
                  </p>
                </div>
              </div>
              <Link
                href={`/session?habit=${result.id}&minutes=${minutes}`}
                className="btn btn-amber w-full"
              >
                Binişe geç
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={spin}
                className="btn btn-quiet w-full hover:border-char-3"
              >
                Başka bir şey ver
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
