import Link from "next/link";

type LegalSection = {
  title: string;
  content: React.ReactNode;
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
  variant: "privacy" | "terms";
};

const variants = {
  privacy: {
    accent: "text-cyan-200",
    line: "bg-cyan-300",
    glow: "bg-cyan-400/10",
    gradient:
      "bg-[radial-gradient(circle_at_78%_18%,rgba(34,211,238,0.13),transparent_28%),radial-gradient(circle_at_12%_45%,rgba(126,34,206,0.12),transparent_32%)]",
  },
  terms: {
    accent: "text-[#e2c36f]",
    line: "bg-[#c89b3c]",
    glow: "bg-[#c89b3c]/10",
    gradient:
      "bg-[radial-gradient(circle_at_82%_20%,rgba(200,155,60,0.14),transparent_28%),radial-gradient(circle_at_15%_52%,rgba(8,145,178,0.1),transparent_32%)]",
  },
};

function createSectionId(index: number) {
  return `bolum-${index + 1}`;
}

export function LegalDocument({
  eyebrow,
  title,
  description,
  sections,
  variant,
}: LegalDocumentProps) {
  const theme = variants[variant];

  return (
    <main className={`relative isolate min-h-screen overflow-hidden text-slate-100 ${theme.gradient}`}>
      <div className="pointer-events-none absolute left-1/2 top-28 -z-10 size-[38rem] -translate-x-1/2 rounded-full border border-[#806b3a]/10" />

      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <header className="relative overflow-hidden border-b border-[#806b3a]/45 pb-12 pt-4">
          <div className={`pointer-events-none absolute -right-20 -top-24 size-72 rounded-full blur-3xl ${theme.glow}`} />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-end">
            <div>
              <p className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.32em] ${theme.accent}`}>
                <span className={`h-px w-10 ${theme.line}`} />
                {eyebrow}
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-[#f0e6d2] sm:text-7xl">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#8295a8]">
                {description}
              </p>
            </div>

            <div className="hidden text-right lg:block">
              <p className={`text-6xl font-black leading-none ${theme.accent}`}>
                {String(sections.length).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#526a7f]">
                belge bölümü
              </p>
            </div>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c8aa6e]">
                Bu belgede
              </p>
              <nav aria-label={`${title} bölümleri`} className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                {sections.map((section, index) => (
                  <Link
                    key={section.title}
                    href={`#${createSectionId(index)}`}
                    className="group flex shrink-0 items-center gap-3 border border-[#29465e]/70 px-3 py-2.5 text-sm text-[#8295a8] transition hover:border-[#806b3a] hover:text-[#f0e6d2] lg:border-0 lg:border-l lg:px-4"
                  >
                    <span className={`text-xs font-black ${theme.accent}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <article className="divide-y divide-[#29465e]/60 border-y border-[#29465e]/60">
            {sections.map((section, index) => (
              <section
                key={section.title}
                id={createSectionId(index)}
                className="grid scroll-mt-28 gap-5 py-10 sm:grid-cols-[4rem_minmax(0,1fr)] sm:py-12"
              >
                <span className="text-4xl font-black leading-none text-[#29465e]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-2xl font-black text-[#f0e6d2] sm:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 flex flex-col gap-4 text-base leading-8 text-[#9aabba]">
                    {section.content}
                  </div>
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
