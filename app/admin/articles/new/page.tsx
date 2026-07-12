"use client";

import { useState } from "react";
import Link from "next/link";
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
    { label: "Yama", value: "patch" },
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
    <main className="relative isolate min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_12%,rgba(8,145,178,0.13),transparent_25%),radial-gradient(circle_at_90%_42%,rgba(190,121,35,0.1),transparent_30%)]" />
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <div className="relative border border-[#29465e]/60 bg-[#06101e]/80 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.3)] sm:p-9">
          <span className="absolute -left-px -top-px size-8 border-l border-t border-[#c89b3c]" />
          <Link href="/admin/articles" className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#8295a8] transition hover:text-[#7ee7f2]">
            <span className="text-[#49c9e8] transition group-hover:-translate-x-1">←</span> Arşive dön
          </Link>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.3em] text-[#c8aa6e]">İçerik stüdyosu</p>
          <h1 className="mt-3 text-4xl font-black text-[#f0e6d2] sm:text-5xl">Yeni Arşiv Kaydı</h1>
          <p className="mt-3 text-[#8295a8]">Şampiyon, eşya, rehber, yama veya haber içeriği oluştur.</p>
        </div>

        {errorMessage && (
          <div className="flex gap-3 border border-rose-500/40 bg-rose-950/30 p-5 text-rose-200">
            <span aria-hidden="true">!</span><span>{errorMessage}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col gap-7 border border-[#29465e]/55 bg-[#06101e]/75 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.25)] sm:p-9"
        >
          <span className="absolute -bottom-px -right-px size-8 border-b border-r border-[#c89b3c]" />
          <div className="border-b border-[#29465e]/45 pb-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#c8aa6e]">Temel bilgiler</p>
            <p className="mt-2 text-sm text-[#6f8498]">Yazının kimliğini ve arşivde nasıl görüneceğini belirle.</p>
          </div>
          <div>
            <label htmlFor="article-title" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#b8c7d9]">
              Başlık
            </label>
            <input
              id="article-title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              className="w-full border border-[#29465e] bg-[#020713]/75 px-5 py-4 text-lg text-[#f0e6d2] outline-none transition placeholder:text-[#526a7f] focus:border-[#49c9e8] focus:shadow-[0_0_22px_rgba(73,201,232,0.1)]"
              placeholder="Örn: Ahri Başlangıç Rehberi"
              minLength={2}
              required
            />
          </div>

          <div>
            <label htmlFor="article-slug" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#b8c7d9]">
              Slug
            </label>
            <input
              id="article-slug"
              value={slug}
              onChange={(event) => setSlug(createSlug(event.target.value))}
              className="w-full border border-[#29465e] bg-[#020713]/75 px-5 py-3 font-mono text-sm text-[#7ee7f2] outline-none transition placeholder:text-[#526a7f] focus:border-[#49c9e8]"
              placeholder="ahri-baslangic-rehberi"
              minLength={2}
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="article-category" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#b8c7d9]">
                Kategori
              </label>
              <select
                id="article-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as CreateArticleRequest["category"])
                }
                className="w-full border border-[#29465e] bg-[#020713] px-4 py-3.5 text-[#f0e6d2] outline-none transition focus:border-[#49c9e8]"
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="article-status" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#b8c7d9]">
                Durum
              </label>
              <select
                id="article-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as CreateArticleRequest["status"])
                }
                className="w-full border border-[#29465e] bg-[#020713] px-4 py-3.5 text-[#f0e6d2] outline-none transition focus:border-[#49c9e8]"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="article-excerpt" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#b8c7d9]">
              Özet
            </label>
            <textarea
              id="article-excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={3}
              className="w-full resize-y border border-[#29465e] bg-[#020713]/75 px-5 py-4 leading-7 text-[#c1ceda] outline-none transition placeholder:text-[#526a7f] focus:border-[#49c9e8]"
              placeholder="Kartlarda ve yazı girişinde görünecek kısa açıklama."
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label htmlFor="article-content" className="block text-xs font-black uppercase tracking-[0.16em] text-[#c8aa6e]">İçerik</label>
              <span className="text-[0.65rem] uppercase tracking-wider text-[#526a7f]">{content.length} karakter</span>
            </div>
            <textarea
              id="article-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              className="w-full resize-y border border-[#29465e] bg-[#020713]/85 px-5 py-5 font-mono text-sm leading-7 text-[#d2dce5] outline-none transition placeholder:text-[#526a7f] focus:border-[#49c9e8] focus:shadow-[0_0_28px_rgba(73,201,232,0.08)]"
              placeholder="Yazının ana içeriği."
              minLength={10}
              required
            />
          </div>

          <div>
            <label htmlFor="cover-url" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#b8c7d9]">
              Kapak Görsel URL
            </label>
            <input
              id="cover-url"
              value={coverImageUrl}
              onChange={(event) => setCoverImageUrl(event.target.value)}
              className="w-full border border-[#29465e] bg-[#020713]/75 px-5 py-3 text-sm text-[#c1ceda] outline-none transition placeholder:text-[#526a7f] focus:border-[#49c9e8]"
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="meta-title" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#b8c7d9]">
                Meta Title
              </label>
              <input
                id="meta-title"
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                className="w-full border border-[#29465e] bg-[#020713]/75 px-4 py-3 text-[#c1ceda] outline-none transition focus:border-[#49c9e8]"
              />
            </div>

            <div>
              <label htmlFor="meta-description" className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#b8c7d9]">
                Meta Description
              </label>
              <input
                id="meta-description"
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                className="w-full border border-[#29465e] bg-[#020713]/75 px-4 py-3 text-[#c1ceda] outline-none transition focus:border-[#49c9e8]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex min-h-14 items-center justify-center gap-3 border border-[#f0d58a] bg-gradient-to-b from-[#27a8c7] via-[#14758f] to-[#0a4a61] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_0_28px_rgba(73,201,232,0.18)] transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
            {isSubmitting ? "Arşive kaydediliyor" : "Yazıyı kaydet"}
            {!isSubmitting && <span className="text-lg transition group-hover:translate-x-1">→</span>}
          </button>
        </form>
      </section>
    </main>
  );
}
