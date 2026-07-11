import type { LolAnalysisRecommendation } from "@/types/lol-analysis";

type RecommendationsPanelProps = {
  recommendations: LolAnalysisRecommendation[];
};

const recommendationStyles: Record<
  LolAnalysisRecommendation["type"],
  { label: string; symbol: string; color: string; glow: string }
> = {
  success: {
    label: "Güçlü yön",
    symbol: "✓",
    color: "text-emerald-300 border-emerald-400 bg-emerald-400/10",
    glow: "shadow-[0_0_18px_rgba(52,211,153,0.2)]",
  },
  warning: {
    label: "Gelişim alanı",
    symbol: "!",
    color: "text-amber-200 border-amber-400 bg-amber-400/10",
    glow: "shadow-[0_0_18px_rgba(251,191,36,0.18)]",
  },
  danger: {
    label: "Kritik nokta",
    symbol: "×",
    color: "text-rose-300 border-rose-400 bg-rose-400/10",
    glow: "shadow-[0_0_18px_rgba(251,113,133,0.18)]",
  },
  info: {
    label: "Analiz notu",
    symbol: "i",
    color: "text-cyan-200 border-cyan-400 bg-cyan-400/10",
    glow: "shadow-[0_0_18px_rgba(34,211,238,0.18)]",
  },
};

export function RecommendationsPanel({
  recommendations,
}: RecommendationsPanelProps) {
  return (
    <aside className="relative border-t border-[#806b3a]/45 pt-8">
      <header className="relative mb-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.28em] text-[#c8aa6e]">
              <span className="h-px w-10 bg-[#c89b3c]" />
              Kişisel değerlendirme
            </p>
            <h3 className="mt-3 text-3xl font-black text-[#f0e6d2] sm:text-4xl">
              Koç Notları
            </h3>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black leading-none text-[#7ee7f2]">
              {recommendations.length}
            </p>
            <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#6f8498]">
              bulgu
            </p>
          </div>
        </div>
      </header>

      <div className="relative">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((recommendation, index) => {
            const style = recommendationStyles[recommendation.type];

            return (
              <article
                key={`${recommendation.title}-${index}`}
                className="group relative border-t border-[#29465e]/70 pt-6"
              >
                <div className="flex items-start gap-5">
                  <span className="text-5xl font-black leading-none text-[#29465e] transition group-hover:text-[#49c9e8]/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 pt-1">
                  <p className={`text-[0.65rem] font-black uppercase tracking-[0.18em] ${style.color.split(" ")[0]}`}>
                    {style.label}
                  </p>
                  <h4 className="mt-2 text-lg font-black text-[#f0e6d2] transition group-hover:text-white">
                    {recommendation.title}
                  </h4>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#8295a8]">
                    {recommendation.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
