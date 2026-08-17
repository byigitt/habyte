"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Download,
  Frown,
  Laugh,
  Meh,
  Smile,
  Trash2,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Glyph } from "./Glyph";
import { categoryMeta } from "@/lib/habits";
import { exportData, importData } from "@/lib/storage";
import { formatMinutes, formatRelative, sessionXp } from "@/lib/stats";
import { useHabyte } from "@/lib/useHabyte";

const MOOD_ICON: Record<string, LucideIcon> = {
  kotu: Frown,
  idare: Meh,
  iyi: Smile,
  harika: Laugh,
};

const TIME = new Intl.DateTimeFormat("tr", {
  hour: "2-digit",
  minute: "2-digit",
});

function Figure({
  label,
  value,
  hint,
  lit,
}: {
  label: string;
  value: string;
  hint?: string;
  lit?: boolean;
}) {
  return (
    <div className="border-r border-rule-soft px-4 py-4 last:border-r-0">
      <p className="meta mb-2.5">{label}</p>
      <p
        className={`numeric text-[22px] leading-none ${
          lit ? "text-amber" : "text-char"
        }`}
      >
        {value}
      </p>
      {hint && <p className="meta mt-2.5 normal-case tracking-normal">{hint}</p>}
    </div>
  );
}

export function HistoryView() {
  const { sessions, stats, loaded, deleteSession, clear } = useHabyte();
  const params = useSearchParams();
  const justSaved = params.get("kaydedildi") === "1";
  const [savedHidden, setSavedHidden] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!justSaved) return;
    const timeout = setTimeout(() => setSavedHidden(true), 3500);
    return () => clearTimeout(timeout);
  }, [justSaved]);

  const toast =
    actionToast ?? (justSaved && !savedHidden ? "Oturum kaydedildi." : null);

  function download() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `habyte-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function upload(file: File) {
    const text = await file.text();
    const result = importData(text);
    setActionToast(
      result.ok ? `${result.count} kayıt içe aktarıldı.` : "Dosya okunamadı.",
    );
    setTimeout(() => setActionToast(null), 3500);
  }

  const maxDayMinutes = Math.max(30, ...stats.lastDays.map((d) => d.minutes));

  if (loaded && sessions.length === 0) {
    return (
      <div className="board-panel">
        <div className="board-head">
          <p className="meta text-char-2">varışlar</p>
          <p className="meta ml-auto">kayıt yok</p>
        </div>
        <div className="flex flex-col items-center gap-5 px-6 py-20 text-center">
          <h1 className="font-display text-[24px]">Pano boş</h1>
          <p className="max-w-sm text-[14px] leading-relaxed text-char-2">
            Panoyu çevir, bir uğraş seç ve ilk oturumunu tamamla. Buraya inen
            her satır gerçekten harcadığın zaman olacak.
          </p>
          <Link href="/" className="btn btn-amber mt-1">
            Panoyu çevir
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {toast && (
        <p className="border-l-2 border-amber bg-amber-wash px-4 py-3 text-sm text-amber">
          {toast}
        </p>
      )}

      <section className="board-panel overflow-hidden">
        <div className="board-head">
          <p className="meta text-char-2">sicil</p>
          <p className="meta ml-auto">{stats.totalSessions} iniş</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4">
          <Figure
            label="güncel seri"
            value={`${stats.currentStreak} gün`}
            hint={`en uzun ${stats.longestStreak} gün`}
            lit={stats.currentStreak > 0}
          />
          <Figure
            label="toplam süre"
            value={formatMinutes(stats.totalMinutes)}
            hint={`${stats.totalSessions} oturum`}
          />
          <Figure
            label="bu hafta"
            value={formatMinutes(stats.weekMinutes)}
            hint={`${stats.distinctHabits} farklı uğraş`}
          />
          <Figure
            label={`seviye ${stats.level}`}
            value={`${stats.xp} xp`}
            hint={`sonrakine ${stats.levelNeed - stats.levelInto} xp`}
          />
        </div>
      </section>

      <section className="board-panel overflow-hidden">
        <div className="board-head">
          <p className="meta text-char-2">son 14 gün</p>
          <p className="meta ml-auto">en yoğun {formatMinutes(maxDayMinutes)}</p>
        </div>
        <div className="px-4 py-5">
          <div className="flex h-24 items-end gap-[3px]">
            {stats.lastDays.map((day) => {
              const height =
                day.minutes > 0
                  ? Math.max(6, (day.minutes / maxDayMinutes) * 100)
                  : 2;
              return (
                <div
                  key={day.key}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div
                    title={`${day.key}: ${formatMinutes(day.minutes)}`}
                    className={day.minutes > 0 ? "bg-amber" : "bg-rule"}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-[3px] border-t border-rule-soft pt-2">
            {stats.lastDays.map((day) => (
              <span key={day.key} className="meta flex-1 text-center">
                {day.key.slice(8)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="board-panel overflow-hidden">
        <div className="board-head">
          <p className="meta text-char-2">iniş kayıtları</p>
        </div>
        <div className="board-cols grid grid-cols-[46px_minmax(0,1fr)_auto] gap-3 sm:grid-cols-[46px_minmax(0,1fr)_92px_84px_52px_28px]">
          <p className="meta">saat</p>
          <p className="meta">uğraş</p>
          <p className="meta hidden sm:block">hat</p>
          <p className="meta hidden sm:block">süre</p>
          <p className="meta text-right">xp</p>
          <p className="meta hidden sm:block" />
        </div>
        <ul>
          {sessions.map((session) => {
            const MoodIcon = session.mood ? MOOD_ICON[session.mood] : null;
            const meta = categoryMeta(session.category);
            return (
              <li
                key={session.id}
                className="grid grid-cols-[46px_minmax(0,1fr)_auto] items-center gap-3 border-b border-rule-soft px-4 py-3 last:border-b-0 sm:grid-cols-[46px_minmax(0,1fr)_92px_84px_52px_28px]"
              >
                <span className="numeric text-[13px] text-char-2">
                  {TIME.format(new Date(session.endedAt))}
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="shrink-0" style={{ color: meta.color }}>
                    <Glyph icon={session.icon} size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[14px]">
                        {session.habitName}
                      </span>
                      {MoodIcon && (
                        <MoodIcon
                          size={13}
                          strokeWidth={1.5}
                          className="shrink-0 text-char-3"
                        />
                      )}
                    </span>
                    {session.note ? (
                      <span className="mt-0.5 block truncate text-[12px] text-char-3">
                        {session.note}
                      </span>
                    ) : (
                      <span className="meta mt-1 block sm:hidden">
                        {formatRelative(session.endedAt)}
                      </span>
                    )}
                  </span>
                </span>
                <span className="meta hidden items-center gap-1.5 sm:flex">
                  <span
                    className="h-[7px] w-[7px] shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  {meta.label}
                </span>
                <span className="numeric hidden whitespace-nowrap text-[13px] text-char-2 sm:block">
                  {formatMinutes(session.activeSeconds / 60)}
                </span>
                <span className="numeric text-right text-[13px] text-amber">
                  +{sessionXp(session)}
                </span>
                <button
                  type="button"
                  onClick={() => deleteSession(session.id)}
                  aria-label="Kaydı sil"
                  className="hidden justify-self-end text-char-3 transition-colors hover:text-halt sm:block"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="board-panel">
        <div className="board-head">
          <p className="meta text-char-2">kayıt deposu</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 p-4">
          <p className="mr-auto max-w-xs text-[13px] leading-relaxed text-char-2">
            Kayıtlar bu tarayıcıda duruyor. Yedek al, başka cihaza taşı.
          </p>
          <button
            type="button"
            onClick={download}
            className="btn btn-quiet hover:border-char-3"
          >
            <Download size={14} strokeWidth={1.5} />
            Dışa aktar
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="btn btn-quiet hover:border-char-3"
          >
            <Upload size={14} strokeWidth={1.5} />
            İçe aktar
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (confirm("Tüm kayıtlar silinsin mi? Bu geri alınamaz.")) clear();
            }}
            className="btn btn-quiet text-halt hover:border-halt"
          >
            Hepsini sil
          </button>
        </div>
      </section>
    </div>
  );
}
