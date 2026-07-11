"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    href: "/",
    label: "Analiz",
    isActive: (pathname: string) =>
      pathname === "/" || pathname.startsWith("/lol/"),
    className: "",
  },
  {
    href: "/guides",
    label: "Rehberler",
    isActive: (pathname: string) => pathname.startsWith("/guides"),
    className: "",
  },
  {
    href: "/privacy",
    label: "Gizlilik",
    isActive: (pathname: string) => pathname === "/privacy",
    className: "hidden md:block",
  },
  {
    href: "/terms",
    label: "Şartlar",
    isActive: (pathname: string) => pathname === "/terms",
    className: "hidden lg:block",
  },
];

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Ana navigasyon" className="flex items-center gap-1 text-sm">
      {navigationItems.map((item) => {
        const active = item.isActive(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative px-3 py-2 font-bold transition ${item.className} ${
              active
                ? "text-[#7ee7f2] after:absolute after:inset-x-3 after:-bottom-4 after:h-px after:bg-[#49c9e8] after:shadow-[0_0_8px_#49c9e8]"
                : "text-[#9aabba] hover:text-[#f0e6d2]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <span className="mx-2 hidden h-5 w-px bg-[#29465e] sm:block" />

      <a
        href="https://universezenith.com"
        target="_blank"
        rel="noreferrer"
        className="hidden items-center gap-2 border border-[#806b3a]/70 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#c8aa6e] transition hover:border-[#49c9e8] hover:text-[#7ee7f2] sm:flex"
      >
        Ana Site
        <span aria-hidden="true">↗</span>
      </a>
    </nav>
  );
}
