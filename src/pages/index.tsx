import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import PageLayout from "@/components/PageLayout";
import VideoHero from "@/components/VideoHero";
import Section from "@/components/Section";
import FeatureCard from "@/components/FeatureCard";
import Button from "@/components/Button";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface HeroSection {
  badge: string;
  title: string;
  titleGradient: string;
  description: string;
  videoUrlDesktop: string;
  videoUrlMobile: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  secondaryButtonLink: string;
}

interface Stat {
  value: string;
  label: string;
}

interface OverviewSection {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  secondaryButtonLink: string;
  stats: Stat[];
}

interface Division {
  id: string;
  icon: string;
  name: string;
  description: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface HomePageData {
  hero: HeroSection;
  overview: OverviewSection;
  divisions: Division[];
  features: Feature[];
}

const defaultData: HomePageData = {
  hero: {
    badge: "✨ Welcome to the Future",
    title: "Experiences",
    titleGradient: "Build Amazing",
    description: "Create stunning web experiences with smooth transitions and beautiful design.",
    videoUrlDesktop: "https://firebasestorage.googleapis.com/v0/b/sales-midland.firebasestorage.app/o/Konten%201%20vistara.mp4?alt=media&token=adc090e2-c7e6-4f88-981e-fa5432a9ce6d",
    videoUrlMobile: "https://firebasestorage.googleapis.com/v0/b/sales-midland.firebasestorage.app/o/Konten%201%20vistara.mp4?alt=media&token=adc090e2-c7e6-4f88-981e-fa5432a9ce6d",
    primaryButtonLabel: "Start Building",
    secondaryButtonLabel: "Explore Features",
    secondaryButtonLink: "/features",
  },
  overview: {
    badge: "🏢 Solusi Properti Terintegrasi",
    title: "Mandala Bumantara",
    subtitle: "Ekosistem Properti Terpadu",
    description: "Dari konsultasi hingga perawatan, kami menyediakan solusi properti menyeluruh dengan standar kualitas terbaik dan komitmen kepada kepuasan pelanggan.",
    primaryButtonLabel: "Konsultasi Gratis",
    secondaryButtonLabel: "Tentang Kami",
    secondaryButtonLink: "/mandala-bumi-nusantara",
    stats: [
      { value: "500+", label: "Unit Terjual" },
      { value: "50+", label: "Proyek Selesai" },
      { value: "98%", label: "Kepuasan Klien" },
      { value: "15+", label: "Tahun Pengalaman" },
    ],
  },
  divisions: [
    { id: "1", icon: "🏗️", name: "Developer", description: "Pengembangan dan penjualan properti berkualitas dengan lokasi strategis and desain modern." },
    { id: "2", icon: "👷", name: "Kontraktor", description: "Jasa konstruksi profesional dengan standar kualitas tinggi, tepat waktu, dan sesuai anggaran." },
    { id: "3", icon: "🎨", name: "Interior", description: "Layanan desain dan konstruksi interior untuk meningkatkan nilai dan estetika properti Anda." },
    { id: "4", icon: "💼", name: "Konsultan", description: "Saran ahli tentang investasi, pengembangan, dan manajemen properti yang optimal." },
    { id: "5", icon: "📦", name: "Material", description: "Penyedia material bangunan berkualitas premium dengan harga kompetitif dan pengiriman cepat." },
    { id: "6", icon: "🏠", name: "Home Service", description: "Layanan perawatan dan perbaikan rumah untuk kenyamanan hunian modern Anda." },
  ],
  features: [
    { icon: "🎯", title: "Lokasi Strategis", description: "Properti berlokasi di area premium dengan akses mudah ke pusat bisnis, pendidikan, dan fasilitas umum." },
    { icon: "🏆", title: "Kualitas Terjamin", description: "Standar konstruksi internasional dengan material berkualitas tinggi dan pengawasan ketat." },
    { icon: "💎", title: "Investasi Menguntungkan", description: "Nilai properti yang terus meningkat dengan ROI yang menarik untuk investor jangka panjang." },
  ],
};

export default function Home() {
  const [data, setData] = useState<HomePageData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  // Load data from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, "pages", "home");
        const docSnap = await getDoc(docRef);
        let homeData = defaultData;
        if (docSnap.exists()) {
          homeData = { ...defaultData, ...docSnap.data() } as HomePageData;
        }

        // Fetch latest Home Video from Gallery Service
        const { galleryService } = await import("@/lib/services/gallery-service");
        // Use "Home" as per database schema
        const homeGalleries = await galleryService.getGalleriesByType("Home");

        if (homeGalleries && homeGalleries.length > 0) {
          // Sort by updated_at or created_at to get the latest
          const latestHome = homeGalleries[0];

          if (latestHome.images && latestHome.images.length > 0) {
            const desktopVideo = latestHome.images.find(img => img.type === "video_desktop")?.url;
            const mobileVideo = latestHome.images.find(img => img.type === "video_mobile")?.url;

            if (desktopVideo) homeData.hero.videoUrlDesktop = desktopVideo;
            if (mobileVideo) homeData.hero.videoUrlMobile = mobileVideo;
            else if (desktopVideo) homeData.hero.videoUrlMobile = desktopVideo;
          }
        }

        // Fetch Divisions from Division Service
        const { divisionService } = await import("@/lib/services/division-service");
        const divisions = await divisionService.getAllDivisions();
        if (divisions && divisions.length > 0) {
          homeData.divisions = divisions.map(d => ({
            id: d.id,
            icon: d.icon,
            name: d.name,
            description: d.description
          }));
        }

        setData(homeData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Searchable content (could be made dynamic too, but for now we keep the layout consistent with searchableContent)
  const searchableContent = [
    { title: "Home", description: "Halaman utama", href: "/", category: "Halaman" },
    { title: "About", description: "Tentang kami", href: "/about", category: "Halaman" },
    { title: "Gallery", description: "Galeri proyek", href: "/gallery", category: "Halaman" },
    { title: "Contact", description: "Hubungi kami", href: "/contact", category: "Halaman" },
    { title: "Mandala Bumi Nusantara", description: "Filosofi dan unit bisnis", href: "/mandala-bumi-nusantara", category: "Proyek" },
    { title: "Vistara", description: "Proyek properti terintegrasi", href: "/vistara", category: "Proyek" },
    ...data.divisions.map(d => ({ title: d.name, description: d.description, href: "/vistara", category: "Divisi Bisnis" })),
    ...data.features.map(f => ({ title: f.title, description: f.description, href: "#", category: "Keunggulan" })),
  ];

  const searchResults = searchQuery.trim()
    ? searchableContent.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleSelectResult(searchResults[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectResult = (result: typeof searchableContent[0]) => {
    if (result.href === "#") {
      setShowSuggestions(false);
      setSearchQuery("");
      setIsFocused(false);
    } else {
      router.push(result.href);
      setShowSuggestions(false);
      setSearchQuery("");
      setIsFocused(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <PageLayout activePage="home">
      <VideoHero
        videoUrlDesktop={data.hero.videoUrlDesktop}
        videoUrlMobile={data.hero.videoUrlMobile}
        badge={data.hero.badge}
        title={data.hero.title}
        titleGradient={data.hero.titleGradient}
        description={data.hero.description}
        primaryButton={{ label: data.hero.primaryButtonLabel }}
        secondaryButton={{ label: data.hero.secondaryButtonLabel, href: data.hero.secondaryButtonLink }}
      />

      {/* Company Overview Section */}
      <Section padding="large">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                {data.overview.title}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              {data.overview.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="primary" className="px-8 py-4 text-lg w-full sm:w-auto">
                {data.overview.primaryButtonLabel}
              </Button>
              <Button
                variant="secondary"
                href={data.overview.secondaryButtonLink}
                className="px-8 py-4 text-lg w-full sm:w-auto"
              >
                {data.overview.secondaryButtonLabel}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {data.overview.stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </Section>

      {/* Business Divisions Section */}
      <Section background="light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Divisi Bisnis Kami
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              Solusi lengkap untuk semua kebutuhan properti Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            {data.divisions.map((division, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 relative mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300">
                  {division.icon?.startsWith("http") ? (
                    <img src={division.icon} alt={division.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-4xl">{division.icon || "🏗️"}</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-amber-600 transition-colors">{division.name}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {division.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Mengapa Memilih Kami
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              Keunggulan yang membuat kami berbeda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            {data.features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Floating/Centered Search Bar with Suggestions */}
      <div
        ref={searchRef}
        className={`fixed left-1/2 transform -translate-x-1/2 z-40 w-[92%] sm:w-full max-w-lg transition-all duration-700 ease-in-out ${isFocused || searchQuery
          ? "top-1/2 -translate-y-1/2 scale-105"
          : isScrolled
            ? "bottom-6 sm:bottom-8 translate-y-0 scale-100"
            : "bottom-1/2 translate-y-1/2 scale-100 sm:scale-110"
          }`}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 via-blue-800 to-amber-500 rounded-full opacity-30 blur-md animate-pulse"></div>
        <div className="relative">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-full shadow-2xl flex items-center p-2 border border-white/50 ring-1 ring-white/50">
            <div className="pl-3 sm:pl-4 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari halaman, proyek, atau divisi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsFocused(true);
                if (searchQuery) setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 200);
              }}
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-slate-800 placeholder-slate-500/80 h-10 px-3 text-sm sm:text-base focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                  setIsFocused(false);
                }}
                className="mr-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="flex items-center space-x-1">
              <button className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-96 overflow-y-auto">
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${selectedIndex === index
                      ? "bg-amber-50 border border-amber-200"
                      : "hover:bg-slate-50 border border-transparent"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900 truncate">
                            {result.title}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${result.category === "Halaman" ? "bg-blue-100 text-blue-700" :
                            result.category === "Proyek" ? "bg-amber-100 text-amber-700" :
                              result.category === "Divisi Bisnis" ? "bg-green-100 text-green-700" :
                                "bg-slate-100 text-slate-700"
                            }`}>
                            {result.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">
                          {result.description}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSuggestions && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center">
              <div className="text-slate-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">Tidak ada hasil ditemukan</p>
              <p className="text-sm text-slate-500 mt-1">Coba kata kunci lain</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

