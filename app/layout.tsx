import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";


import { SiteNavigation } from "@/components/site-navigation";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Universe Zenith",
    template: "%s | Universe Zenith",
  },
  description:
    "League of Legends oyuncu analizi, maç istatistikleri ve şampiyon rehberleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Consent Manager - mümkün olan en üstte */}
        <Script
          id="consentmanager"
          strategy="beforeInteractive"
          src="https://cdn.consentmanager.net/delivery/autoblocking/c20fb8ac9268c.js"
          data-cmp-ab="1"
          data-cmp-host="b.delivery.consentmanager.net"
          data-cmp-cdn="cdn.consentmanager.net"
          data-cmp-codesrc="16"
        />

        {/* Google AdSense */}
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2050807222656315"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6KHFEL5T4W"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-6KHFEL5T4W');
    `}
        </Script>
      </head>

      <body className="bg-slate-950 text-slate-100 antialiased">
        <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-semibold tracking-wide text-slate-100"
            >
              <Image
                src="/images/universe-zenith-logo.jpeg"
                alt="Universe Zenith"
                width={40}
                height={40}
                className="rounded-full"
                priority
              />
              <span>Universe Zenith</span>
            </Link>

            <SiteNavigation />
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-slate-800 bg-slate-950">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Universe Zenith. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/privacy"
                className="transition hover:text-slate-200"
              >
                Privacy Policy
              </Link>

              <Link href="/terms" className="transition hover:text-slate-200">
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 pb-8 text-xs leading-6 text-slate-500">
            Universe Zenith isn't endorsed by Riot Games and doesn't reflect the
            views or opinions of Riot Games or anyone officially involved in
            producing or managing Riot Games properties. Riot Games, League of
            Legends and all associated properties are trademarks or registered
            trademarks of Riot Games, Inc.
          </div>
        </footer>
      </body>
    </html>
  );
}