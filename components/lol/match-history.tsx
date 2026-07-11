import { ChampionIcon } from "@/components/lol/champion-icon";

export type MatchHistoryItem = {
  matchId: string;
  championName: string;
  role: string | null;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  totalCs: number;
  csPerMinute: number;
  visionScore: number;
  damageDealt: number;
  goldEarned: number;
  gameCreation: string | Date;
  gameDurationSeconds: number;
  queueId: number;
};

type MatchHistoryProps = {
  matches: MatchHistoryItem[];
  title?: string;
};

const queueNames: Record<number, string> = {
  400: "Normal",
  420: "Dereceli Solo/Duo",
  430: "Normal",
  440: "Dereceli Esnek",
  450: "ARAM",
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatMatchDate(value: string | Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR");
}

export function MatchHistory({
  matches,
  title = "Son Maçlar",
}: MatchHistoryProps) {
  return (
    <section className="relative">
      <header className="mb-6 flex items-end justify-between gap-5">
        <div>
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[#c8aa6e]">
            <span className="h-px w-10 bg-[#c89b3c]" />
            Savaş günlüğü
          </p>
          <h3 className="mt-3 text-3xl font-black text-[#f0e6d2] sm:text-4xl">
            {title}
          </h3>
        </div>
        <p className="text-right text-sm text-[#6f8498]">
          <span className="block text-3xl font-black text-[#7ee7f2]">
            {matches.length}
          </span>
          karşılaşma
        </p>
      </header>

      {matches.length === 0 && (
        <div className="px-6 py-10 text-center text-sm text-[#8295a8]">
          Bu oyuncu için görüntülenecek maç bulunamadı.
        </div>
      )}

      <div className="divide-y divide-[#29465e]/45 border-y border-[#806b3a]/45">
        {matches.map((match, index) => (
          <article
            key={match.matchId}
            className={`group/match relative grid gap-4 overflow-hidden px-3 py-6 transition duration-300 sm:grid-cols-[4px_64px_minmax(125px,0.8fr)_minmax(135px,0.7fr)_minmax(220px,1.3fr)] sm:items-center sm:gap-6 sm:px-4 ${
              match.win
                ? "hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-transparent"
                : "hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-transparent"
            }`}
          >
            <div
              className={`absolute inset-y-0 left-0 w-1 sm:static sm:h-16 sm:w-1 ${
                match.win
                  ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.55)]"
                  : "bg-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.5)]"
              }`}
            />

            <div className="relative size-16 overflow-hidden rounded-full border border-[#806b3a] bg-[#07111f] p-0.5 shadow-[0_0_22px_rgba(0,0,0,0.35)]">
              <div className="size-full overflow-hidden rounded-full">
                <ChampionIcon championName={match.championName} />
              </div>
              <span className="absolute -bottom-px -right-px grid size-5 place-items-center rounded-full border border-[#806b3a] bg-[#06101e] text-[0.6rem] font-black text-[#c8aa6e]">
                {index + 1}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-lg font-black text-[#f0e6d2]">
                  {match.championName}
                </h4>
                <span
                  className={`text-[0.65rem] font-black uppercase tracking-wider ${
                    match.win ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {match.win ? "Zafer" : "Bozgun"}
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-[#6f8498]">
                {match.role ?? "Bilinmeyen rol"} · {queueNames[match.queueId] ?? `Queue ${match.queueId}`}
              </p>
              <p className="mt-1 text-xs text-[#526a7f]">
                {formatMatchDate(match.gameCreation)} · {formatDuration(match.gameDurationSeconds)}
              </p>
            </div>

            <div>
              <p className="text-2xl font-black tracking-tight text-[#f0e6d2]">
                <span className="text-emerald-300">{match.kills}</span>
                <span className="mx-1 text-[#526a7f]">/</span>
                <span className="text-rose-300">{match.deaths}</span>
                <span className="mx-1 text-[#526a7f]">/</span>
                <span className="text-[#7ee7f2]">{match.assists}</span>
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#c8aa6e]">
                {match.kda} KDA
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:grid-cols-4">
              <MatchMetric label="CS / dk" value={match.csPerMinute} />
              <MatchMetric label="Vision" value={match.visionScore} />
              <MatchMetric label="Hasar" value={formatNumber(match.damageDealt)} />
              <MatchMetric label="Altın" value={formatNumber(match.goldEarned)} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MatchMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#526a7f]">
        {label}
      </p>
      <p className="mt-1 font-bold text-[#b8c7d9]">{value}</p>
    </div>
  );
}
