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
    <main className="text-slate-100">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Universe Zenith Stats
          </p>

          <h1 className="mt-2 text-3xl font-bold">Admin Girişi</h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            İçerik yönetimi için admin şifresini gir.
          </p>

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Admin Şifresi
              </label>

              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Admin şifresi"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isChecking ? "Kontrol ediliyor..." : "Panele Gir"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}