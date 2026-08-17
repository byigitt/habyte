"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Globe2 } from "lucide-react";
import { Glyph } from "@/components/Glyph";
import { categoryMeta } from "@/lib/habits";
import { formatMinutes } from "@/lib/stats";
import { useHabyte } from "@/lib/useHabyte";

export default function RoutesPage() {
  const { stats, profile, loaded, saveProfile } = useHabyte();
  const [draftName, setDraftName] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const name = draftName ?? profile?.displayName ?? "";

  const levelProgress =
    stats.levelNeed > 0 ? Math.min(1, stats.levelInto / stats.levelNeed) : 0;
  const topMinutes = stats.byHabit[0]?.minutes ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <section className="board-panel overflow-hidden">
        <div className="board-head">
          <p className="meta text-char-2">künye</p>
          <p className="meta ml-auto">seviye {stats.level}</p>
        </div>

        <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_1.1fr]">
          <div>
            <p className="meta mb-3">görünen adın</p>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(event) => {
                  setDraftName(event.target.value);
                  setSaved(false);
                }}
                maxLength={24}
                placeholder="Sen"
                className="field w-full max-w-xs focus:border-char-3"
              />
              <button
                type="button"
                onClick={() => {
                  saveProfile({
                    displayName: name.trim() || "Sen",
                    createdAt: profile?.createdAt ?? new Date().toISOString(),
                  });
                  setSaved(true);
                }}
                className="btn btn-solid"
              >
                {saved ? <Check size={15} strokeWidth={2} /> : null}
                {saved ? "Tamam" : "Kaydet"}
              </button>
            </div>
            <p className="meta mt-3 normal-case tracking-normal">
              Hesaplar geldiğinde bu ad global tabloda görünecek.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="meta">seviye ilerlemesi</p>
              <p className="numeric text-[11px] text-char-3">
                {stats.levelInto} / {stats.levelNeed} xp
              </p>
            </div>
            <div className="h-2.5 w-full border border-rule bg-seam">
              <div
                className="h-full bg-amber transition-[width] duration-300 ease-out"
                style={{ width: `${levelProgress * 100}%` }}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 border-t border-rule-soft pt-4">
              <div>
                <p className="meta mb-2">toplam xp</p>
                <p className="numeric text-[18px]">{stats.xp}</p>
              </div>
              <div>
                <p className="meta mb-2">seri</p>
                <p className="numeric text-[18px]">{stats.currentStreak} gün</p>
              </div>
              <div>
                <p className="meta mb-2">bu hafta</p>
                <p className="numeric text-[18px]">
                  {formatMinutes(stats.weekMinutes)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="board-panel overflow-hidden">
        <div className="board-head">
          <p className="meta text-char-2">hatların</p>
          <p className="meta ml-auto">süreye göre</p>
        </div>

        {loaded && stats.byHabit.length === 0 ? (
          <p className="px-4 py-14 text-center text-[14px] text-char-2">
            Henüz veri yok.{" "}
            <Link href="/" className="text-amber underline underline-offset-4">
              Panoyu çevirerek başla.
            </Link>
          </p>
        ) : (
          <>
            <div className="board-cols grid grid-cols-[34px_minmax(0,1fr)_auto] gap-3 sm:grid-cols-[34px_minmax(0,1fr)_120px_94px_56px]">
              <p className="meta">no</p>
              <p className="meta">uğraş</p>
              <p className="meta hidden sm:block">pay</p>
              <p className="meta hidden sm:block text-right">süre</p>
              <p className="meta text-right">xp</p>
            </div>
            <ul>
              {stats.byHabit.map((habit, index) => {
                const leader = index === 0;
                const share = topMinutes > 0 ? habit.minutes / topMinutes : 0;
                return (
                  <li
                    key={habit.habitId}
                    className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 border-b border-rule-soft px-4 py-3 last:border-b-0 sm:grid-cols-[34px_minmax(0,1fr)_120px_94px_56px]"
                  >
                    <span
                      className={`numeric text-[14px] ${
                        leader ? "text-amber" : "text-char-3"
                      }`}
                    >
                      {`${index + 1}`.padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="shrink-0 text-char-3">
                        <Glyph icon={habit.icon} size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px]">
                          {habit.habitName}
                        </span>
                        <span className="meta mt-1 block normal-case tracking-normal">
                          {habit.sessions} oturum · en uzun{" "}
                          {formatMinutes(habit.longestSessionMinutes)}
                        </span>
                      </span>
                    </span>
                    <span className="hidden h-1.5 bg-seam sm:block">
                      <span
                        className={`block h-full ${
                          leader ? "bg-amber" : "bg-char-3"
                        }`}
                        style={{ width: `${Math.max(3, share * 100)}%` }}
                      />
                    </span>
                    <span className="numeric hidden whitespace-nowrap text-right text-[14px] sm:block">
                      {formatMinutes(habit.minutes)}
                    </span>
                    <span className="numeric text-right text-[13px] text-char-2">
                      {habit.xp}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {stats.byCategory.length > 0 && (
        <section className="board-panel overflow-hidden">
          <div className="board-head">
            <p className="meta text-char-2">zamanın nereye gitti</p>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex h-4 w-full overflow-hidden border border-rule">
              {stats.byCategory.map((row) => (
                <div
                  key={row.category}
                  title={`${categoryMeta(row.category).label}: ${formatMinutes(row.minutes)}`}
                  style={{
                    backgroundColor: categoryMeta(row.category).color,
                    flexGrow: row.minutes,
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {stats.byCategory.map((row) => (
                <span key={row.category} className="meta flex items-center gap-2">
                  <span
                    className="h-[7px] w-[7px]"
                    style={{ backgroundColor: categoryMeta(row.category).color }}
                  />
                  {categoryMeta(row.category).label}{" "}
                  {formatMinutes(row.minutes)}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="board-panel">
        <div className="board-head">
          <p className="meta flex items-center gap-2 text-char-2">
            <Globe2 size={12} strokeWidth={1.5} />
            yakında
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <h2 className="font-display text-[19px]">Global sıralama</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-char-2">
            Hesap sistemi eklendiğinde haftalık XP&apos;ye göre herkesin
            sıralandığı tablo burada olacak. Veri katmanı şimdiden soyutlandı;
            sunucudan okuyan bir implementasyon yazmak yeterli.
          </p>
        </div>
      </section>
    </div>
  );
}
