import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { companyProfileService, CompanyProfile } from "@/lib/services/company-profile-service";
import { organizationService, OrganizationMember } from "@/lib/services/organization-service";
import { divisionService, Division } from "@/lib/services/division-service";
import { benefitService, Benefit } from "@/lib/services/benefit-service";
import { subCompanyService } from "@/lib/services/sub-company-service";
import Image from "next/image";

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
    description: "Bergabunglah dengan ratusan klien yang telah mempercayai Mandala Bumi Nusantara untuk investasi dan hunian mereka. Tim kami siap membantu Anda.",
    primaryButtonLabel: "Hubungi Kami",
    primaryButtonLink: "/contact",
    secondaryButtonLabel: "Lihat Galeri Proyek",
    secondaryButtonLink: "/gallery",
  },
};

export default function About() {
  const [data, setData] = useState<AboutPageData>(defaultData);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, membersData, subCompanies, allDivisions, allBenefits] = await Promise.all([
          companyProfileService.getProfile(),
          organizationService.getAllMembers(),
          subCompanyService.getAllSubCompanies(),
          divisionService.getAllDivisions(),
          benefitService.getAllBenefits()
        ]);

        setProfile(profileData);
        setMembers(membersData);

        // Find Mandala Bumi Nusantara ID
        const mbn = subCompanies.find(sc => sc.name.toLowerCase().includes("mandala bumi nusantara"));
        if (mbn) {
          setDivisions(allDivisions.filter(d => d.sub_company_id === mbn.id));
          setBenefits(allBenefits.filter(b => b.sub_company_id === mbn.id));
        } else {
          // Fallback if not found by name, just show first if any
          setDivisions(allDivisions.filter(d => d.sub_company_id === subCompanies[0]?.id));
          setBenefits(allBenefits.filter(b => b.sub_company_id === subCompanies[0]?.id));
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">
                {profile?.name || data.hero.title}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              <span className="italic">"{profile?.slogan || data.hero.subtitle}"</span>
            </p>
          </div>

          {/* Company Story */}
          <div className="max-w-4xl mx-auto mb-24">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-amber-300 rounded-full"></div>
              <div className="pl-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  {data.story.title}
                </h2>
                {profile?.description ? (
                  <div
                    className="text-lg text-slate-600 leading-relaxed prose prose-slate prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: profile.description }}
                  />
                ) : (
                  <div className="space-y-4">
                    {data.story.paragraphs.map((para, index) => (
                      <p key={index} className="text-lg text-slate-600 leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business Divisions Section */}
          {divisions.length > 0 && (
            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Unit Bisnis Kami</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {divisions.map((division) => (
                  <div key={division.id} className="group p-8 rounded-2xl bg-white border-2 border-slate-100 hover:border-amber-500 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 relative mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300">
                      {division.icon?.startsWith("http") ? (
                        <Image src={division.icon} alt={division.name} fill className="object-contain p-2" />
                      ) : (
                        <span className="text-4xl">{division.icon || "🏗️"}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-amber-600 transition-colors">{division.name}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {division.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Values Section */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                {data.values.title}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.values.items.map((value, index) => (
                <div key={index} className="group p-8 rounded-2xl bg-gradient-to-br from-white to-slate-50 border-2 border-slate-100 hover:border-amber-500 hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-amber-600 transition-colors">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          {benefits.length > 0 && (
            <div className="mb-24">
              <div className="p-10 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full -ml-48 -mb-48"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Keunggulan & Fasilitas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {benefits.map((benefit) => (
                      <div key={benefit.id} className="flex items-start space-x-4 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-2xl border border-amber-500/30">
                          {benefit.icon?.startsWith("http") ? (
                            <div className="relative w-8 h-8">
                              <Image src={benefit.icon} alt={benefit.name} fill className="object-contain brightness-0 invert" />
                            </div>
                          ) : (
                            <span>{benefit.icon || "💎"}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-white">{benefit.name}</h3>
                          <p className="text-slate-300 text-sm leading-relaxed">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Organization Section */}
          {(() => {
            const filteredMembers = members.filter(member =>
              member.description?.toLowerCase().includes('ceo') ||
              member.description?.toLowerCase().includes('stakeholder')
            );
            return filteredMembers.length > 0 && (
              <div className="mb-24">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Struktur Organisasi</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto rounded-full"></div>
                </div>
                <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                  {filteredMembers.map((member, index) => (
                    <div key={member.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
                      <div className="w-full md:w-1/2">
                        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100">
                          {member.photo ? (
                            <Image
                              src={member.photo}
                              alt={member.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 text-center md:text-left">
                        <h3 className="text-4xl sm:text-5xl font-serif text-slate-900">{member.name}</h3>
                        <p className="text-lg text-slate-600 leading-relaxed font-light mb-6">
                          - {member.position} -
                        </p>
                        <div className="inline-block mb-4">
                          <span className="text-md">{member.description}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* CTA */}
          <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white text-center shadow-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">{data.cta.title}</h2>
            <p className="text-lg sm:text-xl opacity-90 leading-relaxed mb-8 max-w-2xl mx-auto">
              {data.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                href={data.cta.primaryButtonLink}
                className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-white/90 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {data.cta.primaryButtonLabel}
              </Button>
              <Button
                variant="outline"
                href={data.cta.secondaryButtonLink}
                className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/10 rounded-full font-semibold transition-all"
              >
                {data.cta.secondaryButtonLabel}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
