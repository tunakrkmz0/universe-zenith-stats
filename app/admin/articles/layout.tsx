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
      <main className="relative isolate overflow-hidden text-slate-100">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.12),transparent_35%)]" />
        <section className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-10">
          <div className="relative border border-[#29465e]/60 bg-[#06101e]/85 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <span className="absolute -left-px -top-px size-8 border-l border-t border-[#c89b3c]" />
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c8aa6e]">
              Güvenlik protokolü
            </p>
            <h1 className="mt-3 text-3xl font-black text-[#f0e6d2]">Erişim Kontrolü</h1>
            {!errorMessage && <span className="mt-6 block size-5 animate-spin rounded-full border-2 border-[#29465e] border-t-[#49c9e8]" />}
            <p className={`mt-4 text-sm leading-6 ${errorMessage ? "text-rose-200" : "text-[#8295a8]"}`}>
              {errorMessage || "Admin oturumu kontrol ediliyor..."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
