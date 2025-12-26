"use client";

import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import { useState } from "react";
import Link from "next/link";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "Semua Proyek" },
    { id: "residential", label: "Residensial" },
    { id: "commercial", label: "Komersial" },
    { id: "interior", label: "Interior" },
  ];

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
      gradient: "from-blue-900 to-blue-700"
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
      gradient: "from-amber-500 to-orange-600"
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
      gradient: "from-green-600 to-emerald-700"
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
      gradient: "from-purple-600 to-indigo-700"
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
      gradient: "from-pink-600 to-rose-700"
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
      gradient: "from-cyan-600 to-blue-700"
    },
  ];

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <PageLayout activePage="gallery">
      {/* Hero Section */}
      <Section padding="large">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-amber-500 bg-clip-text text-transparent">
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
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-500 hover:shadow-2xl transition-all duration-300"
              >
                {/* Project Image Placeholder */}
                <div className={`aspect-video bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === "Selesai"
                        ? "bg-green-500 text-white"
                        : "bg-amber-500 text-white"
                      }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <div className="text-6xl mb-2">🏢</div>
                      <p className="text-sm opacity-90">{project.type}</p>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.location}
                  </div>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm font-semibold text-slate-700">
                      {project.units}
                    </span>
                    <Link
                      href={`/gallery/${project.slug}`}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform"
                    >
                      Lihat Detail
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
