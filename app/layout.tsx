import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Universe Zenith Stats",
  description:
    "League of Legends oyuncu istatistikleri ve performans analiz platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-screen bg-slate-950">
          <header className="border-b border-slate-800 bg-slate-950/90">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-100">
                  Universe Zenith Stats
                </span>
                <span className="text-xs text-slate-500">
                  League of Legends Analysis
                </span>
              </Link>

              <nav className="flex items-center gap-4 text-sm text-slate-400">
                <Link
                  href="/"
                  className="transition hover:text-cyan-300"
                >
                  Analiz
                </Link>

                <a
                  href="https://universezenith.com"
                  className="transition hover:text-cyan-300"
                >
                  universezenith.com
                </a>
              </nav>
            </div>
          </header>

          {children}

          <footer className="border-t border-slate-800 bg-slate-950">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-500">
              <p>
                Universe Zenith Stats, League of Legends oyuncu istatistiklerini
                analiz etmeye yönelik bağımsız bir platformdur.
              </p>

              <p>
                Universe Zenith Stats, Riot Games tarafından desteklenmez ve Riot
                Games’in resmi ürünü değildir. Riot Games ve ilişkili tüm markalar
                Riot Games, Inc.’e aittir.
              </p>

              <p>
                © {new Date().getFullYear()} Universe Zenith Stats. Tüm hakları
                saklıdır.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}