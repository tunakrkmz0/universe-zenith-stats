"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AdminArticleApiError,
  createAdminArticle,
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

export default function NewAdminArticlePage() {
  const router = useRouter();

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (title.trim().length < 2) {
      setErrorMessage("Başlık en az 2 karakter olmalı.");
      return;
    }

    if (slug.trim().length < 2) {
      setErrorMessage("Slug en az 2 karakter olmalı.");
      return;
    }

    if (content.trim().length < 10) {
      setErrorMessage("İçerik en az 10 karakter olmalı.");
      return;
    }

    setIsSubmitting(true);

    try {
      const adminPassword = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);

      if (!adminPassword) {
        setErrorMessage("Admin şifresi bulunamadı. Önce giriş yap.");
        return;
      }

      await createAdminArticle({
        adminPassword,
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
        setErrorMessage("Yazı oluşturulamadı.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="text-slate-100">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-bold">Yeni Yazı</h1>

          <p className="mt-3 text-slate-400">
            Şampiyon, eşya, rehber, patch veya haber içeriği oluştur.
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
              onChange={(event) => handleTitleChange(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Örn: Ahri Başlangıç Rehberi"
              minLength={2}
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
              placeholder="ahri-baslangic-rehberi"
              minLength={2}
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
              placeholder="Kartlarda ve yazı girişinde görünecek kısa açıklama."
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
              placeholder="Yazının ana içeriği."
              minLength={10}
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
            {isSubmitting ? "Kaydediliyor..." : "Yazıyı Kaydet"}
          </button>
        </form>
      </section>
    </main>
  );
}
