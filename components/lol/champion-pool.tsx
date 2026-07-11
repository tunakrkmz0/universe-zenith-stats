import { ChampionIcon } from "@/components/lol/champion-icon";

type ChampionPoolProps = {
  matches: { championName: string; win: boolean }[];
};

type ChampionUsage = {
  championName: string;
  count: number;
  percentage: number;
  wins: number;
  losses: number;
};

function getChampionPool(
  matches: { championName: string; win: boolean }[]
): ChampionUsage[] {
  const stats = new Map<string, { count: number; wins: number }>();

  for (const match of matches) {
    const current = stats.get(match.championName) ?? { count: 0, wins: 0 };
    stats.set(match.championName, {
      count: current.count + 1,
      wins: current.wins + (match.win ? 1 : 0),
    });
  }

  return [...stats.entries()]
    .map(([championName, values]) => ({
      championName,
      count: values.count,
      percentage:
        matches.length === 0
          ? 0
          : Math.round((values.count / matches.length) * 100),
      wins: values.wins,
      losses: values.count - values.wins,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export function ChampionPool({ matches }: ChampionPoolProps) {
  const champions = getChampionPool(matches);
  const [primaryChampion] = champions;

  if (!primaryChampion) {
    return null;
  }

  return (
    <aside className="relative border-t border-[#806b3a]/50 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      <div className="mb-7">
        <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.26em] text-[#c8aa6e]">
          <span className="h-px w-8 bg-[#c89b3c]" />
          Şampiyon havuzu
        </p>
        <h3 className="mt-3 text-2xl font-black text-[#f0e6d2]">
          En Çok Seçilenler
        </h3>
      </div>

      <div className="divide-y divide-[#29465e]/55 border-y border-[#29465e]/55">
          {champions.map((champion, index) => {
            const isPrimary = index === 0;

            return (
            <div
              key={champion.championName}
              className={`grid items-center gap-3 ${
                isPrimary
                  ? "grid-cols-[2rem_4rem_minmax(0,1fr)] py-6"
                  : "grid-cols-[2rem_3rem_minmax(0,1fr)] py-4"
              }`}
            >
              <span
                className={`font-black ${
                  isPrimary ? "text-3xl text-[#c89b3c]" : "text-xl text-[#29465e]"
                }`}
              >
                0{index + 1}
              </span>
              <div
                className={`overflow-hidden rounded-full border bg-[#06101e] ${
                  isPrimary
                    ? "size-16 border-2 border-[#c89b3c] shadow-[0_0_24px_rgba(73,201,232,0.15)]"
                    : "size-12 border-[#806b3a]/70"
                }`}
              >
                <ChampionIcon championName={champion.championName} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`truncate font-black text-[#f0e6d2] ${
                      isPrimary ? "text-xl" : "text-base"
                    }`}
                  >
                    {champion.championName}
                  </p>
                  <span className={`font-bold text-[#7ee7f2] ${isPrimary ? "text-sm" : "text-xs"}`}>
                    %{champion.percentage}
                  </span>
                </div>
                <div className={`mt-2 overflow-hidden bg-[#163047] ${isPrimary ? "h-1.5" : "h-1"}`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#278ca9] to-[#7ee7f2]"
                    style={{ width: `${champion.percentage}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.65rem] font-bold uppercase tracking-wider">
                  <span className="text-[#9aabba]">{champion.count} maç</span>
                  <span className="text-[#526a7f]">·</span>
                  <span className="text-emerald-300">{champion.wins} G</span>
                  <span className="text-[#526a7f]">/</span>
                  <span className="text-rose-300">{champion.losses} M</span>
                </div>
              </div>
            </div>
            );
          })}
      </div>
    </aside>
  );
}
