import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";

export default function About() {
  const values = [
    {
      icon: "🎯",
      title: "Integritas",
      description: "Kami berkomitmen pada transparansi dan kejujuran dalam setiap transaksi dan hubungan bisnis."
    },
    {
      icon: "🏆",
      title: "Kualitas",
      description: "Standar kualitas tinggi dalam setiap proyek, dari material hingga hasil akhir konstruksi."
    },
    {
      icon: "💡",
      title: "Inovasi",
      description: "Terus berinovasi dengan teknologi dan metode terbaru dalam industri properti."
    },
    {
      icon: "❤️",
      title: "Kepuasan Pelanggan",
      description: "Mengutamakan kepuasan pelanggan dengan layanan terbaik dan responsif."
    }
  ];

  return (
    <PageLayout activePage="about">
      {/* Hero Section */}
      <Section padding="large">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">
                Tentang Kami
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed">
              Membangun masa depan properti Indonesia dengan integritas dan inovasi
            </p>
          </div>

          {/* Company Story */}
          <div className="space-y-12">
            <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">
                Kisah Kami
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                <strong>Mandala Bumantara</strong> lahir dari visi untuk menciptakan ekosistem properti yang terintegrasi dan berkelanjutan di Indonesia. Dengan pengalaman lebih dari 15 tahun di industri properti, kami telah berkembang menjadi perusahaan yang menyediakan solusi lengkap dari hulu ke hilir.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Nama "Mandala" melambangkan kesempurnaan dan keseimbangan, sementara "Bumantara" menegaskan komitmen kami terhadap Bumi Nusantara. Kami percaya bahwa setiap properti yang kami kembangkan harus memberikan nilai jangka panjang bagi pemiliknya dan kontribusi positif bagi lingkungan sekitar.
              </p>
            </div>

            {/* Our Values */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-slate-900 text-center">
                Nilai-Nilai Kami
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all">
                    <div className="text-4xl mb-3">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">
                Mengapa Memilih Kami
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Sebagai perusahaan properti terintegrasi, kami menawarkan keunggulan yang membedakan kami dari kompetitor:
              </p>
              <ul className="space-y-3 text-lg text-slate-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>
                    <strong>Solusi End-to-End:</strong> Dari konsultasi, pembangunan, hingga perawatan dalam satu ekosistem
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>
                    <strong>Tim Profesional:</strong> Arsitek, engineer, dan konsultan berpengalaman dengan sertifikasi internasional
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>
                    <strong>Track Record Terbukti:</strong> 500+ unit terjual dan 98% tingkat kepuasan pelanggan
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>
                    <strong>Teknologi Modern:</strong> Menggunakan BIM, smart home technology, dan sustainable building practices
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-3">✓</span>
                  <span>
                    <strong>Lokasi Strategis:</strong> Fokus pada area premium dengan potensi pertumbuhan tinggi
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Mari Wujudkan Impian Properti Anda</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-6 max-w-2xl mx-auto">
                Bergabunglah dengan ratusan klien yang telah mempercayai Mandala Bumantara untuk investasi dan hunian mereka. Tim kami siap membantu Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  href="/contact"
                  className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-white/90"
                >
                  Hubungi Kami
                </Button>
                <Button
                  variant="outline"
                  href="/gallery"
                  className="px-8 py-4 text-lg border-white text-white hover:bg-white/10"
                >
                  Lihat Galeri Proyek
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
