import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ArticleListRecord = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
};

function formatDate(value: Date | null): string {
  if (!value) {
    return "Yayın tarihi yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
  }).format(value);
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    champion: "Şampiyon",
    item: "Eşya",
    guide: "Rehber",
    patch: "Patch",
    news: "Haber",
  };

  return labels[category] ?? category;
}

export default async function GuidesPage() {
  const articles = (await prisma.article.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  })) as ArticleListRecord[];

  return (
    <main className="text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Universe Zenith Stats
          </p>

          <h1 className="mt-2 text-4xl font-bold">LoL Rehberleri</h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Şampiyonlar, eşyalar, oynanış tavsiyeleri ve meta analizleri için
            hazırlanan içerikler.
          </p>
        </div>

        {articles.length === 0 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">
            Henüz yayınlanmış rehber bulunmuyor.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: ArticleListRecord) => (
            <Link
              key={article.id}
              href={`/guides/${article.slug}`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-cyan-400"
            >
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {getCategoryLabel(article.category)}
                  </span>

                  <span className="text-xs text-slate-500">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>

                <h2 className="text-2xl font-bold transition group-hover:text-cyan-300">
                  {article.title}
                </h2>

                {article.excerpt && (
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-400">
                    {article.excerpt}
                  </p>
                )}
              </div>

              <p className="mt-6 text-sm font-medium text-cyan-300">
                Rehberi oku →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}