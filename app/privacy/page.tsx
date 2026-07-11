import { LegalDocument } from "@/components/legal/legal-document";

const sections = [
  {
    title: "Toplanan Veriler",
    content: (
      <>
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
      </>
    ),
  },
  {
    title: "Verilerin Kullanım Amacı",
    content: (
      <p>
        Toplanan veriler oyuncu performansını analiz etmek, geçmiş analizleri
        listelemek ve kullanıcıya daha anlamlı istatistikler sunmak için
        kullanılır.
      </p>
    ),
  },
  {
    title: "Riot Games ile İlişki",
    content: (
      <p>
        Universe Zenith Stats, Riot Games tarafından desteklenmez ve Riot
        Games’in resmi ürünü değildir. Riot Games ve ilişkili tüm markalar Riot
        Games, Inc.’e aittir.
      </p>
    ),
  },
  {
    title: "Çerezler ve Analitik",
    content: (
      <p>
        Platform ileride ziyaretçi trafiğini analiz etmek, performansı ölçmek
        veya reklam gösterimi sağlamak için çerezler ve üçüncü taraf servisler
        kullanabilir.
      </p>
    ),
  },
  {
    title: "İletişim",
    content: (
      <p>
        Gizlilik politikasıyla ilgili sorular için Universe Zenith ekibiyle
        iletişime geçilebilir.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Veri ve güven"
      title="Gizlilik Politikası"
      description="Universe Zenith Stats platformunda hangi verilerin işlendiğini ve bu verilerin hangi amaçlarla kullanıldığını açıklar."
      sections={sections}
      variant="privacy"
    />
  );
}
