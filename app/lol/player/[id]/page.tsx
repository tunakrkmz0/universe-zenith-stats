"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getLolPlayerDetail,
  LolApiClientError,
} from "@/lib/lol-api-client";
import type { LolPlayerDetailResponse } from "@/types/lol-analysis";
import { MatchHistory } from "@/components/lol/match-history";
import { PlayerShowcase } from "@/components/lol/player-showcase";
import { ChampionPool } from "@/components/lol/champion-pool";

export default function LolPlayerDetailPage() {
  const params = useParams<{ id: string }>();

  const [data, setData] = useState<LolPlayerDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPlayerDetail() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const playerId = Number(params.id);

        if (!Number.isInteger(playerId) || playerId <= 0) {
          setErrorMessage("Geçersiz oyuncu ID değeri.");
          return;
        }

        const response = await getLolPlayerDetail(playerId);
        setData(response);
      } catch (error) {
        if (error instanceof LolApiClientError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Oyuncu detayları alınamadı.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadPlayerDetail();
  }, [params.id]);

  return (
    <main className="text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            ← Ana sayfaya dön
          </Link>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">
            Oyuncu detayları yükleniyor...
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200">
            {errorMessage}
          </div>
        )}

        {data && !isLoading && (
          <>
            <PlayerShowcase
              player={data.player}
              summary={data.summary}
              matches={data.matches}
              lastAnalyzedAt={data.player.lastFetchedAt}
            />

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
              <MatchHistory matches={data.matches} title="Kayıtlı Maçlar" />
              <ChampionPool matches={data.matches} />
            </div>
          </>
        )}
      </section>
    </main>
  );
}

