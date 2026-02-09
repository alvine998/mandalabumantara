import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import { galleryService, GalleryItem } from "@/lib/services/gallery-service";

export async function getStaticProps() {
  try {
    const items = await galleryService.getGalleriesByType("gallery");
    // Serialize timestamps
    const serializedItems = items.map(item => ({
      ...item,
      created_at: item.created_at?.toDate()?.toISOString() || new Date().toISOString(),
      updated_at: item.updated_at?.toDate()?.toISOString() || new Date().toISOString(),
    }));

    return {
      props: {
        items: serializedItems,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        items: [],
      },
      revalidate: 60,
    };
  }
}

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "Semua Proyek" },
    { id: "residential", label: "Residensial" },
    { id: "commercial", label: "Komersial" },
    { id: "interior", label: "Interior" },
  ];

  const filteredItems = selectedCategory === "all"
    ? items
    : items; // No specific category field in the new payload, could add one later if requested

  return (
    <PageLayout activePage="gallery">
      {/* Hero Section */}
      <Section padding="large">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">
              Galeri Proyek
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto">
            Jelajahi portofolio proyek kami yang telah mengubah visi menjadi kenyataan
          </p>
        </div>
      </Section>

      {/* Filter Categories */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-900 to-amber-500 text-white shadow-lg scale-105"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-amber-500 hover:shadow-md"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const mainMedia = item.images.find(img => img.type === "photo" || img.type === "video");
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-500 hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center`}>
                    {mainMedia?.type === "photo" ? (
                      <img
                        src={mainMedia.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : mainMedia?.type === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          src={mainMedia.url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-6xl">🖼️</div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">
                      {item.type === "gallery" ? "Documentation" : "Home Media"}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-sm font-semibold text-slate-700 uppercase tracking-widest text-[10px]">
                        {mainMedia?.type || "media"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Tertarik dengan Proyek Kami?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Hubungi kami untuk konsultasi gratis dan wujudkan proyek impian Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-white/90 rounded-full font-semibold transition-all inline-block"
              >
                Konsultasi Sekarang
              </a>
              <a
                href="/mandala-bumi-nusantara"
                className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/10 rounded-full font-semibold transition-all inline-block"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
