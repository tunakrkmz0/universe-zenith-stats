"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { getLocalRecentLolPlayers } from "@/lib/local-recent-lol-players";
import type { LolRecentPlayer } from "@/types/lol-analysis";

import { ProfileIcon } from "@/components/lol/profile-icon";

type RecentPlayersPanelProps = {
  refreshKey?: number;
};

function formatDate(value: string | Date | null): string {
  if (!value) {
    return "Henüz yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function RecentPlayersPanel({
  refreshKey = 0,
}: RecentPlayersPanelProps) {
  const [players, setPlayers] = useState<LolRecentPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRecentPlayers = useCallback(function loadRecentPlayers() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const localPlayers = getLocalRecentLolPlayers();
      setPlayers(localPlayers);
    } catch {
      setErrorMessage("Son aramalar okunamadı.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadRecentPlayers();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [loadRecentPlayers, refreshKey]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#806b3a]/45 bg-[#07111f] shadow-[0_24px_70px_rgba(0,12,28,0.45)]">
      <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-cyan-400/5 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent" />

      <div className="relative flex items-center justify-between gap-4 border-b border-[#29465e]/60 px-5 py-5 sm:px-7 sm:py-6">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#c8aa6e]">
            <span className="size-1.5 rotate-45 bg-[#49c9e8] shadow-[0_0_8px_#49c9e8]" />
            Kişisel geçmiş
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#f0e6d2] sm:text-2xl">
            Son Aramalarım
          </h2>
        </div>

        <button
          type="button"
          onClick={loadRecentPlayers}
          disabled={isLoading}
          aria-label="Oyuncu listesini yenile"
          className="group flex items-center gap-2 border border-[#806b3a]/70 bg-[#0a1828]/80 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#c8aa6e] transition hover:border-[#49c9e8] hover:text-[#7ee7f2] hover:shadow-[0_0_20px_rgba(73,201,232,0.12)] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
        >
          <span
            aria-hidden="true"
            className={`text-lg leading-none ${
              isLoading
                ? "animate-spin"
                : "transition-transform duration-500 group-hover:rotate-180"
            }`}
          >
            ↻
          </span>

          <span className="hidden sm:inline">
            {isLoading ? "Yükleniyor" : "Yenile"}
          </span>
        </button>
      </div>

      {errorMessage && (
        <div className="m-5 border border-rose-400/40 bg-[#240c16] px-4 py-3 text-sm text-rose-100 sm:mx-7">
          {errorMessage}
        </div>
      )}

      {!isLoading && players.length === 0 && !errorMessage && (
        <div className="m-5 border border-dashed border-[#29465e] bg-[#030b14]/60 px-5 py-8 text-center text-sm text-[#8295a8] sm:mx-7">
          Bu tarayıcıda henüz kayıtlı arama yok. İlk sihirdarını yukarıdan
          analiz et.
        </div>
      )}

      <div className="divide-y divide-[#29465e]/55">
        {players.map((player) => (
          <Link
            key={`${player.region}-${player.gameName}-${player.tagLine}-${player.id}`}
            href={`/lol/player/${player.id}`}
            className="group relative block px-5 py-4 transition hover:bg-gradient-to-r hover:from-[#0b2638]/80 hover:to-transparent sm:px-7"
          >
            <span className="absolute inset-y-0 left-0 w-0.5 origin-center scale-y-0 bg-[#49c9e8] shadow-[0_0_12px_#49c9e8] transition-transform group-hover:scale-y-100" />

            <div className="flex items-center gap-4">
              <div className="size-12 shrink-0 overflow-hidden rounded-full border border-[#806b3a] bg-[#06101e] p-0.5 shadow-[inset_0_0_12px_rgba(73,201,232,0.08)] transition group-hover:border-[#49c9e8] group-hover:shadow-[0_0_18px_rgba(73,201,232,0.2)]">
                <ProfileIcon
                  profileIconId={player.profileIconId}
                  gameName={player.gameName}
                  sizes="48px"
                  className="rounded-full"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[#f0e6d2] transition group-hover:text-white">
                  {player.gameName}#{player.tagLine}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="border border-[#806b3a]/60 bg-[#c89b3c]/10 px-2 py-0.5 font-bold uppercase tracking-wider text-[#c8aa6e]">
                    {player.region.toUpperCase()}
                  </span>

                  <span className="text-[#8295a8]">
                    {player.analyzedMatchCount} maç incelendi
                  </span>
                </div>
              </div>

              <div className="hidden shrink-0 text-right text-xs text-[#6f8498] sm:block">
                <p className="uppercase tracking-wider">Son arama</p>

                <p className="mt-1 font-semibold text-[#b8c7d9]">
                  {formatDate(player.lastFetchedAt)}
                </p>
              </div>

              <span className="text-xl text-[#806b3a] transition group-hover:translate-x-1 group-hover:text-[#49c9e8]">
                ›
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}