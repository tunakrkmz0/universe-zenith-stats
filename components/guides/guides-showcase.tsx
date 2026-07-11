import Link from "next/link";

export type GuideShowcaseArticle = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
};

type GuidesShowcaseProps = {
  articles: GuideShowcaseArticle[];
};

const categoryThemes: Record<
  string,
  { label: string; text: string; ring: string; glow: string }
> = {
  champion: {
    label: "Şampiyon",
    text: "text-fuchsia-200",
    ring: "border-fuchsia-400/70",
    glow: "shadow-[0_0_55px_rgba(217,70,239,0.2)]",
  },
  item: {
    label: "Eşya",
    text: "text-amber-200",
    ring: "border-amber-400/70",
    glow: "shadow-[0_0_55px_rgba(251,191,36,0.18)]",
  },
  guide: {
    label: "Rehber",
    text: "text-cyan-200",
    ring: "border-cyan-400/70",
    glow: "shadow-[0_0_55px_rgba(34,211,238,0.18)]",
  },
  patch: {
    label: "Yama",
    text: "text-violet-200",
    ring: "border-violet-400/70",
    glow: "shadow-[0_0_55px_rgba(139,92,246,0.2)]",
  },
  news: {
    label: "Haber",
    text: "text-emerald-200",
    ring: "border-emerald-400/70",
    glow: "shadow-[0_0_55px_rgba(52,211,153,0.18)]",
  },
};

function getTheme(category: string) {
  return categoryThemes[category] ?? categoryThemes.guide;
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Yayın tarihi yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
  }).format(value);
}

