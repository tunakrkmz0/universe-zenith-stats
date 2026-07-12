import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ArticleDetailRecord = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

type GuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const categoryStyles: Record<
  string,
  { label: string; text: string; border: string; glow: string }
> = {
  champion: {
    label: "Şampiyon",
    text: "text-fuchsia-200",
    border: "border-fuchsia-400/60",
    glow: "bg-fuchsia-500/15",
  },
  item: {
    label: "Eşya",
    text: "text-amber-200",
    border: "border-amber-400/60",
    glow: "bg-amber-500/15",
  },
  guide: {
    label: "Rehber",
    text: "text-cyan-200",
    border: "border-cyan-400/60",
    glow: "bg-cyan-500/15",
  },
  patch: {
    label: "Yama",
    text: "text-violet-200",
    border: "border-violet-400/60",
    glow: "bg-violet-500/15",
  },
  news: {
    label: "Haber",
    text: "text-emerald-200",
    border: "border-emerald-400/60",
    glow: "bg-emerald-500/15",
  },
};

function formatDate(value: Date | null): string {
  if (!value) return "Yayın tarihi yok";

  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(value);
}

function getCategoryStyle(category: string) {
  return categoryStyles[category] ?? categoryStyles.guide;
}

function getArticleImageUrl(article: ArticleDetailRecord) {
  if (article.coverImageUrl) return article.coverImageUrl;

  if (article.category === "champion") {
    const championName = article.title.trim().split(/\s+/)[0];

    if (championName) {
      return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${encodeURIComponent(championName)}_0.jpg`;
    }
  }

  return "/images/universe-zenith-logo.jpeg";
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const article = (await prisma.article.findFirst({
    where: { slug, status: "published" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      content: true,
      coverImageUrl: true,
      metaTitle: true,
      metaDescription: true,
      publishedAt: true,
      updatedAt: true,
    },
  })) as ArticleDetailRecord | null;

  if (!article) notFound();

  const categoryStyle = getCategoryStyle(article.category);
  const articleImageUrl = getArticleImageUrl(article);

  return (
    <main className="relative isolate min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_12%_18%,rgba(88,28,135,0.2),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(8,145,178,0.16),transparent_30%),radial-gradient(circle_at_50%_82%,rgba(190,121,35,0.08),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[34rem] -z-20 h-[60rem] w-px bg-gradient-to-b from-[#c89b3c]/25 via-cyan-300/15 to-transparent" />

      <article>
        <header className="relative min-h-[34rem] overflow-hidden border-b border-[#806b3a]/30">
          <div
            className="pointer-events-none absolute inset-0 -z-30 bg-cover bg-center"
            style={{ backgroundImage: `url('${articleImageUrl}')` }}
          />
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,7,19,0.98)_0%,rgba(3,13,27,0.9)_48%,rgba(2,7,19,0.45)_100%)]" />
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(0deg,#020713_0%,rgba(2,7,19,0.35)_55%,rgba(2,7,19,0.65)_100%)]" />
          <div className={`pointer-events-none absolute right-[12%] top-[20%] -z-10 size-72 rounded-full blur-3xl ${categoryStyle.glow}`} />

          <div className="mx-auto flex min-h-[34rem] w-full max-w-6xl flex-col px-6 py-10">
            <Link
              href="/guides"
              className="group inline-flex w-fit items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#9aabba] transition hover:text-[#f0e6d2]"
            >
              <span className="text-lg text-[#49c9e8] transition group-hover:-translate-x-1">←</span>
              Sihirdar haritasına dön
            </Link>

            <div className="mt-auto max-w-4xl pt-24">
              <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.22em]">
                <span className={categoryStyle.text}>{categoryStyle.label}</span>
                <span className="size-1 rotate-45 bg-[#c89b3c]" />
                <span className="text-[#8295a8]">{formatDate(article.publishedAt)}</span>
              </div>
              <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-[#f0e6d2] drop-shadow-2xl sm:text-6xl lg:text-7xl">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="mt-7 max-w-3xl border-l-2 border-[#c89b3c] pl-5 text-base leading-8 text-[#b8c7d9] sm:text-lg">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16 lg:py-24">
          <aside className="hidden lg:block">
            <div className="sticky top-28 border-t border-[#806b3a]/50 pt-5">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-[#c8aa6e]">Arşiv kaydı</p>
              <p className="mt-3 text-sm leading-6 text-[#6f8498]">Universe Zenith<br />Rehber Koleksiyonu</p>
              <div className={`mt-6 size-3 rotate-45 border bg-[#07111f] ${categoryStyle.border}`} />
            </div>
          </aside>

          <section className="relative border border-[#29465e]/55 bg-[#06101e]/75 px-6 py-9 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:px-10 sm:py-12 lg:px-14">
            <span className="absolute -left-px -top-px size-8 border-l border-t border-[#c89b3c]" />
            <span className="absolute -bottom-px -right-px size-8 border-b border-r border-[#c89b3c]" />
            <p className={`mb-8 text-xs font-black uppercase tracking-[0.28em] ${categoryStyle.text}`}>Rehber notları</p>
            <div className="whitespace-pre-line text-base leading-8 text-[#c1ceda] sm:text-lg sm:leading-9">
              {article.content}
            </div>
          </section>
        </div>

        <footer className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="flex flex-col items-center justify-between gap-7 border-y border-[#806b3a]/35 py-9 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#c8aa6e]">Rotanın sonu</p>
              <p className="mt-2 text-lg font-bold text-[#f0e6d2]">Yeni bir rehber keşfetmeye hazır mısın?</p>
            </div>
            <Link
              href="/guides"
              className="group inline-flex items-center gap-3 border border-[#49c9e8]/50 bg-[#0b2638]/70 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#7ee7f2] transition hover:border-[#e2c36f] hover:text-[#f0e6d2]"
            >
              Tüm durakları gör
              <span className="text-lg transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
