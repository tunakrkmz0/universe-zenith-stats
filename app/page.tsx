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

import { saveAnalysisToLocalRecentPlayers } from "@/lib/local-recent-lol-players";
import { RecentPlayersPanel } from "@/components/lol/recent-players-panel";
import { MatchHistory } from "@/components/lol/match-history";
import { PlayerShowcase } from "@/components/lol/player-showcase";
import { RecommendationsPanel } from "@/components/lol/recommendations-panel";
import { ChampionPool } from "@/components/lol/champion-pool";

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
  const [recentRefreshKey, setRecentRefreshKey] = useState(0);

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
      saveAnalysisToLocalRecentPlayers(result);
      setRecentRefreshKey((value) => value + 1);
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
    <main className="text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <div className="relative isolate flex min-h-[34rem] flex-col overflow-hidden rounded-[2rem] border border-[#806b3a]/60 bg-[#07111f] shadow-[0_30px_100px_rgba(0,12,28,0.75)] sm:min-h-[37rem]">
          <div
            className="pointer-events-none absolute inset-0 -z-30 bg-cover bg-[68%_center] sm:bg-center"
            style={{
              backgroundImage: "url('/images/ashe-analysis-hero.jpg')",
            }}
          />
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,10,21,0.98)_0%,rgba(3,15,31,0.9)_38%,rgba(3,15,31,0.28)_68%,rgba(2,8,18,0.18)_100%)]" />
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(0deg,rgba(1,8,18,0.98)_0%,transparent_58%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent" />
          <div className="pointer-events-none absolute -left-24 top-24 -z-10 size-80 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex max-w-2xl flex-col gap-4 px-6 pb-8 pt-10 sm:px-10 sm:pt-14">
            <span className="flex w-fit items-center gap-2 border-l-2 border-[#c89b3c] pl-3 text-xs font-bold uppercase tracking-[0.28em] text-[#d8bd72]">
              <span className="size-1.5 rotate-45 bg-[#49c9e8] shadow-[0_0_10px_#49c9e8]" />
              Sihirdar analizi
            </span>

            <h1 className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#f0e6d2] drop-shadow-2xl sm:text-5xl">
              Efsaneni
              <span className="relative mt-1 block w-fit pb-3">
                <span className="bg-gradient-to-b from-white via-[#8defff] to-[#2f9fc2] bg-clip-text text-transparent [filter:drop-shadow(0_0_5px_rgba(126,231,242,0.65))_drop-shadow(0_4px_0_rgba(10,64,89,0.55))]">
                  rakamlarla gör
                </span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 left-[8%] h-3 w-2 bg-gradient-to-b from-[#8defff] to-transparent [clip-path:polygon(0_0,100%_0,50%_100%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-[29%] h-5 w-2.5 bg-gradient-to-b from-[#74dff2] to-transparent [clip-path:polygon(0_0,100%_0,50%_100%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[57%] h-4 w-2 bg-gradient-to-b from-[#8defff] to-transparent [clip-path:polygon(0_0,100%_0,50%_100%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 right-[9%] h-3 w-1.5 bg-gradient-to-b from-[#74dff2] to-transparent [clip-path:polygon(0_0,100%_0,50%_100%)]"
                />
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-6 text-[#b8c7d9] sm:text-base">
              Kullanıcı adını ve Riot ID etiketini gir; son maçlarını, KDA
              oranını ve performans önerilerini saniyeler içinde incele.
            </p>
          </div>

          <form
            className="relative mx-4 mb-7 mt-auto border border-[#806b3a]/70 bg-[#06101e]/90 p-4 shadow-[0_14px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:mx-8 sm:mb-10 sm:p-5"
            onSubmit={(event) => {
              event.preventDefault();
              void handleAnalyze();
            }}
          >
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_145px_190px] md:items-end xl:grid-cols-[minmax(0,1.35fr)_150px_120px_220px]">
              <div>
                <label
                  htmlFor="game-name"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#c8aa6e]"
                >
                  Kullanıcı adı / Riot ID
                </label>
                <div className="flex overflow-hidden border border-[#29465e] bg-[#030b14]/85 transition focus-within:border-[#49c9e8] focus-within:shadow-[0_0_20px_rgba(73,201,232,0.15)]">
                  <input
                    id="game-name"
                    value={gameName}
                    onChange={(event) => setGameName(event.target.value)}
                    placeholder="Oyuncu adı"
                    autoComplete="off"
                    required
                    className="min-w-0 flex-1 bg-transparent px-5 py-4 text-lg text-[#f0e6d2] outline-none placeholder:text-[#6b8299]"
                  />
                  <span className="grid place-items-center border-x border-[#29465e] px-3 font-bold text-[#c89b3c]">
                    #
                  </span>
                  <input
                    id="tag-line"
                    aria-label="Etiket"
                    value={tagLine}
                    onChange={(event) => setTagLine(event.target.value)}
                    placeholder="TR1"
                    autoComplete="off"
                    required
                    className="w-28 bg-transparent px-3 py-4 text-center text-lg uppercase text-[#f0e6d2] outline-none placeholder:text-[#6b8299]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#c8aa6e]"
                >
                  Sunucu
                </label>
                <select
                  id="region"
                  value={region}
                  onChange={(event) =>
                    setRegion(event.target.value as LolRegion)
                  }
                  className="w-full border border-[#29465e] bg-[#030b14] px-4 py-[1.125rem] text-[#f0e6d2] outline-none transition focus:border-[#49c9e8] focus:shadow-[0_0_20px_rgba(73,201,232,0.15)]"
                >
                  {regions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden pb-1 text-xs leading-5 text-[#8295a8] xl:block">
                Riot ID&apos;ni oyun içindeki profilinden bulabilirsin.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex min-h-14 items-center justify-center gap-3 overflow-hidden border border-[#f0d58a] bg-gradient-to-b from-[#27a8c7] via-[#14758f] to-[#0a4a61] px-8 py-4 text-base font-black uppercase tracking-[0.12em] text-white shadow-[inset_0_0_0_1px_rgba(5,24,38,0.8),0_0_30px_rgba(73,201,232,0.32),0_8px_24px_rgba(0,0,0,0.4)] transition duration-300 before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent hover:-translate-y-1 hover:brightness-125 hover:shadow-[inset_0_0_0_1px_rgba(5,24,38,0.8),0_0_42px_rgba(73,201,232,0.5),0_12px_30px_rgba(0,0,0,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoading && (
                  <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {isLoading ? "Analiz ediliyor" : "Analiz Et"}
                {!isLoading && (
                  <span aria-hidden="true" className="text-xl transition group-hover:translate-x-1.5">
                    →
                  </span>
                )}
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="relative mx-4 mb-4 border border-rose-400/40 bg-[#240c16] px-4 py-3 text-sm text-rose-100 shadow-xl sm:mx-8 sm:mb-8">
              {errorMessage}
            </div>
          )}
        </div>

        <RecentPlayersPanel refreshKey={recentRefreshKey} />

        {!data && !isLoading && (
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("game-name");
              input?.scrollIntoView({ behavior: "smooth", block: "center" });
              window.setTimeout(() => input?.focus(), 450);
            }}
            className="group relative w-full overflow-hidden rounded-2xl border border-[#29465e]/70 bg-gradient-to-r from-[#07111f] via-[#091827] to-[#07111f] px-5 py-6 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#49c9e8]/70 hover:shadow-[0_12px_35px_rgba(73,201,232,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#49c9e8] sm:px-7"
            aria-label="Kullanıcı adı alanına git"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-cyan-400/5 blur-3xl" />
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="grid size-12 shrink-0 rotate-45 place-items-center border border-[#806b3a] bg-[#0b2638] shadow-[inset_0_0_18px_rgba(73,201,232,0.12),0_0_20px_rgba(73,201,232,0.08)] transition group-hover:border-[#49c9e8] group-hover:shadow-[inset_0_0_18px_rgba(73,201,232,0.2),0_0_24px_rgba(73,201,232,0.18)]">
                <span className="-rotate-45 text-xl text-[#7ee7f2]" aria-hidden="true">
                  ◈
                </span>
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c8aa6e]">
                  Analiz bekleniyor
                </p>
                <h2 className="mt-1.5 text-lg font-bold text-[#f0e6d2]">
                  Bir sihirdar seç ve hikâyesini ortaya çıkar
                </h2>
                <p className="mt-1 text-sm text-[#8295a8]">
                  Yukarıdaki alana kullanıcı adı ve Riot ID etiketini girerek başla.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c8aa6e]">
                Aramaya git
                <span className="text-xl text-[#49c9e8] transition group-hover:-translate-y-1">
                  ↑
                </span>
              </div>
            </div>
          </button>
        )}

        {!data && isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#29465e]/70 bg-[#07111f] px-5 py-7 text-sm font-semibold text-[#b8c7d9]">
            <span className="size-5 animate-spin rounded-full border-2 border-[#29465e] border-t-[#49c9e8] shadow-[0_0_10px_rgba(73,201,232,0.3)]" />
            Sihirdar verileri hazırlanıyor...
          </div>
        )}

        {data && (
          <section className="flex flex-col gap-8">
            <PlayerShowcase
              player={data.player}
              summary={data.summary}
              matches={data.matches}
            />

            <div className="flex flex-col gap-14">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
                <MatchHistory matches={data.matches} />
                <ChampionPool matches={data.matches} />
              </div>

              <RecommendationsPanel recommendations={data.recommendations} />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

