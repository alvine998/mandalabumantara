import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import { galleryService, GalleryItem } from "@/lib/services/gallery-service";
import Link from "next/link";

export async function getStaticProps() {
  try {
    const items = await galleryService.getGalleriesByType("gallery");
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

      {/* Projects Grid */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const mainMedia = item.images.find(img => img.type === "photo" || img.type === "video");
              const photoCount = item.images.filter(img => img.type === "photo").length;
              const videoCount = item.images.filter(img => img.type === "video").length;

              return (
                <Link
                  key={item.id}
                  href={`/gallery/${item.id}`}
                  className="group rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-500 hover:shadow-2xl transition-all duration-300 block"
                >
                  <div className="aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center">
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
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-6xl opacity-20">🖼️</div>
                    )}

                    {/* Media count badge */}
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                        {photoCount > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {photoCount}
                          </span>
                        )}
                        {videoCount > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            {videoCount}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span>{item.images?.length || 0} media</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-amber-600 font-medium group-hover:underline">Lihat Detail →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-4 opacity-20">🖼️</div>
              <p className="text-slate-500 font-medium">Belum ada galeri proyek.</p>
            </div>
          )}
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
