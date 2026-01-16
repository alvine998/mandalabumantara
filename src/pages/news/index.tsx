import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    featuredImage: string;
    author: string;
    publishedAt: Date;
}

const ITEMS_PER_PAGE = 9;

export default function NewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const q = query(
                    collection(db, "news"),
                    where("status", "==", "published"),
                    orderBy("publishedAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    publishedAt: doc.data().publishedAt?.toDate() || new Date(),
                })) as NewsArticle[];
                setArticles(data);
            } catch (error) {
                console.error("Error loading articles:", error);
            } finally {
                setLoading(false);
            }
        };
        loadArticles();
    }, []);

    const categories = [
        { id: "all", label: "Semua" },
        { id: "news", label: "Berita" },
        { id: "article", label: "Artikel" },
        { id: "press-release", label: "Press Release" },
        { id: "announcement", label: "Pengumuman" },
    ];

    const filteredArticles = selectedCategory === "all"
        ? articles
        : articles.filter(a => a.category === selectedCategory);

    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <Head>
                <title>Berita & Artikel | Mandala Bumantara</title>
                <meta name="description" content="Berita terbaru, artikel, dan update dari Mandala Bumantara. Dapatkan informasi terkini seputar properti dan proyek kami." />
                <meta name="keywords" content="berita properti, artikel properti, mandala bumantara news" />
                <meta property="og:title" content="Berita & Artikel | Mandala Bumantara" />
                <meta property="og:description" content="Berita terbaru, artikel, dan update dari Mandala Bumantara." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://mandalabumantara.com/news" />
            </Head>

            <PageLayout activePage="news">
                <Section padding="large">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-amber-500 bg-clip-text text-transparent">
                                    Berita & Artikel
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                Update terbaru seputar properti, proyek, dan perkembangan Mandala Bumantara
                            </p>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                                    className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === cat.id
                                            ? "bg-gradient-to-r from-blue-900 to-amber-500 text-white shadow-lg"
                                            : "bg-white text-slate-700 border border-slate-200 hover:border-amber-500"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Articles Grid */}
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : paginatedArticles.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">📰</div>
                                <p className="text-slate-500">Belum ada artikel dalam kategori ini</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {paginatedArticles.map((article) => (
                                        <article
                                            key={article.id}
                                            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-300"
                                        >
                                            <Link href={`/news/${article.slug}`}>
                                                <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-700 relative overflow-hidden">
                                                    {article.featuredImage ? (
                                                        <img
                                                            src={article.featuredImage}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-white text-5xl">📰</div>
                                                    )}
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-medium rounded-full capitalize">
                                                            {article.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <time className="text-sm text-slate-500" dateTime={article.publishedAt.toISOString()}>
                                                        {article.publishedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                                    </time>
                                                    <h2 className="text-xl font-bold text-slate-900 mt-2 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                                                        {article.title}
                                                    </h2>
                                                    <p className="text-slate-600 line-clamp-3">{article.excerpt}</p>
                                                    <div className="mt-4 flex items-center text-amber-600 font-medium">
                                                        Baca selengkapnya
                                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </Link>
                                        </article>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Previous page"
                                        >
                                            ← Prev
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-lg font-medium ${currentPage === page
                                                        ? "bg-blue-900 text-white"
                                                        : "border border-slate-200 hover:bg-slate-50"
                                                    }`}
                                                aria-label={`Page ${page}`}
                                                aria-current={currentPage === page ? "page" : undefined}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Next page"
                                        >
                                            Next →
                                        </button>
                                    </nav>
                                )}
                            </>
                        )}
                    </div>
                </Section>
            </PageLayout>
        </>
    );
}
