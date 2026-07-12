"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AdminArticleApiError,
  deleteAdminArticle,
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
    patch: "Yama",
    news: "Haber",
  };

  return labels[category] ?? category;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingArticleId, setDeletingArticleId] = useState<number | null>(
    null
  );
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

  async function handleDeleteArticle(article: ArticleListItem) {
    const confirmed = window.confirm(
      `"${article.title}" yazısını kalıcı olarak silmek istediğine emin misin?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingArticleId(article.id);
    setErrorMessage("");

    try {
      const adminPassword = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);

      if (!adminPassword) {
        setErrorMessage("Admin şifresi bulunamadı. Önce giriş yap.");
        return;
      }

      await deleteAdminArticle({
        adminPassword,
        articleId: article.id,
      });

      setArticles((currentArticles) =>
        currentArticles.filter((item) => item.id !== article.id)
      );
    } catch (error) {
      if (error instanceof AdminArticleApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Yazı silinemedi.");
      }
    } finally {
      setDeletingArticleId(null);
    }
  }

  useEffect(() => {
    void loadArticles();
  }, []);

  const publishedCount = articles.filter((article) => article.status === "published").length;
  const draftCount = articles.length - publishedCount;

  return (
    <main className="relative isolate min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_10%,rgba(8,145,178,0.12),transparent_25%),radial-gradient(circle_at_90%_35%,rgba(190,121,35,0.1),transparent_30%)]" />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <div className="relative flex flex-col justify-between gap-7 border border-[#29465e]/60 bg-[#06101e]/80 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.3)] md:flex-row md:items-center md:p-9">
          <span className="absolute -left-px -top-px size-8 border-l border-t border-[#c89b3c]" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c8aa6e]">
              Komuta merkezi
            </p>
            <h1 className="mt-3 text-4xl font-black text-[#f0e6d2] sm:text-5xl">İçerik Arşivi</h1>
            <p className="mt-3 text-[#8295a8]">
              Rehber, şampiyon, eşya, yama ve haber içeriklerini yönet.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadArticles}
              className="border border-[#29465e] bg-[#020713]/50 px-5 py-3 text-xs font-black uppercase tracking-wider text-[#9aabba] transition hover:border-[#49c9e8] hover:text-[#7ee7f2]"
            >
              ↻ Yenile
            </button>

            <Link
              href="/admin/articles/new"
              className="border border-[#f0d58a] bg-gradient-to-b from-[#27a8c7] to-[#0a4a61] px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_24px_rgba(73,201,232,0.18)] transition hover:brightness-125"
            >
              + Yeni Yazı
            </Link>
          </div>
        </div>

        {!isLoading && !errorMessage && (
          <div className="grid grid-cols-3 border border-[#29465e]/50 bg-[#06101e]/50">
            {[
              ["Toplam kayıt", articles.length, "text-[#f0e6d2]"],
              ["Yayında", publishedCount, "text-emerald-300"],
              ["Taslak", draftCount, "text-amber-200"],
            ].map(([label, value, color], index) => (
              <div key={label} className={`px-4 py-5 text-center ${index > 0 ? "border-l border-[#29465e]/50" : ""}`}>
                <p className={`text-2xl font-black sm:text-3xl ${color}`}>{value}</p>
                <p className="mt-1 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#6f8498]">{label}</p>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-3 border border-[#29465e]/50 bg-[#06101e]/70 p-10 text-[#9aabba]">
            <span className="size-5 animate-spin rounded-full border-2 border-[#29465e] border-t-[#49c9e8]" />
            Arşiv yükleniyor...
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="border border-rose-500/40 bg-rose-950/30 p-6 text-rose-200">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && articles.length === 0 && (
          <div className="border border-dashed border-[#806b3a]/60 bg-[#06101e]/50 p-12 text-center text-[#8295a8]">
            Henüz arşiv kaydı bulunmuyor.
          </div>
        )}

        {!isLoading && !errorMessage && articles.length > 0 && (
          <div className="grid gap-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="group relative overflow-hidden border border-[#29465e]/55 bg-[#06101e]/75 p-6 transition hover:border-[#806b3a]/80 hover:bg-[#081522]"
              >
                <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#49c9e8]/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-[0.65rem] font-black uppercase tracking-wider">
                      <span className="border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                        {getCategoryLabel(article.category)}
                      </span>

                      <span
                        className={
                          article.status === "published"
                            ? "border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-emerald-300"
                            : "border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-amber-200"
                        }
                      >
                        {article.status === "published" ? "Yayında" : "Taslak"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-[#f0e6d2] transition group-hover:text-white">
                      {article.title}
                    </h2>

                    <div className="mt-3 flex flex-col gap-1 text-xs text-[#6f8498] sm:flex-row sm:gap-5">
                      <p>Slug: {article.slug}</p>
                      <p>Yayın tarihi: {formatDate(article.publishedAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="border border-cyan-400/50 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400 hover:text-[#020713]"
                    >
                      Düzenle
                    </Link>

                    {article.status === "published" && (
                      <Link
                        href={`/guides/${article.slug}`}
                        className="border border-[#29465e] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#9aabba] transition hover:border-[#c89b3c] hover:text-[#f0e6d2]"
                      >
                        Sitede Gör
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => void handleDeleteArticle(article)}
                      disabled={deletingArticleId === article.id}
                      className="border border-rose-500/50 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-rose-300 transition hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingArticleId === article.id ? "Siliniyor..." : "Sil"}
                    </button>
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
