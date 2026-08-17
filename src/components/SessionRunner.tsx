"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Frown,
  Laugh,
  Meh,
  Pause,
  Play,
  Smile,
  Square,
  type LucideIcon,
} from "lucide-react";
import { Glyph } from "./Glyph";
import { SplitFlap } from "./SplitFlap";
import { categoryMeta, getHabit } from "@/lib/habits";
import { formatDuration } from "@/lib/stats";
import { useHabyte } from "@/lib/useHabyte";
import type { Mood, SessionLog } from "@/lib/types";

type Status = "hazir" | "calisiyor" | "duraklatildi" | "bitti";

const STATUS_WORD: Record<Status, string> = {
  hazir: "HAZIR",
  calisiyor: "HAVADA",
  duraklatildi: "BEKLEMEDE",
  bitti: "İNDİ",
};

const MOODS: { id: Mood; icon: LucideIcon; label: string }[] = [
  { id: "kotu", icon: Frown, label: "Zorladı" },
  { id: "idare", icon: Meh, label: "İdare eder" },
  { id: "iyi", icon: Smile, label: "İyiydi" },
  { id: "harika", icon: Laugh, label: "Harikaydı" },
];

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function SessionRunner() {
  const params = useSearchParams();
  const router = useRouter();
  const { addSession } = useHabyte();

  const habitId = params.get("habit") ?? "";
  const plannedMinutes = Math.max(
    1,
    Math.min(240, Number(params.get("minutes")) || 30),
  );
  const habit = getHabit(habitId);

  const [status, setStatus] = useState<Status>("hazir");
  const [elapsed, setElapsed] = useState(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const startedAtRef = useRef<string | null>(null);
  const accumulatedRef = useRef(0);
  const resumedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "calisiyor") return;
    const tick = () => {
      const since = resumedAtRef.current
        ? (Date.now() - resumedAtRef.current) / 1000
        : 0;
      setElapsed(accumulatedRef.current + since);
    };
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== "calisiyor") return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  if (!habit) {
    return (
      <div className="board-panel flex flex-col items-center gap-5 p-12 text-center">
        <p className="font-display text-xl">Bu sefer tarifede yok.</p>
        <Link href="/" className="btn btn-solid">
          <ArrowLeft size={15} strokeWidth={2} />
          Panoya dön
        </Link>
      </div>
    );
  }

  const targetSeconds = plannedMinutes * 60;
  const remaining = targetSeconds - elapsed;
  const progress = Math.min(1, elapsed / targetSeconds);
  const color = categoryMeta(habit.category).color;
  const overshot = remaining < 0 && status !== "bitti";
  const clock = formatDuration(
    status === "bitti" || remaining < 0 ? elapsed : remaining,
  );

  function start() {
    if (!startedAtRef.current) startedAtRef.current = new Date().toISOString();
    resumedAtRef.current = Date.now();
    setStatus("calisiyor");
  }

  function pause() {
    if (resumedAtRef.current) {
      accumulatedRef.current += (Date.now() - resumedAtRef.current) / 1000;
      resumedAtRef.current = null;
    }
    setElapsed(accumulatedRef.current);
    setStatus("duraklatildi");
  }

  function finish() {
    if (resumedAtRef.current) {
      accumulatedRef.current += (Date.now() - resumedAtRef.current) / 1000;
      resumedAtRef.current = null;
    }
    setElapsed(accumulatedRef.current);
    setStatus("bitti");
  }

  function save() {
    if (!habit) return;
    setSaving(true);
    const now = new Date();
    const session: SessionLog = {
      id: newId(),
      habitId: habit.id,
      habitName: habit.name,
      icon: habit.icon,
      category: habit.category,
      difficulty: habit.difficulty,
      startedAt:
        startedAtRef.current ??
        new Date(now.getTime() - accumulatedRef.current * 1000).toISOString(),
      endedAt: now.toISOString(),
      plannedMinutes,
      activeSeconds: Math.round(accumulatedRef.current),
      mood,
      note: note.trim(),
    };
    addSession(session);
    router.push("/gecmis?kaydedildi=1");
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="board-panel overflow-hidden">
        <div className="board-head">
          <p className="meta text-char-2">biniş</p>
          <span
            className={`ml-auto h-[7px] w-[7px] ${
              status === "calisiyor"
                ? "bg-amber"
                : status === "bitti"
                  ? "bg-go"
                  : "bg-rule"
            }`}
          />
          <p className="meta text-char-2">{STATUS_WORD[status]}</p>
        </div>

        <div className="flex flex-wrap items-start gap-4 border-b border-rule px-4 py-4 sm:px-6">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-rule bg-cell"
            style={{ color }}
          >
            <Glyph icon={habit.icon} size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[22px] leading-tight">
              {habit.name}
            </h1>
            <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-char-2">
              {habit.firstStep}
            </p>
          </div>
          <div className="text-right">
            <p className="meta mb-1.5">hedef</p>
            <p className="numeric text-[18px]">{plannedMinutes} dk</p>
          </div>
        </div>

        {/* Sayaç: panonun büyük tamburu. */}
        <div className="flex flex-col items-center gap-5 px-4 py-10 sm:py-14">
          <SplitFlap
            value={clock}
            length={clock.length}
            size="xl"
            drum="clock"
            stagger={0}
            className="justify-center"
            label={`${clock} kaldı`}
          />
          <p className="meta">
            {status === "hazir" && "sayaç bekliyor"}
            {status === "calisiyor" && (overshot ? "hedefi geçtin" : "kalan süre")}
            {status === "duraklatildi" && "duraklatıldı"}
            {status === "bitti" && "toplam çalışma"}
          </p>

          {status !== "bitti" && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              {status === "hazir" && (
                <button type="button" onClick={start} className="btn btn-amber">
                  <Play size={15} strokeWidth={2} />
                  Kalkış
                </button>
              )}
              {status === "calisiyor" && (
                <button
                  type="button"
                  onClick={pause}
                  className="btn btn-quiet hover:border-char-3"
                >
                  <Pause size={15} strokeWidth={2} />
                  Duraklat
                </button>
              )}
              {status === "duraklatildi" && (
                <button type="button" onClick={start} className="btn btn-amber">
                  <Play size={15} strokeWidth={2} />
                  Devam
                </button>
              )}
              {status !== "hazir" && (
                <button type="button" onClick={finish} className="btn btn-solid">
                  <Square size={13} strokeWidth={2.5} />
                  İniş yap
                </button>
              )}
            </div>
          )}
        </div>

        {/* İlerleme: panonun alt kenarına yapışan tek çizgi. */}
        <div className="h-[3px] w-full bg-seam">
          <div
            className={`h-full transition-[width] duration-300 ease-out ${
              overshot ? "bg-go" : "bg-amber"
            }`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </section>

      {status === "bitti" && (
        <section className="board-panel">
          <div className="board-head">
            <p className="meta text-char-2">iniş raporu</p>
            <p className="meta ml-auto text-go">tamamlandı</p>
          </div>

          <div className="flex flex-col gap-6 p-4 sm:p-6">
            <div className="border-b border-rule-soft pb-5">
              <h2 className="font-display text-[24px] leading-tight">
                <span className="numeric text-amber">
                  {formatDuration(elapsed)}
                </span>{" "}
                çalıştın
              </h2>
              <p className="mt-1.5 text-[14px] text-char-2">
                Nasıl geçti? Kısa bir not bırak; sonra okumak iyi geliyor.
              </p>
            </div>

            <div>
              <p className="meta mb-3">nasıldı</p>
              <div className="flex flex-wrap gap-1">
                {MOODS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setMood(option.id)}
                      className={`key hover:border-char-3 ${
                        mood === option.id ? "key-on" : ""
                      }`}
                    >
                      <Icon size={14} strokeWidth={1.5} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="meta mb-3">not</p>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Bugün ne yaptın, nerede takıldın?"
                className="field w-full resize-y focus:border-char-3"
              />
            </div>

            <div className="flex flex-wrap gap-2 border-t border-rule-soft pt-5">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="btn btn-amber disabled:opacity-50"
              >
                <Check size={15} strokeWidth={2} />
                Kaydet
              </button>
              <Link href="/" className="btn btn-quiet hover:border-char-3">
                Kaydetmeden çık
              </Link>
            </div>
          </div>
        </section>
      )}

      <p className="meta text-center">
        telefonu başka odaya bırak — sayaç bu sekmede işliyor
      </p>
    </div>
  );
}
