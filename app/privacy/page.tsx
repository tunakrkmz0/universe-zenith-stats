export default function PrivacyPage() {
  return (
    <main className="text-slate-100">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Universe Zenith Stats
          </p>

          <h1 className="mt-2 text-4xl font-bold">Gizlilik Politikası</h1>

          <p className="mt-4 text-slate-400">
            Bu sayfa, Universe Zenith Stats platformunda hangi verilerin
            işlendiğini ve bu verilerin hangi amaçlarla kullanıldığını açıklar.
          </p>
        </div>

        <ContentSection title="1. Toplanan Veriler">
          <p>
            Universe Zenith Stats, League of Legends oyuncu analizi yapmak için
            kullanıcı tarafından girilen Riot ID bilgilerini işler. Bu bilgiler
            game name, tag line ve bölge bilgisinden oluşur.
          </p>

          <p>
            Platform, analiz sonucunda oyuncuya ait maç istatistiklerini,
            performans metriklerini ve geçmiş analiz kayıtlarını veritabanında
            saklayabilir.
          </p>
        </ContentSection>

        <ContentSection title="2. Verilerin Kullanım Amacı">
          <p>
            Toplanan veriler oyuncu performansını analiz etmek, geçmiş analizleri
            listelemek ve kullanıcıya daha anlamlı istatistikler sunmak için
            kullanılır.
          </p>
        </ContentSection>

        <ContentSection title="3. Riot Games ile İlişki">
          <p>
            Universe Zenith Stats, Riot Games tarafından desteklenmez ve Riot
            Games’in resmi ürünü değildir. Riot Games ve ilişkili tüm markalar
            Riot Games, Inc.’e aittir.
          </p>
        </ContentSection>

        <ContentSection title="4. Çerezler ve Analitik">
          <p>
            Platform ileride ziyaretçi trafiğini analiz etmek, performansı
            ölçmek veya reklam gösterimi sağlamak için çerezler ve üçüncü taraf
            servisler kullanabilir.
          </p>
        </ContentSection>

        <ContentSection title="5. İletişim">
          <p>
            Gizlilik politikasıyla ilgili sorular için Universe Zenith ekibiyle
            iletişime geçilebilir.
          </p>
        </ContentSection>
      </section>
    </main>
  );
}

function ContentSection(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <h2 className="text-2xl font-semibold">{props.title}</h2>

      <div className="mt-4 flex flex-col gap-4 leading-7 text-slate-400">
        {props.children}
      </div>
    </section>
  );
}