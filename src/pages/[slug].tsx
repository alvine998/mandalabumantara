import { GetStaticPaths, GetStaticProps } from "next";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Image from "next/image";
import { subCompanyService, SubCompany } from "@/lib/services/sub-company-service";
import { divisionService, Division } from "@/lib/services/division-service";
import { galleryService, GalleryItem } from "@/lib/services/gallery-service";

interface SubCompanyPageProps {
    company: SubCompany;
    divisions: Division[];
    projects: GalleryItem[];
}

// Helper function to slugify company names
const slugify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export default function SubCompanyPage({ company, divisions, projects }: SubCompanyPageProps) {
    if (!company) {
        return (
            <PageLayout activePage="home">
                <Section padding="large">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Company Not Found</h1>
                        <p className="text-slate-600 mb-8">The company you're looking for doesn't exist.</p>
                        <Button variant="primary" href="/">Return Home</Button>
                    </div>
                </Section>
            </PageLayout>
        );
    }

    return (
        <PageLayout activePage="home">
            {/* Hero Section */}
            <Section padding="large">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                        <div>
                            <div className="inline-block mb-4 px-4 py-2 bg-amber-50 rounded-full border border-amber-200">
                                <span className="text-sm font-medium text-amber-700">
                                    🏢 Mandala Bumantara Company
                                </span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">
                                    {company.name}
                                </span>
                            </h1>
                            <div
                                className="text-xl text-slate-600 mb-8 leading-relaxed prose prose-slate max-w-none"
                                dangerouslySetInnerHTML={{ __html: company.description }}
                            />
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="primary" href="/contact" className="px-8 py-4 text-lg">
                                    Hubungi Kami
                                </Button>
                                <Button variant="secondary" href="/gallery" className="px-8 py-4 text-lg">
                                    Lihat Galeri
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            {company.logo ? (
                                <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-slate-100 shadow-2xl">
                                    <Image
                                        src={company.logo}
                                        alt={company.name}
                                        fill
                                        className="object-contain p-8"
                                    />
                                </div>
                            ) : (
                                <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 shadow-2xl flex items-center justify-center">
                                    <span className="text-9xl">🏢</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-24">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 text-center">Informasi Kontak</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {company.email && (
                                <div className="p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-amber-500 hover:shadow-xl transition-all duration-300">
                                    <div className="text-4xl mb-4">📧</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Email</h3>
                                    <a href={`mailto:${company.email}`} className="text-amber-600 hover:text-amber-700 break-all">
                                        {company.email}
                                    </a>
                                </div>
                            )}
                            {company.mobile_phone && (
                                <div className="p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-amber-500 hover:shadow-xl transition-all duration-300">
                                    <div className="text-4xl mb-4">📱</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Telepon</h3>
                                    <a href={`tel:${company.mobile_phone}`} className="text-amber-600 hover:text-amber-700">
                                        {company.mobile_phone}
                                    </a>
                                </div>
                            )}
                            {company.address && (
                                <div className="p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-amber-500 hover:shadow-xl transition-all duration-300">
                                    <div className="text-4xl mb-4">📍</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Alamat</h3>
                                    <p className="text-slate-600">{company.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Media */}
                    {(company.facebook || company.instagram || company.tiktok || company.youtube) && (
                        <div className="mb-24">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 text-center">Ikuti Kami</h2>
                            <div className="flex justify-center gap-4 flex-wrap">
                                {company.facebook && (
                                    <a
                                        href={company.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-xl bg-blue-50 border-2 border-blue-100 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex items-center gap-3"
                                    >
                                        <span className="text-3xl">📘</span>
                                        <span className="font-semibold text-blue-700">Facebook</span>
                                    </a>
                                )}
                                {company.instagram && (
                                    <a
                                        href={company.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-xl bg-pink-50 border-2 border-pink-100 hover:border-pink-500 hover:shadow-lg transition-all duration-300 flex items-center gap-3"
                                    >
                                        <span className="text-3xl">📷</span>
                                        <span className="font-semibold text-pink-700">Instagram</span>
                                    </a>
                                )}
                                {company.tiktok && (
                                    <a
                                        href={company.tiktok}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-xl bg-slate-50 border-2 border-slate-100 hover:border-slate-500 hover:shadow-lg transition-all duration-300 flex items-center gap-3"
                                    >
                                        <span className="text-3xl">🎵</span>
                                        <span className="font-semibold text-slate-700">TikTok</span>
                                    </a>
                                )}
                                {company.youtube && (
                                    <a
                                        href={company.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 rounded-xl bg-red-50 border-2 border-red-100 hover:border-red-500 hover:shadow-lg transition-all duration-300 flex items-center gap-3"
                                    >
                                        <span className="text-3xl">📺</span>
                                        <span className="font-semibold text-red-700">YouTube</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Business Divisions */}
                    {divisions.length > 0 && (
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Unit Bisnis</h2>
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

                    {/* Projects Gallery */}
                    {projects.length > 0 && (
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Proyek Kami</h2>
                                <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto rounded-full"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.slice(0, 6).map((project) => (
                                    <a
                                        key={project.id}
                                        href={`/gallery/${project.id}`}
                                        className="group block rounded-2xl overflow-hidden bg-white border-2 border-slate-100 hover:border-amber-500 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                            {project.images && project.images.length > 0 && (
                                                <Image
                                                    src={project.images[0].url}
                                                    alt={project.images[0].type}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                                                {project.name}
                                            </h3>
                                            {/* <p className="text-slate-600 text-sm line-clamp-2">{project.}</p> */}
                                        </div>
                                    </a>
                                ))}
                            </div>
                            {projects.length > 6 && (
                                <div className="text-center mt-8">
                                    <Button variant="secondary" href="/gallery">
                                        Lihat Semua Proyek
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white text-center shadow-2xl">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Tertarik Bekerja Sama?</h2>
                        <p className="text-lg sm:text-xl opacity-90 leading-relaxed mb-8 max-w-2xl mx-auto">
                            Hubungi kami untuk konsultasi gratis dan temukan solusi terbaik untuk kebutuhan properti Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="primary"
                                href="/contact"
                                className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-white/90 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Hubungi Kami
                            </Button>
                            <Button
                                variant="outline"
                                href="/about"
                                className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/10 rounded-full font-semibold transition-all"
                            >
                                Tentang Kami
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>
        </PageLayout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const companies = await subCompanyService.getAllSubCompanies();
        const paths = companies.map((company) => ({
            params: { slug: slugify(company.name) },
        }));

        return {
            paths,
            fallback: 'blocking',
        };
    } catch (error) {
        console.error("Error in getStaticPaths:", error);
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
};

export const getStaticProps: GetStaticProps<SubCompanyPageProps> = async ({ params }) => {
    try {
        const slug = params?.slug as string;

        // Fetch all companies and find the one matching the slug
        const companies = await subCompanyService.getAllSubCompanies();
        const company = companies.find((c) => slugify(c.name) === slug);

        if (!company) {
            return {
                notFound: true,
            };
        }

        // Fetch divisions for this company
        const allDivisions = await divisionService.getAllDivisions();
        const divisions = allDivisions.filter((d) => d.sub_company_id === company.id);

        // Fetch gallery projects for this company (if sub_company_id exists in gallery)
        let projects: GalleryItem[] = [];
        try {
            const allProjects = await galleryService.getAllGalleries();
            projects = allProjects.filter((p) =>
                (p as any).sub_company_id === company.id && p.type === 'gallery'
            );
        } catch (error) {
            console.log("Gallery filtering skipped - sub_company_id may not exist in gallery items");
        }

        // Serialize Firestore Timestamps
        const serializedCompany = JSON.parse(JSON.stringify(company));
        const serializedDivisions = JSON.parse(JSON.stringify(divisions));
        const serializedProjects = JSON.parse(JSON.stringify(projects));

        return {
            props: {
                company: serializedCompany,
                divisions: serializedDivisions,
                projects: serializedProjects,
            },
            revalidate: 60, // ISR: Revalidate every 60 seconds
        };
    } catch (error) {
        console.error("Error in getStaticProps:", error);
        return {
            notFound: true,
        };
    }
};
