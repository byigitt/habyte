/**
 * Kendi markamız: menteşesinden ikiye ayrılmış bir flap hücresi, altta
 * kehribar bir çentik. Hazır ikon setinden alınmadı ki logo, arayüzün geri
 * kalanındaki lucide diliyle karışmasın.
 */
export function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.25"
        y="2.75"
        width="17.5"
        height="18.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="3.25"
        y1="12"
        x2="20.75"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="7.75" y="15.5" width="8.5" height="2.75" fill="var(--amber)" />
    </svg>
  );
}
