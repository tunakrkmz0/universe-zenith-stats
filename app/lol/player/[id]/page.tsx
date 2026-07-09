"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getLolPlayerDetail,
  LolApiClientError,
} from "@/lib/lol-api-client";
import type { LolPlayerDetailResponse } from "@/types/lol-analysis";

function formatDate(value: string | Date | null): string {
  if (!value) {
    return "Henüz yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

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
            <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Oyuncu Detayı
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                {data.player.gameName}#{data.player.tagLine}
              </h1>

              <div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-3">
                <p>Region: {data.player.region.toUpperCase()}</p>
                <p>Son analiz: {formatDate(data.player.lastFetchedAt)}</p>
                <p>Kayıt tarihi: {formatDate(data.player.createdAt)}</p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <StatCard title="Maç" value={data.summary.matchCount} />
              <StatCard title="Winrate" value={`${data.summary.winRate}%`} />
              <StatCard title="KDA" value={data.summary.averageKda} />
              <StatCard
                title="CS/dk"
                value={data.summary.averageCsPerMinute}
              />
              <StatCard
                title="Vision"
                value={data.summary.averageVisionScore}
              />
              <StatCard
                title="Damage"
                value={data.summary.averageDamageDealt}
              />
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="mb-5 text-xl font-semibold">Kayıtlı Maçlar</h2>

              {data.matches.length === 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
                  Bu oyuncu için kayıtlı maç bulunamadı.
                </div>
              )}

              <div className="flex flex-col gap-3">
                {data.matches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            {match.championName}
                          </h3>

                          <span
                            className={
                              match.win
                                ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300"
                                : "rounded-full bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-300"
                            }
                          >
                            {match.win ? "Win" : "Lose"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {match.role ?? "UNKNOWN"} · Queue {match.queueId} ·{" "}
                          {formatDate(match.gameCreation)}
                        </p>
                      </div>

                      <div className="grid gap-4 text-sm md:grid-cols-6 lg:text-right">
                        <Metric label="KDA" value={`${match.kills}/${match.deaths}/${match.assists}`} />
                        <Metric label="KDA Oranı" value={match.kda} />
                        <Metric label="CS" value={match.totalCs} />
                        <Metric label="CS/dk" value={match.csPerMinute} />
                        <Metric label="Vision" value={match.visionScore} />
                        <Metric label="Gold" value={match.goldEarned} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function StatCard(props: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-500">{props.title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-100">{props.value}</p>
    </div>
  );
}

function Metric(props: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-slate-500">{props.label}</p>
      <p className="font-semibold text-slate-100">{props.value}</p>
    </div>
  );
}