import { iconKeyFromEmoji } from "./icons";
import type { Profile, SessionLog, StoredSession } from "./types";

/**
 * MVP verisi tarayıcıda duruyor. Hesap + global leaderboard geldiğinde
 * bu arayüzün API'ye konuşan başka bir implementasyonu yazılacak,
 * uygulama kodu değişmeyecek.
 */
export interface HabyteRepository {
  listSessions(): SessionLog[];
  addSession(session: SessionLog): void;
  deleteSession(id: string): void;
  getProfile(): Profile;
  saveProfile(profile: Profile): void;
  clear(): void;
  subscribe(listener: () => void): () => void;
}

const SESSIONS_KEY = "habyte.v1.sessions";
const PROFILE_KEY = "habyte.v1.profile";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Kota dolu ya da private mode: MVP'de sessizce geç.
  }
}

/** v1 kayıtları emoji tutuyordu; okurken ikon anahtarına çevriliyor. */
function migrate(stored: StoredSession): SessionLog {
  const { emoji, icon, ...rest } = stored;
  return { ...rest, icon: icon ?? iconKeyFromEmoji(emoji) ?? "cube" };
}

const DEFAULT_PROFILE: Profile = {
  displayName: "Sen",
  createdAt: new Date().toISOString(),
};

export const localRepository: HabyteRepository = {
  listSessions() {
    const sessions = readJSON<StoredSession[]>(SESSIONS_KEY, []);
    if (!Array.isArray(sessions)) return [];
    return sessions
      .map(migrate)
      .sort((a, b) => b.endedAt.localeCompare(a.endedAt));
  },

  addSession(session) {
    const sessions = readJSON<StoredSession[]>(SESSIONS_KEY, []);
    writeJSON(SESSIONS_KEY, [...sessions, session]);
    emit();
  },

  deleteSession(id) {
    const sessions = readJSON<StoredSession[]>(SESSIONS_KEY, []);
    writeJSON(
      SESSIONS_KEY,
      sessions.filter((s) => s.id !== id),
    );
    emit();
  },

  getProfile() {
    return { ...DEFAULT_PROFILE, ...readJSON<Partial<Profile>>(PROFILE_KEY, {}) };
  },

  saveProfile(profile) {
    writeJSON(PROFILE_KEY, profile);
    emit();
  },

  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(SESSIONS_KEY);
    window.localStorage.removeItem(PROFILE_KEY);
    emit();
  },

  subscribe(listener) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === SESSIONS_KEY || event.key === PROFILE_KEY) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
};

export function exportData(): string {
  return JSON.stringify(
    {
      version: 2,
      exportedAt: new Date().toISOString(),
      profile: localRepository.getProfile(),
      sessions: localRepository.listSessions(),
    },
    null,
    2,
  );
}

export function importData(json: string): { ok: boolean; count: number } {
  try {
    const parsed = JSON.parse(json) as {
      sessions?: StoredSession[];
      profile?: Profile;
    };
    if (!parsed.sessions || !Array.isArray(parsed.sessions)) {
      return { ok: false, count: 0 };
    }
    writeJSON(SESSIONS_KEY, parsed.sessions.map(migrate));
    if (parsed.profile) writeJSON(PROFILE_KEY, parsed.profile);
    emit();
    return { ok: true, count: parsed.sessions.length };
  } catch {
    return { ok: false, count: 0 };
  }
}
