import { LegalDocument } from "@/components/legal/legal-document";

const sections = [
  {
    title: "Platformun Amacı",
    content: (
      <p>
        Universe Zenith Stats, League of Legends oyuncu istatistiklerini analiz
        etmek ve performans metriklerini kullanıcıya anlaşılır şekilde sunmak
        için geliştirilmiş bağımsız bir analiz platformudur.
      </p>
    ),
  },
  {
    title: "Resmi Ürün Olmama Durumu",
    content: (
      <p>
        Universe Zenith Stats, Riot Games tarafından desteklenmez ve Riot
        Games’in resmi ürünü değildir. Riot Games ve ilişkili tüm markalar Riot
        Games, Inc.’e aittir.
      </p>
    ),
  },
  {
    title: "Kullanıcı Sorumluluğu",
    content: (
      <p>
        Kullanıcı, platformu yalnızca yasal ve adil kullanım amacıyla
        kullanmalıdır. Platformun kötüye kullanılması, servisleri aşırı
        yükleyecek otomatik istekler gönderilmesi veya yanıltıcı amaçlarla
        kullanılması kabul edilmez.
      </p>
    ),
  },
  {
    title: "Veri Doğruluğu",
    content: (
      <p>
        Platformda gösterilen istatistikler, mevcut veri kaynaklarından elde
        edilen bilgilerle hesaplanır. Bu verilerde gecikme, eksiklik veya teknik
        hata oluşabilir.
      </p>
    ),
  },
  {
    title: "Değişiklik Hakkı",
    content: (
      <p>
        Universe Zenith Stats, platform özelliklerinde, analiz yöntemlerinde ve
        kullanım şartlarında değişiklik yapma hakkını saklı tutar.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Platform ilkeleri"
      title="Kullanım Şartları"
      description="Universe Zenith Stats platformunu kullanırken geçerli olan temel koşulları, sorumlulukları ve hizmet sınırlarını açıklar."
      sections={sections}
      variant="terms"
    />
  );
}
