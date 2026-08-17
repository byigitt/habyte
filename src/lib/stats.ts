import type { IconKey } from "./icons";
import type { Category, SessionLog } from "./types";

export function dayKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** Zorluk arttıkça dakika başına puan artıyor: 1x, 1.25x, 1.5x. */
export function sessionXp(session: SessionLog): number {
  const minutes = session.activeSeconds / 60;
  return Math.round(minutes * (1 + 0.25 * (session.difficulty - 1)));
}

export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  // Her seviye bir öncekinden 150 XP daha pahalı: 300, 450, 600...
  let level = 1;
  let remaining = xp;
  let need = 300;
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need += 150;
  }
  return { level, into: remaining, need };
}

export type DayBucket = { key: string; minutes: number; sessions: number };

export type HabitTotal = {
  habitId: string;
  habitName: string;
  icon: IconKey;
  minutes: number;
  sessions: number;
  xp: number;
  longestSessionMinutes: number;
  lastDoneAt: string;
};

export type Stats = {
  totalSessions: number;
  totalMinutes: number;
  xp: number;
  level: number;
  levelInto: number;
  levelNeed: number;
  currentStreak: number;
  longestStreak: number;
  todayMinutes: number;
  weekMinutes: number;
  distinctHabits: number;
  byHabit: HabitTotal[];
  byCategory: { category: Category; minutes: number }[];
  lastDays: DayBucket[];
};

export function computeStats(sessions: SessionLog[], days = 14): Stats {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.activeSeconds / 60, 0);
  const xp = sessions.reduce((sum, s) => sum + sessionXp(s), 0);
  const { level, into, need } = levelFromXp(xp);

  const doneDays = new Set(sessions.map((s) => dayKey(s.endedAt)));
  const today = new Date();
  const todayKey = dayKey(today);

  let currentStreak = 0;
  // Bugün henüz bir şey yapılmadıysa seri dünden geriye sayılır, kırılmaz.
  let cursor = doneDays.has(todayKey) ? today : addDays(today, -1);
  while (doneDays.has(dayKey(cursor))) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  const sortedDays = [...doneDays].sort();
  let longestStreak = 0;
  let run = 0;
  let previous: string | null = null;
  for (const key of sortedDays) {
    if (previous && dayKey(addDays(new Date(`${previous}T12:00:00`), 1)) === key) {
      run += 1;
    } else {
      run = 1;
    }
    longestStreak = Math.max(longestStreak, run);
    previous = key;
  }

  const weekStart = addDays(today, -6);
  weekStart.setHours(0, 0, 0, 0);

  const todayMinutes = sessions
    .filter((s) => dayKey(s.endedAt) === todayKey)
    .reduce((sum, s) => sum + s.activeSeconds / 60, 0);

  const weekMinutes = sessions
    .filter((s) => new Date(s.endedAt) >= weekStart)
    .reduce((sum, s) => sum + s.activeSeconds / 60, 0);

  const habitMap = new Map<string, HabitTotal>();
  for (const s of sessions) {
    const minutes = s.activeSeconds / 60;
    const existing = habitMap.get(s.habitId);
    if (existing) {
      existing.minutes += minutes;
      existing.sessions += 1;
      existing.xp += sessionXp(s);
      existing.longestSessionMinutes = Math.max(
        existing.longestSessionMinutes,
        minutes,
      );
      if (s.endedAt > existing.lastDoneAt) existing.lastDoneAt = s.endedAt;
    } else {
      habitMap.set(s.habitId, {
        habitId: s.habitId,
        habitName: s.habitName,
        icon: s.icon,
        minutes,
        sessions: 1,
        xp: sessionXp(s),
        longestSessionMinutes: minutes,
        lastDoneAt: s.endedAt,
      });
    }
  }

  const categoryMap = new Map<Category, number>();
  for (const s of sessions) {
    categoryMap.set(
      s.category,
      (categoryMap.get(s.category) ?? 0) + s.activeSeconds / 60,
    );
  }

  const lastDays: DayBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = dayKey(addDays(today, -i));
    const daySessions = sessions.filter((s) => dayKey(s.endedAt) === key);
    lastDays.push({
      key,
      minutes: daySessions.reduce((sum, s) => sum + s.activeSeconds / 60, 0),
      sessions: daySessions.length,
    });
  }

  return {
    totalSessions: sessions.length,
    totalMinutes: Math.round(totalMinutes),
    xp,
    level,
    levelInto: into,
    levelNeed: need,
    currentStreak,
    longestStreak,
    todayMinutes: Math.round(todayMinutes),
    weekMinutes: Math.round(weekMinutes),
    distinctHabits: habitMap.size,
    byHabit: [...habitMap.values()].sort((a, b) => b.minutes - a.minutes),
    byCategory: [...categoryMap.entries()]
      .map(([category, minutes]) => ({ category, minutes: Math.round(minutes) }))
      .sort((a, b) => b.minutes - a.minutes),
    lastDays,
  };
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${hours}:${`${minutes}`.padStart(2, "0")}:${`${secs}`.padStart(2, "0")}`;
  }
  return `${`${minutes}`.padStart(2, "0")}:${`${secs}`.padStart(2, "0")}`;
}

export function formatMinutes(minutes: number): string {
  const rounded = Math.round(minutes);
  if (minutes > 0 && rounded === 0) return "1 dk'dan az";
  if (rounded < 60) return `${rounded} dk`;
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return rest === 0 ? `${hours} sa` : `${hours} sa ${rest} dk`;
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

export function formatRelative(iso: string): string {
  const diffSeconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const formatter = new Intl.RelativeTimeFormat("tr", { numeric: "auto" });
  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return formatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return "az önce";
}
