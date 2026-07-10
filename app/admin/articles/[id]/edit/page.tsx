"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  AdminArticleApiError,
  getAdminArticleById,
  updateAdminArticle,
  type CreateArticleRequest,
} from "@/lib/admin-article-api-client";

const ADMIN_PASSWORD_STORAGE_KEY = "uz_admin_password";

const categories: { label: string; value: CreateArticleRequest["category"] }[] =
  [
    { label: "Şampiyon", value: "champion" },
    { label: "Eşya", value: "item" },
    { label: "Rehber", value: "guide" },
    { label: "Patch", value: "patch" },
    { label: "Haber", value: "news" },
  ];

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditAdminArticlePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] =
    useState<CreateArticleRequest["category"]>("guide");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] =
    useState<CreateArticleRequest["status"]>("draft");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const articleId = Number(params.id);

  useEffect(() => {
    async function loadArticle() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const adminPassword = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);

        if (!adminPassword) {
          setErrorMessage("Admin şifresi bulunamadı. Önce giriş yap.");
          return;
        }

        if (!Number.isInteger(articleId) || articleId <= 0) {
          setErrorMessage("Geçersiz yazı ID değeri.");
          return;
        }

        const response = await getAdminArticleById({
          adminPassword,
          articleId,
        });

        setTitle(response.article.title);
        setSlug(response.article.slug);
        setCategory(response.article.category as CreateArticleRequest["category"]);
        setExcerpt(response.article.excerpt ?? "");
        setContent(response.article.content);
        setCoverImageUrl(response.article.coverImageUrl ?? "");
        setMetaTitle(response.article.metaTitle ?? "");
        setMetaDescription(response.article.metaDescription ?? "");
        setStatus(response.article.status as CreateArticleRequest["status"]);
      } catch (error) {
        if (error instanceof AdminArticleApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Yazı bilgileri alınamadı.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadArticle();
  }, [articleId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const adminPassword = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);

      if (!adminPassword) {
        setErrorMessage("Admin şifresi bulunamadı. Önce giriş yap.");
        return;
      }

      await updateAdminArticle({
        adminPassword,
        articleId,
        data: {
          title,
          slug,
          category,
          excerpt: excerpt || null,
          content,
          coverImageUrl: coverImageUrl || null,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          status,
        },
      });

      router.push("/admin/articles");
    } catch (error) {
      if (error instanceof AdminArticleApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Yazı güncellenemedi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="text-slate-100">
        <section className="mx-auto w-full max-w-4xl px-6 py-10">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-400">
            Yazı yükleniyor...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="text-slate-100">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-bold">Yazıyı Düzenle</h1>

          <p className="mt-3 text-slate-400">
            Taslak yazıyı yayına alabilir veya yayındaki yazıyı taslağa çekebilirsin.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-5 text-red-200">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Başlık
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Slug
            </label>
            <input
              value={slug}
              onChange={(event) => setSlug(createSlug(event.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Kategori
              </label>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as CreateArticleRequest["category"])
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Durum
              </label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as CreateArticleRequest["status"])
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Özet
            </label>
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              İçerik
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Kapak Görsel URL
            </label>
            <input
              value={coverImageUrl}
              onChange={(event) => setCoverImageUrl(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="https://..."
            />

            {coverImageUrl && (
              <img
                src={coverImageUrl}
                alt="Kapak görsel önizleme"
                className="mt-4 max-h-72 w-full rounded-2xl border border-slate-800 object-cover"
              />
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Meta Title
              </label>
              <input
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Meta Description
              </label>
              <input
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Güncelleniyor..." : "Yazıyı Güncelle"}
          </button>
        </form>
      </section>
    </main>
  );
}