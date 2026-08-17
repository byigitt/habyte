import {
  Bird,
  BookOpen,
  Boxes,
  Camera,
  ChefHat,
  CircleDot,
  Coffee,
  Crown,
  Dumbbell,
  Feather,
  Footprints,
  Guitar,
  HeartHandshake,
  Languages,
  Mountain,
  NotebookPen,
  PenTool,
  PersonStanding,
  Piano,
  SlidersVertical,
  Sprout,
  Terminal,
  Waves,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Katalogdaki her uğraşın simgesi buradan geçer. Serbest string yerine kayıt
 * defteri: yanlış anahtar derleme zamanında patlar, emoji hiç girmez.
 */
export const HABIT_ICONS = {
  cube: Boxes,
  book: BookOpen,
  guitar: Guitar,
  pen: PenTool,
  terminal: Terminal,
  notebook: NotebookPen,
  run: Footprints,
  dumbbell: Dumbbell,
  stretch: PersonStanding,
  breath: Wind,
  language: Languages,
  chef: ChefHat,
  camera: Camera,
  chess: Crown,
  piano: Piano,
  swim: Waves,
  hike: Mountain,
  origami: Bird,
  mixer: SlidersVertical,
  plant: Sprout,
  calligraphy: Feather,
  coffee: Coffee,
  handshake: HeartHandshake,
  wrench: Wrench,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof HABIT_ICONS;

/** Geçmiş kayıtlar bilinmeyen bir anahtar taşıyabilir; arayüz boş kalmasın. */
export function iconFor(key: string): LucideIcon {
  return HABIT_ICONS[key as IconKey] ?? CircleDot;
}

/**
 * Eski sürüm oturumları emoji saklıyordu. Kayıt silinmesin diye okurken
 * anahtara çevriliyor.
 */
const LEGACY_EMOJI_TO_ICON: Record<string, IconKey> = {
  "🧩": "cube",
  "📚": "book",
  "🎸": "guitar",
  "✏️": "pen",
  "💻": "terminal",
  "📝": "notebook",
  "🏃": "run",
  "🏋️": "dumbbell",
  "🧘": "stretch",
  "🌬️": "breath",
  "🗣️": "language",
  "🍳": "chef",
  "📷": "camera",
  "♟️": "chess",
  "🎹": "piano",
  "🏊": "swim",
  "🚶": "hike",
  "🦢": "origami",
  "🎛️": "mixer",
  "🪴": "plant",
  "🖋️": "calligraphy",
  "☕": "coffee",
  "🤝": "handshake",
  "🔧": "wrench",
};

export function iconKeyFromEmoji(emoji: string | undefined): IconKey | undefined {
  return emoji ? LEGACY_EMOJI_TO_ICON[emoji] : undefined;
}
