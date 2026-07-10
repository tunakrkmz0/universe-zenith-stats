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
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(value: Date | null): string {
  if (!value) {
    return "Yayın tarihi yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long",
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

export default async function GuideDetailPage({
  params,
}: GuideDetailPageProps) {
  const { slug } = await params;

  const article = (await prisma.article.findFirst({
    where: {
      slug,
      status: "published",
    },
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

  if (!article) {
    notFound();
  }

  return (
    <main className="text-slate-100">
      <article className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <div>
          <Link
            href="/guides"
            className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            ← Rehberlere dön
          </Link>
        </div>

        <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {getCategoryLabel(article.category)}
            </span>

            <span className="text-sm text-slate-500">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-5 text-lg leading-8 text-slate-400">
              {article.excerpt}
            </p>
          )}
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div className="whitespace-pre-line text-base leading-8 text-slate-300">
            {article.content}
          </div>
        </section>
      </article>
    </main>
  );
}