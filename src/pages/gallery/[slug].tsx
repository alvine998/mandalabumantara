import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import { galleryService, GalleryItem } from "@/lib/services/gallery-service";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const items = await galleryService.getGalleriesByType("gallery");
    const paths = items.map((item) => ({
      params: { slug: item.id },
    }));
    return { paths, fallback: "blocking" };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.slug as string;
    const item = await galleryService.getGalleryById(id);

    if (!item) {
      return { notFound: true };
    }

    const serialized = {
      ...item,
      created_at: item.created_at?.toDate()?.toISOString() || new Date().toISOString(),
      updated_at: item.updated_at?.toDate()?.toISOString() || new Date().toISOString(),
    };

    return {
      props: { item: serialized },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching gallery item:", error);
    return { notFound: true };
  }
};

export default function GalleryDetail({ item }: { item: GalleryItem }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = item.images.filter((img) => img.type === "photo");
  const videos = item.images.filter((img) => img.type === "video");
  const allMedia = [...photos, ...videos];

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allMedia.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + allMedia.length) % allMedia.length);
    }
  };

  return (
    <PageLayout activePage="gallery">
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {allMedia.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {allMedia.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Media Content */}
          <div
            className="max-w-5xl max-h-[85vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {allMedia[lightboxIndex]?.type === "video" ? (
              <video
                src={allMedia[lightboxIndex].url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg"
              />
            ) : (
              <img
                src={allMedia[lightboxIndex]?.url}
                alt={`${item.name} - ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {lightboxIndex + 1} / {allMedia.length}
          </div>
        </div>
      )}

      {/* Header */}
      <Section padding="large">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center text-sm text-slate-500">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/gallery" className="hover:text-amber-600 transition-colors">Gallery</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">{item.name}</span>
          </div>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
                {item.name}
              </h1>
              <div className="flex items-center gap-4 text-slate-500">
                {photos.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {photos.length} Foto
                  </span>
                )}
                {videos.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    {videos.length} Video
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/gallery"
              className="text-amber-600 hover:text-amber-700 font-medium transition-colors flex items-center gap-2 self-start"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Galeri
            </Link>
          </div>

          {/* Photos Grid */}
          {photos.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => openLightbox(index)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    <img
                      src={photo.url}
                      alt={`${item.name} - Foto ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                        <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {videos.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                Video
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden bg-slate-900 border border-slate-200"
                  >
                    <video
                      src={video.url}
                      controls
                      className="w-full aspect-video object-cover"
                      preload="metadata"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {allMedia.length === 0 && (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-4 opacity-20">🖼️</div>
              <p className="text-slate-500 font-medium">Belum ada media untuk galeri ini.</p>
            </div>
          )}
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tertarik dengan Proyek Kami?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Hubungi tim kami untuk informasi lebih lanjut dan jadwalkan kunjungan lokasi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-white/90 rounded-full font-semibold transition-all inline-block"
              >
                Konsultasi Gratis
              </a>
              <a
                href="/gallery"
                className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/10 rounded-full font-semibold transition-all inline-block"
              >
                Lihat Proyek Lain
              </a>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
