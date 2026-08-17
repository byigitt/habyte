import { createElement } from "react";
import type { LucideProps } from "lucide-react";
import { iconFor } from "@/lib/icons";

type Props = LucideProps & { icon: string };

/**
 * Kayıt defterinden ikon çizer. Bileşen render sırasında capitalize edilmiş
 * bir değişkene atanmasın diye createElement ile kuruluyor.
 */
export function Glyph({ icon, strokeWidth = 1.5, ...rest }: Props) {
  return createElement(iconFor(icon), { strokeWidth, ...rest });
}
