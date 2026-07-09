"use client";

import { useState } from "react";

import {
  analyzeLolPlayer,
  LolApiClientError,
} from "@/lib/lol-api-client";
import type {
  LolAnalysisResponse,
  LolAnalysisRequest,
  LolRegion,
} from "@/types/lol-analysis";

const regions: { label: string; value: LolRegion }[] = [
  { label: "Türkiye", value: "tr1" },
  { label: "EU West", value: "euw1" },
  { label: "EU Nordic & East", value: "eun1" },
  { label: "North America", value: "na1" },
  { label: "Korea", value: "kr" },
];

export default function HomePage() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState<LolRegion>("tr1");

  const [data, setData] = useState<LolAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    setErrorMessage("");
    setData(null);
    setIsLoading(true);

    try {
      const request: LolAnalysisRequest = {
        gameName,
        tagLine,
        region,
      };

      const result = await analyzeLolPlayer(request);
      setData(result);
    } catch (error) {
      if (error instanceof LolApiClientError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Universe Zenith Stats
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              League of Legends Oyuncu Analizi
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400">
              Riot ID gir, son maç performansını analiz et. KDA, CS/dk,
              vision score, damage, gold ve winrate değerlerini tek ekranda gör.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_180px_160px]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Game Name
              </label>
              <input
                value={gameName}
                onChange={(event) => setGameName(event.target.value)}
                placeholder="Örn: Tunahan"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Tag Line
              </label>
              <input
                value={tagLine}
                onChange={(event) => setTagLine(event.target.value)}
                placeholder="Örn: TR1"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Region
              </label>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value as LolRegion)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              >
                {regions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Analiz ediliyor..." : "Analiz Et"}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}
        </div>

        {!data && !isLoading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 text-slate-400">
            Henüz analiz yapılmadı. Bir Riot ID girip analizi başlat.
          </div>
        )}

        {data && (
          <section className="flex flex-col gap-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Oyuncu
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {data.player.gameName}#{data.player.tagLine}
              </h2>

              <p className="mt-1 text-slate-400">
                Region: {data.player.region.toUpperCase()}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
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
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="mb-5 text-xl font-semibold">Son Maçlar</h3>

                <div className="flex flex-col gap-3">
                  {data.matches.map((match) => (
                    <div
                      key={match.matchId}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-semibold">
                              {match.championName}
                            </h4>

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

                          <p className="mt-1 text-sm text-slate-400">
                            {match.role ?? "UNKNOWN"} · Queue {match.queueId}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm md:text-right">
                          <div>
                            <p className="text-slate-500">KDA</p>
                            <p className="font-semibold text-slate-100">
                              {match.kills}/{match.deaths}/{match.assists}
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-500">CS/dk</p>
                            <p className="font-semibold text-slate-100">
                              {match.csPerMinute}
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-500">Vision</p>
                            <p className="font-semibold text-slate-100">
                              {match.visionScore}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="mb-5 text-xl font-semibold">Öneriler</h3>

                <div className="flex flex-col gap-3">
                  {data.recommendations.map((recommendation) => (
                    <div
                      key={recommendation.title}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <p className="font-semibold text-cyan-300">
                        {recommendation.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {recommendation.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
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