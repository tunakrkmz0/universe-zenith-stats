import { ProfileIcon } from "@/components/lol/profile-icon";
import {
  getChampionSplashUrl,
  getMostPlayedChampion,
} from "@/lib/lol-assets";
import type { LolAnalysisSummary } from "@/types/lol-analysis";

type PlayerShowcaseProps = {
  player: {
    gameName: string;
    tagLine: string;
    region: string;
    profileIconId?: number | null;
  };
  summary: LolAnalysisSummary;
  matches: { championName: string }[];
  lastAnalyzedAt?: string | Date | null;
};

function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PlayerShowcase({
  player,
  summary,
  matches,
  lastAnalyzedAt,
}: PlayerShowcaseProps) {
  const featuredChampion = getMostPlayedChampion(matches);
  const formattedDate = formatDate(lastAnalyzedAt);

  return (
    <section className="relative isolate min-h-[36rem] overflow-hidden rounded-[2.25rem] border border-[#806b3a]/65 bg-[#050c16] shadow-[0_35px_100px_rgba(0,8,20,0.7)]">
      {featuredChampion && (
        <div
          className="pointer-events-none absolute inset-0 -z-30 bg-cover bg-center"
          style={{
            backgroundImage: `url('${getChampionSplashUrl(featuredChampion)}')`,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-r from-[#020812]/82 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-t from-[#020812] via-[#020812]/10 to-[#020812]/25" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e2c36f] to-transparent" />

      <div className="flex min-h-[36rem] flex-col p-6 sm:p-8 lg:p-10">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3 pt-1">
            <span className="h-px w-10 bg-[#c89b3c]" />
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e2c36f]">
              {featuredChampion ?? "Sihirdar"} vitrini
            </p>
          </div>

          <div
            className="grid size-28 shrink-0 place-items-center rounded-full p-[5px] shadow-[0_0_38px_rgba(73,201,232,0.28)] sm:size-32"
            style={{
              background: `conic-gradient(#58d9f0 ${summary.winRate * 3.6}deg, rgba(18,43,61,0.8) 0deg)`,
            }}
          >
            <div className="grid size-full place-items-center rounded-full border border-[#e2c36f]/65 bg-[#020812]/90 text-center backdrop-blur-md">
              <div>
                <p className="text-3xl font-black leading-none text-[#f0e6d2] sm:text-4xl">
                  {summary.winRate}%
                </p>
                <p className="mt-1.5 text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#7ee7f2]">
                  Winrate
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="max-w-4xl">
            <div className="mb-7 flex items-end gap-5">
              <div className="size-24 shrink-0 overflow-hidden rounded-full border-2 border-[#e2c36f] bg-[#06101e] p-1.5 shadow-[0_0_32px_rgba(73,201,232,0.25)] sm:size-28">
                <ProfileIcon
                  profileIconId={player.profileIconId}
                  gameName={player.gameName}
                  sizes="112px"
                  className="rounded-full"
                />
              </div>

              <div className="min-w-0 pb-1">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-[#7ee7f2]">
                  Sihirdar profili
                </p>
                <h1 className="truncate text-3xl font-black tracking-tight text-[#f0e6d2] drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl">
                  {player.gameName}
                  <span className="text-[#9aabba]">#{player.tagLine}</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-[#c89b3c] bg-[#07111f]/80 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#e2c36f] backdrop-blur-md">
                {player.region.toUpperCase()}
              </span>
              <span className="text-sm text-[#b8c7d9]">
                Son {summary.matchCount} maçın performansı
              </span>
              {formattedDate && (
                <span className="text-xs text-[#8295a8]">
                  · Son analiz {formattedDate}
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 border-y border-[#806b3a]/55 bg-[#020812]/25 backdrop-blur-[2px] sm:grid-cols-3 lg:grid-cols-6">
            <ShowcaseMetric label="Maç" value={summary.matchCount} />
            <ShowcaseMetric label="KDA" value={summary.averageKda} />
            <ShowcaseMetric label="CS / dk" value={summary.averageCsPerMinute} />
            <ShowcaseMetric label="Vision" value={summary.averageVisionScore} />
            <ShowcaseMetric
              label="Hasar"
              value={summary.averageDamageDealt.toLocaleString("tr-TR")}
            />
            <ShowcaseMetric
              label="Altın"
              value={summary.averageGoldEarned.toLocaleString("tr-TR")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="group flex flex-col justify-center border-r border-[#806b3a]/35 px-4 py-4 transition hover:bg-cyan-300/[0.07] sm:py-5">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#e2c36f] [font-family:Georgia,'Times_New_Roman',serif]">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-black text-[#f0e6d2] transition group-hover:text-white">
        {value}
      </p>
    </div>
  );
}
