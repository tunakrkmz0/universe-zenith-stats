"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AdminArticleApiError,
  getAdminArticles,
} from "@/lib/admin-article-api-client";
import type { ArticleListItem } from "@/types/article";

const ADMIN_PASSWORD_STORAGE_KEY = "uz_admin_password";

function formatDate(value: string | Date | null): string {
  if (!value) {
    return "Yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
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

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadArticles() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const adminPassword = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);

      if (!adminPassword) {
        setErrorMessage("Admin şifresi bulunamadı. Önce giriş yap.");
        return;
      }

      const response = await getAdminArticles(adminPassword);
      setArticles(response.articles);
    } catch (error) {
      if (error instanceof AdminArticleApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Yazılar alınamadı.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadArticles();
  }, []);

  return (
    <main className="text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Admin Panel
            </p>

            <h1 className="mt-2 text-4xl font-bold">Yazılar</h1>

            <p className="mt-3 text-slate-400">
              Rehber, şampiyon, eşya, patch ve haber içeriklerini yönet.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadArticles}
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Yenile
            </button>

            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Yeni Yazı
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">
            Yazılar yükleniyor...
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && articles.length === 0 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">
            Henüz yazı yok.
          </div>
        )}

        {!isLoading && !errorMessage && articles.length > 0 && (
          <div className="grid gap-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {getCategoryLabel(article.category)}
                      </span>

                      <span
                        className={
                          article.status === "published"
                            ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300"
                            : "rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300"
                        }
                      >
                        {article.status === "published" ? "Yayında" : "Taslak"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-100">
                      {article.title}
                    </h2>

                    <div className="mt-3 flex flex-col gap-1 text-sm text-slate-500">
                      <p>Slug: {article.slug}</p>
                      <p>Yayın tarihi: {formatDate(article.publishedAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="rounded-xl border border-cyan-400/60 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
                    >
                      Düzenle
                    </Link>

                    {article.status === "published" && (
                      <Link
                        href={`/guides/${article.slug}`}
                        className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                      >
                        Sitede Gör
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}