"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AdminArticleApiError,
  getAdminArticles,
} from "@/lib/admin-article-api-client";

const ADMIN_PASSWORD_STORAGE_KEY = "uz_admin_password";

type AdminArticlesLayoutProps = {
  children: React.ReactNode;
};

export default function AdminArticlesLayout({
  children,
}: AdminArticlesLayoutProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function checkAdminSession() {
      setIsChecking(true);
      setErrorMessage("");

      try {
        const adminPassword = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);

        if (!adminPassword) {
          router.replace("/admin");
          return;
        }

        await getAdminArticles(adminPassword);

        setIsChecking(false);
      } catch (error) {
        localStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);

        if (error instanceof AdminArticleApiError) {
          if (error.status === 401) {
            setErrorMessage("Admin oturumu geçersiz. Tekrar giriş yapmalısın.");
          } else {
            setErrorMessage(error.message);
          }
        } else {
          setErrorMessage("Admin oturumu kontrol edilirken hata oluştu.");
        }

        setTimeout(() => {
          router.replace("/admin");
        }, 1200);
      }
    }

    void checkAdminSession();
  }, [router]);

  if (isChecking || errorMessage) {
    return (
      <main className="text-slate-100">
        <section className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-10">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Universe Zenith Stats
            </p>

            <h1 className="mt-2 text-3xl font-bold">Admin Kontrolü</h1>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              {errorMessage || "Admin oturumu kontrol ediliyor..."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}