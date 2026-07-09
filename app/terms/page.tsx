export default function TermsPage() {
  return (
    <main className="text-slate-100">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Universe Zenith Stats
          </p>

          <h1 className="mt-2 text-4xl font-bold">Kullanım Şartları</h1>

          <p className="mt-4 text-slate-400">
            Bu sayfa, Universe Zenith Stats platformunun kullanım şartlarını
            açıklar.
          </p>
        </div>

        <ContentSection title="1. Platformun Amacı">
          <p>
            Universe Zenith Stats, League of Legends oyuncu istatistiklerini
            analiz etmek ve performans metriklerini kullanıcıya anlaşılır şekilde
            sunmak için geliştirilmiş bağımsız bir analiz platformudur.
          </p>
        </ContentSection>

        <ContentSection title="2. Resmi Ürün Olmama Durumu">
          <p>
            Universe Zenith Stats, Riot Games tarafından desteklenmez ve Riot
            Games’in resmi ürünü değildir. Riot Games ve ilişkili tüm markalar
            Riot Games, Inc.’e aittir.
          </p>
        </ContentSection>

        <ContentSection title="3. Kullanıcı Sorumluluğu">
          <p>
            Kullanıcı, platformu yalnızca yasal ve adil kullanım amacıyla
            kullanmalıdır. Platformun kötüye kullanılması, servisleri aşırı
            yükleyecek otomatik istekler gönderilmesi veya yanıltıcı amaçlarla
            kullanılması kabul edilmez.
          </p>
        </ContentSection>

        <ContentSection title="4. Veri Doğruluğu">
          <p>
            Platformda gösterilen istatistikler, mevcut veri kaynaklarından elde
            edilen bilgilerle hesaplanır. Bu verilerde gecikme, eksiklik veya
            teknik hata oluşabilir.
          </p>
        </ContentSection>

        <ContentSection title="5. Değişiklik Hakkı">
          <p>
            Universe Zenith Stats, platform özelliklerinde, analiz yöntemlerinde
            ve kullanım şartlarında değişiklik yapma hakkını saklı tutar.
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