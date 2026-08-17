import type { IconKey } from "./icons";

export type Category =
  | "zihin"
  | "beden"
  | "yaratici"
  | "beceri"
  | "sosyal"
  | "huzur";

export type Difficulty = 1 | 2 | 3;

export type Habit = {
  id: string;
  name: string;
  icon: IconKey;
  category: Category;
  difficulty: Difficulty;
  /** Tek oturumda önerilen süre aralığı (dakika). */
  minMinutes: number;
  maxMinutes: number;
  description: string;
  /** Hiç yapmamış biri için ilk oturumda atılacak somut adım. */
  firstStep: string;
  gear?: string;
};

export type Mood = "kotu" | "idare" | "iyi" | "harika";

export type SessionLog = {
  id: string;
  habitId: string;
  /** Katalog değişse bile geçmiş okunabilir kalsın diye kopyalanıyor. */
  habitName: string;
  icon: IconKey;
  category: Category;
  difficulty: Difficulty;
  startedAt: string;
  endedAt: string;
  plannedMinutes: number;
  activeSeconds: number;
  mood: Mood | null;
  note: string;
};

/** v1 kayıtları diskte emoji tutuyordu; okuma sırasında dönüştürülüyor. */
export type StoredSession = Omit<SessionLog, "icon"> & {
  icon?: IconKey;
  emoji?: string;
};

export type Profile = {
  displayName: string;
  createdAt: string;
};

export type SpinFilters = {
  categories: Category[];
  maxDifficulty: Difficulty;
  minutes: number;
};
