import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteNavigation } from "@/components/site-navigation";

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
          <header className="sticky top-0 z-50 border-b border-[#806b3a]/35 bg-[#020713]/85 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c89b3c]/70 to-transparent" />
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-5 px-4 py-4 sm:px-6">
              <Link href="/" className="group flex items-center gap-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-[#c89b3c] bg-[#071525] p-0.5 shadow-[0_0_24px_rgba(73,201,232,0.1)] transition group-hover:border-[#7ee7f2] group-hover:shadow-[0_0_28px_rgba(73,201,232,0.2)]">
                  <Image
                    src="/images/universe-zenith-logo.jpeg"
                    alt=""
                    fill
                    sizes="44px"
                    className="rounded-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 size-1.5 rotate-45 bg-[#49c9e8] shadow-[0_0_8px_#49c9e8]" />
                </span>

                <span className="flex flex-col">
                  <span className="text-base font-black tracking-tight text-[#f0e6d2] transition group-hover:text-white sm:text-lg">
                    Universe Zenith
                  </span>
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#6f8498]">
                    League Intelligence
                  </span>
                </span>
              </Link>

              <SiteNavigation />
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
