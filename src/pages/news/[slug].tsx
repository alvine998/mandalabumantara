import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";

interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    author: string;
    keywords: string[];
    published_at: string; // Serialized
}

interface RelatedArticle {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    published_at: string; // Serialized
}

export async function getStaticPaths() {
    try {
        const q = query(collection(db, "news"), where("status", "==", "published"));
        const snapshot = await getDocs(q);
        const paths = snapshot.docs.map(doc => ({
            params: { slug: doc.data().slug },
        }));

        return {
            paths,
            fallback: "blocking",
        };
    } catch (error) {
        console.error("Error in getStaticPaths:", error);
        return { paths: [], fallback: "blocking" };
    }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
    try {
        const q = query(
            collection(db, "news"),
            where("slug", "==", params.slug),
            where("status", "==", "published"),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { notFound: true };
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        const article = {
            id: doc.id,
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            thumbnail: data.thumbnail || "",
            author: data.author || "",
            keywords: data.keywords || [],
            published_at: data.published_at?.toDate()?.toISOString() || new Date().toISOString(),
        };

        // Load related articles
        const relatedQuery = query(
            collection(db, "news"),
            where("status", "==", "published"),
            orderBy("published_at", "desc"),
            limit(4)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const relatedArticles = relatedSnapshot.docs
            .filter(d => d.id !== doc.id)
            .slice(0, 3)
            .map(d => ({
                id: d.id,
                title: d.data().title,
                slug: d.data().slug,
                thumbnail: d.data().thumbnail,
                published_at: d.data().published_at?.toDate()?.toISOString() || new Date().toISOString(),
            }));

        return {
            props: {
                article,
                relatedArticles,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error("Error in getStaticProps:", error);
        return { notFound: true };
    }
}

export default function NewsDetail({ article, relatedArticles }: { article: NewsArticle, relatedArticles: RelatedArticle[] }) {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <PageLayout activePage="news">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageLayout>
        );
    }

    if (!article) return null;

    const publishedDate = new Date(article.published_at);

    // JSON-LD structured data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.excerpt,
        image: article.thumbnail,
        author: {
            "@type": "Person",
            name: article.author,
        },
        publisher: {
            "@type": "Organization",
            name: "Mandala Bumantara",
            logo: {
                "@type": "ImageObject",
                url: "https://mandalabumantara.com/logo.png",
            },
        },
        datePublished: publishedDate.toISOString(),
        dateModified: publishedDate.toISOString(),
    };

    return (
        <>
            <Head>
                <title>{article.title} | Mandala Bumantara</title>
                <meta name="description" content={article.excerpt} />
                <meta name="keywords" content={article.keywords?.join(", ")} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={article.thumbnail} />
                <meta property="og:url" content={`https://mandalabumantara.com/news/${article.slug}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.title} />
                <meta name="twitter:description" content={article.excerpt} />
                <meta name="twitter:image" content={article.thumbnail} />
                <link rel="canonical" href={`https://mandalabumantara.com/news/${article.slug}`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            <PageLayout activePage="news">
                <article>
                    {/* Hero */}
                    <Section padding="large">
                        <div className="max-w-4xl mx-auto">
                            {/* Breadcrumb */}
                            <nav className="mb-8" aria-label="Breadcrumb">
                                <ol className="flex items-center gap-2 text-sm text-slate-500">
                                    <li><Link href="/" className="hover:text-amber-600">Home</Link></li>
                                    <li>/</li>
                                    <li><Link href="/news" className="hover:text-amber-600">News</Link></li>
                                    <li>/</li>
                                    <li className="text-slate-900 truncate max-w-[200px]">{article.title}</li>
                                </ol>
                            </nav>

                            {/* Category & Date */}
                            <time className="text-slate-500" dateTime={publishedDate.toISOString()}>
                                {publishedDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </time>

                            {/* Title */}
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                {article.title}
                            </h1>

                            {/* Excerpt */}
                            <p className="text-xl text-slate-600 mb-8">{article.excerpt}</p>

                            {/* Author */}
                            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-200">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-amber-500 flex items-center justify-center text-white font-bold">
                                    {article.author?.charAt(0) || "A"}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{article.author}</p>
                                    <p className="text-sm text-slate-500">Author</p>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {article.thumbnail ? (
                                <figure className="mb-10">
                                    <img
                                        src={article.thumbnail}
                                        alt={article.title}
                                        className="w-full h-auto rounded-2xl"
                                    />
                                </figure>
                            ) : null}

                            {/* Content */}
                            <div
                                className="prose prose-lg prose-slate max-w-none
                  prose-headings:font-bold prose-headings:text-slate-900
                  prose-p:text-slate-700 prose-p:leading-relaxed
                  prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900
                  prose-img:rounded-xl
                  prose-blockquote:border-l-amber-500 prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* Tags/Keywords */}
                            {article.keywords && article.keywords.length > 0 && (
                                <div className="mt-10 pt-8 border-t border-slate-200">
                                    <h3 className="text-sm font-medium text-slate-500 mb-3">Keywords:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {article.keywords.map((keyword) => (
                                            <span key={keyword} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                                                #{keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share */}
                            <div className="mt-8 pt-8 border-t border-slate-200">
                                <h3 className="text-sm font-medium text-slate-500 mb-3">Share:</h3>
                                <div className="flex gap-3">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://mandalabumantara.com/news/${article.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
                                    >
                                        Twitter
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://mandalabumantara.com/news/${article.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
                                    >
                                        Facebook
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://mandalabumantara.com/news/${article.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <Section className="bg-slate-50">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="text-3xl font-bold text-slate-900 mb-8">Artikel Terkait</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedArticles.map((related) => {
                                        const relatedDate = new Date(related.published_at);
                                        return (
                                            <Link
                                                key={related.id}
                                                href={`/news/${related.slug}`}
                                                className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all"
                                            >
                                                <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
                                                    {related.thumbnail ? (
                                                        <img src={related.thumbnail} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-white text-3xl">📰</div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <time className="text-xs text-slate-500">
                                                        {relatedDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                    </time>
                                                    <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-amber-600 line-clamp-2">
                                                        {related.title}
                                                    </h3>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </Section>
                    )}
                </article>
            </PageLayout>
        </>
    );
}
