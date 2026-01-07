"use client";

import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ProjectDetail() {
  const router = useRouter();
  const { slug } = router.query;

  // Project data (in real app, this would come from API/database)
  const projects = [
    {
      id: 1,
      slug: "vistara-residence",
      title: "Vistara Residence",
      category: "residential",
      location: "Jakarta Selatan",
      status: "Selesai",
      type: "Apartemen Mewah",
      units: "120 Unit",
      description: "Apartemen modern dengan fasilitas lengkap di lokasi strategis Jakarta Selatan",
      gradient: "from-blue-900 to-blue-700",
      fullDescription: "Vistara Residence adalah proyek apartemen mewah yang terletak di jantung Jakarta Selatan. Dengan 120 unit yang telah terjual habis, proyek ini menawarkan hunian modern dengan fasilitas kelas dunia. Setiap unit dirancang dengan cermat untuk memaksimalkan ruang dan kenyamanan, dilengkapi dengan teknologi smart home dan finishing premium.",
      features: [
        "Smart Home System",
        "Infinity Pool di Rooftop",
        "Fitness Center 24 Jam",
        "Sky Garden & BBQ Area",
        "24/7 Security System",
        "Akses Langsung ke Mall"
      ],
      specifications: {
        "Luas Bangunan": "35m² - 120m²",
        "Jumlah Lantai": "25 Lantai",
        "Tahun Selesai": "2023",
        "Sertifikat": "SHM (Sertifikat Hak Milik)",
        "Developer": "Mandala Bumantara",
        "Arsitek": "PT. Arsitek Nusantara"
      }
    },
    {
      id: 2,
      slug: "mandala-office-park",
      title: "Mandala Office Park",
      category: "commercial",
      location: "BSD City",
      status: "Sedang Berjalan",
      type: "Perkantoran",
      units: "15.000 m²",
      description: "Kompleks perkantoran modern dengan teknologi smart building",
      gradient: "from-amber-500 to-orange-600",
      fullDescription: "Mandala Office Park adalah kompleks perkantoran premium di BSD City yang mengusung konsep smart building. Dengan total luas 15.000 m², proyek ini menawarkan ruang kantor yang fleksibel dan modern, dilengkapi dengan teknologi terkini untuk mendukung produktivitas bisnis Anda.",
      features: [
        "Smart Building Management System",
        "High-Speed Internet Fiber Optic",
        "Ample Parking Space",
        "Food Court & Cafeteria",
        "Meeting Room Facilities",
        "Green Building Certified"
      ],
      specifications: {
        "Total Luas": "15.000 m²",
        "Jumlah Lantai": "12 Lantai",
        "Target Selesai": "Q4 2025",
        "Sertifikat": "HGB (Hak Guna Bangunan)",
        "Developer": "Mandala Bumantara",
        "Konsultan": "PT. Konsultan Properti Indonesia"
      }
    },
    {
      id: 3,
      slug: "green-valley-homes",
      title: "Green Valley Homes",
      category: "residential",
      location: "Tangerang",
      status: "Selesai",
      type: "Perumahan",
      units: "85 Unit",
      description: "Perumahan ramah lingkungan dengan konsep sustainable living",
      gradient: "from-green-600 to-emerald-700",
      fullDescription: "Green Valley Homes adalah perumahan eksklusif dengan konsep sustainable living di Tangerang. Dengan 85 unit rumah yang telah terjual, proyek ini menawarkan hunian yang harmonis dengan alam, dilengkapi dengan taman hijau, sistem pengelolaan air hujan, dan panel surya.",
      features: [
        "Solar Panel System",
        "Rainwater Harvesting",
        "Organic Garden",
        "Jogging Track & Park",
        "Community Center",
        "24/7 Security"
      ],
      specifications: {
        "Luas Tanah": "72m² - 200m²",
        "Luas Bangunan": "45m² - 150m²",
        "Tahun Selesai": "2022",
        "Sertifikat": "SHM (Sertifikat Hak Milik)",
        "Developer": "Mandala Bumantara",
        "Landscape": "PT. Taman Hijau Nusantara"
      }
    },
    {
      id: 4,
      slug: "executive-suite-design",
      title: "Executive Suite Design",
      category: "interior",
      location: "Jakarta Pusat",
      status: "Selesai",
      type: "Interior Kantor",
      units: "500 m²",
      description: "Desain interior kantor eksekutif dengan konsep modern minimalis",
      gradient: "from-purple-600 to-indigo-700",
      fullDescription: "Executive Suite Design adalah proyek desain interior untuk kantor eksekutif seluas 500 m² di Jakarta Pusat. Mengusung konsep modern minimalis dengan sentuhan mewah, proyek ini menciptakan ruang kerja yang produktif dan representatif.",
      features: [
        "Custom Furniture Design",
        "Acoustic Treatment",
        "Smart Lighting System",
        "Premium Materials",
        "Ergonomic Workspace",
        "Art Installation"
      ],
      specifications: {
        "Luas Area": "500 m²",
        "Durasi Pengerjaan": "3 Bulan",
        "Tahun Selesai": "2023",
        "Gaya Desain": "Modern Minimalis",
        "Interior Designer": "Mandala Bumantara Interior",
        "Kontraktor": "PT. Mandala Konstruksi"
      }
    },
    {
      id: 5,
      slug: "bumantara-mall",
      title: "Bumantara Mall",
      category: "commercial",
      location: "Surabaya",
      status: "Sedang Berjalan",
      type: "Retail",
      units: "25.000 m²",
      description: "Pusat perbelanjaan modern dengan konsep lifestyle center",
      gradient: "from-pink-600 to-rose-700",
      fullDescription: "Bumantara Mall adalah pusat perbelanjaan modern di Surabaya dengan konsep lifestyle center. Dengan total luas 25.000 m², mall ini akan menjadi destinasi belanja, kuliner, dan hiburan terlengkap di Surabaya Timur.",
      features: [
        "200+ Retail Outlets",
        "Food Court & Fine Dining",
        "Cinema Complex",
        "Kids Playground",
        "Rooftop Garden",
        "Smart Parking System"
      ],
      specifications: {
        "Total Luas": "25.000 m²",
        "Jumlah Lantai": "5 Lantai",
        "Target Selesai": "Q2 2026",
        "Kapasitas Parkir": "800 Mobil",
        "Developer": "Mandala Bumantara",
        "Arsitek": "PT. Arsitek Modern Indonesia"
      }
    },
    {
      id: 6,
      slug: "luxury-villa-interior",
      title: "Luxury Villa Interior",
      category: "interior",
      location: "Bali",
      status: "Selesai",
      type: "Interior Residensial",
      units: "350 m²",
      description: "Interior villa mewah dengan sentuhan tradisional Bali modern",
      gradient: "from-cyan-600 to-blue-700",
      fullDescription: "Luxury Villa Interior adalah proyek desain interior villa mewah seluas 350 m² di Bali. Menggabungkan elemen tradisional Bali dengan desain kontemporer, proyek ini menciptakan ruang yang eksotis namun tetap nyaman dan fungsional.",
      features: [
        "Balinese Contemporary Design",
        "Natural Stone & Wood",
        "Infinity Pool View",
        "Outdoor Living Space",
        "Custom Lighting",
        "Tropical Garden Integration"
      ],
      specifications: {
        "Luas Area": "350 m²",
        "Durasi Pengerjaan": "4 Bulan",
        "Tahun Selesai": "2023",
        "Gaya Desain": "Balinese Contemporary",
        "Interior Designer": "Mandala Bumantara Interior",
        "Furniture": "Custom Made & Imported"
      }
    },
  ];

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <PageLayout>
        <Section padding="large">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Proyek Tidak Ditemukan</h1>
            <p className="text-slate-600 mb-8">Maaf, proyek yang Anda cari tidak tersedia.</p>
            <Link href="/gallery" className="text-amber-600 hover:text-amber-700 font-medium">
              ← Kembali ke Galeri
            </Link>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <Section padding="large">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center text-sm text-slate-600">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/gallery" className="hover:text-amber-600">Gallery</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">{project.title}</span>
          </div>

          {/* Project Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Project Image */}
            <div className={`aspect-video rounded-3xl bg-gradient-to-br ${project.gradient} relative overflow-hidden shadow-2xl`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-6 right-6">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  project.status === "Selesai"
                    ? "bg-green-500 text-white"
                    : "bg-amber-500 text-white"
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <div className="text-8xl mb-4">🏢</div>
                  <p className="text-xl opacity-90">{project.type}</p>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
                {project.title}
              </h1>
              <div className="flex items-center text-lg text-slate-600 mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.location}
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {project.fullDescription}
              </p>
              <div className="flex gap-4">
                <Button variant="primary" href="/contact" className="px-8 py-3">
                  Hubungi Kami
                </Button>
                <Button variant="secondary" href="/gallery" className="px-8 py-3">
                  Lihat Proyek Lain
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section background="light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">Fitur & Fasilitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.features.map((feature, index) => (
              <div key={index} className="flex items-center p-4 bg-white rounded-xl border border-slate-200">
                <span className="text-amber-500 mr-3 text-xl">✓</span>
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Specifications Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">Spesifikasi Proyek</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(project.specifications).map(([key, value]) => (
              <div key={key} className="p-6 bg-white rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500 mb-1">{key}</div>
                <div className="text-lg font-semibold text-slate-900">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tertarik dengan Proyek Ini?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Hubungi tim kami untuk informasi lebih lanjut dan jadwalkan kunjungan lokasi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                href="/contact"
                className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-white/90"
              >
                Konsultasi Gratis
              </Button>
              <Button
                variant="outline"
                href="/gallery"
                className="px-8 py-4 text-lg border-white text-white hover:bg-white/10"
              >
                Lihat Proyek Lain
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
