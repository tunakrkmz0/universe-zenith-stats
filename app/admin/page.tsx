"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AdminArticleApiError,
  getAdminArticles,
} from "@/lib/admin-article-api-client";

const ADMIN_PASSWORD_STORAGE_KEY = "uz_admin_password";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);

    if (storedPassword) {
      setPassword(storedPassword);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      setErrorMessage("Admin şifresi boş olamaz.");
      return;
    }

    setIsChecking(true);
    setErrorMessage("");

    try {
      await getAdminArticles(trimmedPassword);

      localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, trimmedPassword);
      router.push("/admin/articles");
    } catch (error) {
      localStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);

      if (error instanceof AdminArticleApiError) {
        if (error.status === 401) {
          setErrorMessage("Admin şifresi hatalı.");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("Admin girişi kontrol edilirken hata oluştu.");
      }
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <main className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_25%,rgba(8,145,178,0.15),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(190,121,35,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#806b3a]/10" />

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-lg flex-col justify-center px-6 py-16">
        <div className="relative border border-[#29465e]/70 bg-[#06101e]/85 p-7 shadow-[0_35px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-10">
          <span className="absolute -left-px -top-px size-10 border-l border-t border-[#c89b3c]" />
          <span className="absolute -bottom-px -right-px size-10 border-b border-r border-[#c89b3c]" />

          <div className="flex items-center gap-4">
            <div className="grid size-14 shrink-0 rotate-45 place-items-center border border-[#806b3a] bg-[#0b2638] shadow-[0_0_28px_rgba(73,201,232,0.12)]">
              <span className="-rotate-45 text-2xl text-[#7ee7f2]" aria-hidden="true">◇</span>
            </div>
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.32em] text-[#c8aa6e]">Yetkili erişim</p>
              <h1 className="mt-1 text-3xl font-black text-[#f0e6d2]">Komuta Merkezi</h1>
            </div>
          </div>

          <p className="mt-7 border-l border-[#29465e] pl-4 text-sm leading-7 text-[#8295a8]">
            Universe Zenith içerik arşivini yönetmek için yönetici anahtarını kullan.
          </p>

          {errorMessage && (
            <div className="mt-6 flex gap-3 border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
              <span aria-hidden="true">!</span><span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#c8aa6e]">
                Yönetici anahtarı
              </label>

              <input
                id="admin-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Anahtarını gir"
                autoComplete="current-password"
                className="w-full border border-[#29465e] bg-[#020713]/80 px-5 py-4 text-[#f0e6d2] outline-none transition placeholder:text-[#526a7f] focus:border-[#49c9e8] focus:shadow-[0_0_24px_rgba(73,201,232,0.12)]"
              />
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="group flex min-h-14 items-center justify-center gap-3 border border-[#f0d58a] bg-gradient-to-b from-[#27a8c7] via-[#14758f] to-[#0a4a61] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[inset_0_0_0_1px_rgba(5,24,38,0.8),0_0_28px_rgba(73,201,232,0.2)] transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isChecking && <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {isChecking ? "Erişim doğrulanıyor" : "Panele giriş yap"}
              {!isChecking && <span className="text-lg transition group-hover:translate-x-1">→</span>}
            </button>
          </form>

          <p className="mt-6 text-center text-[0.65rem] uppercase tracking-[0.2em] text-[#526a7f]">Korumalı yönetim alanı</p>
        </div>
      </section>
    </main>
  );
}
