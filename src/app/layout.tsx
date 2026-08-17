import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const display = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "habyte — kalkış panosu",
  description:
    "Doom scrolling yerine panoyu çevir, günde 1-2 saatlik gerçek bir uğraşa kalk ve kaydet.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="room flex min-h-full flex-col bg-deck text-char">
        <Nav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
        <footer className="border-t border-rule-soft">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 sm:px-6">
            <p className="meta">habyte — kalkış panosu</p>
            <p className="meta">kayıtlar şimdilik yalnızca bu tarayıcıda</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
