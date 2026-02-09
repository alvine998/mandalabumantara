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
    thumbnail: string;
    author: string;
    published_at: string; // Changed to string for serialization
    status: string;
}

const ITEMS_PER_PAGE = 9;

export async function getStaticProps() {
    try {
        const q = query(
            collection(db, "news"),
            where("status", "==", "published"),
            orderBy("published_at", "desc")
        );
        const querySnapshot = await getDocs(q);
        const articles = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                slug: data.slug || "",
                excerpt: data.excerpt || "",
                thumbnail: data.thumbnail || "",
                author: data.author || "",
                status: data.status || "",
                published_at: data.published_at?.toDate()?.toISOString() || new Date().toISOString(),
                // Explicitly excluding or serializing other timestamps to avoid Next.js serialization errors
            };
        });

        return {
            props: {
                articles,
            },
            revalidate: 60, // Revalidate every 60 seconds
        };
    } catch (error) {
        console.error("Error in getStaticProps:", error);
        return {
            props: {
                articles: [],
            },
            revalidate: 60,
        };
    }
}

export default function NewsPage({ articles }: { articles: NewsArticle[] }) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
    const paginatedArticles = articles.slice(
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
                                <span className="bg-gradient-to-r from-amber-600 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                                    Berita
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                Update terbaru seputar properti, proyek, dan perkembangan Mandala Bumantara
                            </p>
                        </div>


                        {/* Articles Grid */}
                        {articles.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">📰</div>
                                <p className="text-slate-500">Belum ada artikel dalam kategori ini</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {paginatedArticles.map((article) => {
                                        const publishedDate = new Date(article.published_at);
                                        return (
                                            <article
                                                key={article.id}
                                                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-300"
                                            >
                                                <Link href={`/news/${article.slug}`}>
                                                    <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-700 relative overflow-hidden">
                                                        {article.thumbnail ? (
                                                            <img
                                                                src={article.thumbnail}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-white text-5xl">📰</div>
                                                        )}
                                                    </div>
                                                    <div className="p-6">
                                                        <time className="text-sm text-slate-500" dateTime={publishedDate.toISOString()}>
                                                            {publishedDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
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
                                        );
                                    })}
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