function getArticleImageUrl(article: GuideShowcaseArticle) {
  if (article.coverImageUrl) {
    return article.coverImageUrl;
  }

  if (article.category === "champion") {
    const championName = article.title.trim().split(/\s+/)[0];

    if (championName) {
      return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${encodeURIComponent(championName)}_0.jpg`;
    }
  }

  return null;
}

export function GuidesShowcase({ articles }: GuidesShowcaseProps) {
  const [featuredArticle, ...remainingArticles] = articles;
  const featuredImageUrl = featuredArticle
    ? getArticleImageUrl(featuredArticle)
    : null;

  return (
    <main className="relative isolate min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_12%,rgba(88,28,135,0.22),transparent_28%),radial-gradient(circle_at_88%_25%,rgba(8,145,178,0.16),transparent_30%),radial-gradient(circle_at_50%_75%,rgba(190,121,35,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-40 -z-10 size-[42rem] -translate-x-1/2 rounded-full border border-[#806b3a]/10" />

      <section className="mx-auto flex w-full max-w-6xl flex-col px-6 py-14">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-[#c8aa6e]">
            Universe Zenith Arşivi
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-[#f0e6d2] sm:text-7xl lg:text-8xl">
            Bilginin
            <span className="block bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-amber-200 bg-clip-text text-transparent">
              Sihirdar Haritası
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#8295a8]">
            Şampiyonlar, metalar ve oyun bilgisi arasında kendi rotanı çiz.
            Her rehber, Vadi&apos;yi daha iyi okumak için yeni bir durak.
          </p>
        </header>

        {articles.length === 0 && (
          <div className="mx-auto mt-20 text-center">
            <div className="mx-auto size-20 rounded-full border border-dashed border-[#806b3a]" />
            <p className="mt-6 text-[#8295a8]">Henüz yayınlanmış rehber bulunmuyor.</p>
          </div>
        )}

        {featuredArticle && (
          <div className="mt-20 grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)]">
            <div className="relative mx-auto grid size-72 place-items-center sm:size-96 lg:size-[28rem]">
              <div className="absolute inset-0 animate-[spin_45s_linear_infinite] rounded-full border border-dashed border-[#c89b3c]/45" />
              <div className="absolute inset-5 rounded-full border border-cyan-300/20" />
              <div className="absolute -left-2 top-1/2 size-3 -translate-y-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_18px_#e879f9]" />
              <div className="absolute -right-1 top-1/3 size-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#67e8f9]" />

              <div className="relative size-[78%] overflow-hidden rounded-full border-2 border-[#c89b3c]/70 bg-[#07111f] shadow-[0_0_80px_rgba(34,211,238,0.14)]">
                {featuredImageUrl ? (
                  <img
                    src={featuredImageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <img
                    src="/images/universe-zenith-logo.jpeg"
                    alt=""
                    className="size-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
                İlk durağın · Öne çıkan
              </p>
              <h2 className="mt-5 text-4xl font-black leading-tight text-[#f0e6d2] sm:text-6xl">
                {featuredArticle.title}
              </h2>
              {featuredArticle.excerpt && (
                <p className="mt-6 text-base leading-8 text-[#9aabba]">
                  {featuredArticle.excerpt}
                </p>
              )}
              <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs lg:justify-start">
                <span className="font-black uppercase tracking-wider text-[#c8aa6e]">
                  {getTheme(featuredArticle.category).label}
                </span>
                <span className="text-[#526a7f]">·</span>
                <span className="text-[#8295a8]">
                  {formatDate(featuredArticle.publishedAt)}
                </span>
              </div>
              <Link
                href={`/guides/${featuredArticle.slug}`}
                className="group/cta mt-8 inline-flex items-center gap-3 border-b border-[#49c9e8]/60 pb-2 text-sm font-black uppercase tracking-wider text-[#7ee7f2] transition hover:border-[#e2c36f] hover:text-[#f0e6d2]"
              >
                Rehberi İncele
                <span className="text-lg transition group-hover/cta:translate-x-2">→</span>
              </Link>
            </div>
          </div>
        )}

        {remainingArticles.length > 0 && (
          <section className="relative mt-28">
            <div className="absolute bottom-0 left-1/2 top-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-fuchsia-400/40 via-cyan-300/30 to-transparent md:block" />
            <header className="relative z-10 text-center">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#c8aa6e]">
                Keşif rotası
              </p>
              <h2 className="mt-3 text-4xl font-black text-[#f0e6d2]">
                Arşiv Durakları
              </h2>
            </header>

            <div className="mt-16 flex flex-col gap-20 md:gap-28">
              {remainingArticles.map((article, index) => {
                const theme = getTheme(article.category);
                const imageOnRight = index % 2 === 1;
                const articleImageUrl = getArticleImageUrl(article);

                return (
                  <Link
                    key={article.id}
                    href={`/guides/${article.slug}`}
                    className="group relative grid items-center gap-8 md:grid-cols-2 md:gap-20"
                  >
                    <span className="absolute left-1/2 top-1/2 z-10 hidden size-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#c89b3c] bg-[#07111f] md:block" />

                    <div className={`${imageOnRight ? "md:order-2" : ""} flex justify-center`}>
                      <div className={`relative size-56 rounded-full border p-2 transition duration-500 group-hover:scale-105 sm:size-64 ${theme.ring} ${theme.glow}`}>
                        <div className="size-full overflow-hidden rounded-full bg-[#07111f]">
                          {articleImageUrl ? (
                            <img
                              src={articleImageUrl}
                              alt=""
                              className="size-full object-cover transition duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <img
                              src="/images/universe-zenith-logo.jpeg"
                              alt=""
                              className="size-full object-cover transition duration-700 group-hover:scale-110"
                            />
                          )}
                        </div>
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#020713] px-4 py-1 text-2xl font-black text-[#29465e]">
                          {String(index + 2).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className={`${imageOnRight ? "md:order-1 md:text-right" : ""} text-center md:text-left`}>
                      <p className={`text-xs font-black uppercase tracking-[0.25em] ${theme.text}`}>
                        {theme.label} · {formatDate(article.publishedAt)}
                      </p>
                      <h3 className="mt-4 text-3xl font-black leading-tight text-[#f0e6d2] transition group-hover:text-white sm:text-4xl">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#8295a8]">
                          {article.excerpt}
                        </p>
                      )}
                      <p className={`mt-6 text-xs font-black uppercase tracking-wider ${theme.text}`}>
                        Rehbere ilerle →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
