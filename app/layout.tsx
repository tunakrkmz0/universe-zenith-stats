import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Universe Zenith Stats",
    template: "%s | Universe Zenith Stats",
  },
  description:
    "League of Legends oyuncu istatistikleri, maç geçmişi ve performans analiz platformu.",
  applicationName: "Universe Zenith Stats",
  keywords: [
    "League of Legends",
    "LoL stats",
    "LoL player analysis",
    "Riot ID analysis",
    "Universe Zenith Stats",
  ],
  authors: [
    {
      name: "Universe Zenith",
    },
  ],
  openGraph: {
    title: "Universe Zenith Stats",
    description:
      "League of Legends oyuncu istatistikleri, maç geçmişi ve performans analiz platformu.",
    url: siteUrl,
    siteName: "Universe Zenith Stats",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universe Zenith Stats",
    description:
      "League of Legends oyuncu istatistikleri, maç geçmişi ve performans analiz platformu.",
  },
  robots: {
    index: true,
    follow: true,
  },
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

                <Link href="/privacy" className="transition hover:text-cyan-300">
                  Gizlilik
                </Link>

                <Link href="/terms" className="transition hover:text-cyan-300">
                  Şartlar
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
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="transition hover:text-cyan-300">
                Gizlilik Politikası
              </Link>

              <Link href="/terms" className="transition hover:text-cyan-300">
                Kullanım Şartları
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}