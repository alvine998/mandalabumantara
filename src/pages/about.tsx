import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface Advantage {
  title: string;
  description: string;
}

interface AboutPageData {
  hero: {
    title: string;
    subtitle: string;
  };
  story: {
    title: string;
    paragraphs: string[];
  };
  values: {
    title: string;
    items: Value[];
  };
  whyChooseUs: {
    title: string;
    description: string;
    advantages: Advantage[];
  };
  cta: {
    title: string;
    description: string;
    primaryButtonLabel: string;
    primaryButtonLink: string;
    secondaryButtonLabel: string;
    secondaryButtonLink: string;
  };
}

const defaultData: AboutPageData = {
  hero: {
    title: "Tentang Kami",
    subtitle: "Membangun masa depan properti Indonesia dengan integritas dan inovasi",
  },
  story: {
    title: "Kisah Kami",
    paragraphs: [
      "Mandala Bumantara lahir dari visi untuk menciptakan ekosistem properti yang terintegrasi dan berkelanjutan di Indonesia. Dengan pengalaman lebih dari 15 tahun di industri properti, kami telah berkembang menjadi perusahaan yang menyediakan solusi lengkap dari hulu ke hilir.",
      'Nama "Mandala" melambangkan kesempurnaan dan keseimbangan, sementara "Bumantara" menegaskan komitmen kami terhadap Bumi Nusantara. Kami percaya bahwa setiap properti yang kami kembangkan harus memberikan nilai jangka panjang bagi pemiliknya dan kontribusi positif bagi lingkungan sekitar.',
    ],
  },
  values: {
    title: "Nilai-Nilai Kami",
    items: [
      { icon: "🎯", title: "Integritas", description: "Kami berkomitmen pada transparansi dan kejujuran dalam setiap transaksi dan hubungan bisnis." },
      { icon: "🏆", title: "Kualitas", description: "Standar kualitas tinggi dalam setiap proyek, dari material hingga hasil akhir konstruksi." },
      { icon: "💡", title: "Inovasi", description: "Terus berinovasi dengan teknologi dan metode terbaru dalam industri properti." },
      { icon: "❤️", title: "Kepuasan Pelanggan", description: "Mengutamakan kepuasan pelanggan dengan layanan terbaik dan responsif." },
    ],
  },
  whyChooseUs: {
    title: "Mengapa Memilih Kami",
    description: "Sebagai perusahaan properti terintegrasi, kami menawarkan keunggulan yang membedakan kami dari kompetitor:",
    advantages: [
      { title: "Solusi End-to-End", description: "Dari konsultasi, pembangunan, hingga perawatan dalam satu ekosistem" },
      { title: "Tim Profesional", description: "Arsitek, engineer, dan konsultan berpengalaman dengan sertifikasi internasional" },
      { title: "Track Record Terbukti", description: "500+ unit terjual dan 98% tingkat kepuasan pelanggan" },
      { title: "Teknologi Modern", description: "Menggunakan BIM, smart home technology, dan sustainable building practices" },
      { title: "Lokasi Strategis", description: "Fokus pada area premium dengan potensi pertumbuhan tinggi" },
    ],
  },
  cta: {
    title: "Mari Wujudkan Impian Properti Anda",
    description: "Bergabunglah dengan ratusan klien yang telah mempercayai Mandala Bumantara untuk investasi dan hunian mereka. Tim kami siap membantu Anda.",
    primaryButtonLabel: "Hubungi Kami",
    primaryButtonLink: "/contact",
    secondaryButtonLabel: "Lihat Galeri Proyek",
    secondaryButtonLink: "/gallery",
  },
};

export default function About() {
  const [data, setData] = useState<AboutPageData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, "pages", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ ...defaultData, ...docSnap.data() } as AboutPageData);
        }
      } catch (error) {
        console.error("Error loading about page data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <PageLayout activePage="about">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout activePage="about">
      {/* Hero Section */}
      <Section padding="large">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">
                {data.hero.title}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed">
              {data.hero.subtitle}
            </p>
          </div>

          {/* Company Story */}
          <div className="space-y-12">
            <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">
                {data.story.title}
              </h2>
              {data.story.paragraphs.map((para, index) => (
                <p key={index} className="text-lg text-slate-600 leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Our Values */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-slate-900 text-center">
                {data.values.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.values.items.map((value, index) => (
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
                {data.whyChooseUs.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                {data.whyChooseUs.description}
              </p>
              <ul className="space-y-3 text-lg text-slate-600">
                {data.whyChooseUs.advantages.map((adv, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 mr-3">✓</span>
                    <span>
                      <strong>{adv.title}:</strong> {adv.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{data.cta.title}</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-6 max-w-2xl mx-auto">
                {data.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  href={data.cta.primaryButtonLink}
                  className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-white/90"
                >
                  {data.cta.primaryButtonLabel}
                </Button>
                <Button
                  variant="outline"
                  href={data.cta.secondaryButtonLink}
                  className="px-8 py-4 text-lg border-white text-white hover:bg-white/10"
                >
                  {data.cta.secondaryButtonLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
