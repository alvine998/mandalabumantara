import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy, Timestamp } from "firebase/firestore";
import Link from "next/link";

interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    status: "draft" | "published";
    featuredImage: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
}

const ITEMS_PER_PAGE = 10;

export default function NewsList() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newArticle, setNewArticle] = useState({ title: "", category: "news" });
    const { showToast } = useToast();

    const loadArticles = async () => {
        try {
            const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
                publishedAt: doc.data().publishedAt?.toDate() || null,
            })) as NewsArticle[];
            setArticles(data);
        } catch (error) {
            console.error("Error loading articles:", error);
            showToast("Failed to load articles", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleCreate = async () => {
        if (!newArticle.title.trim()) {
            showToast("Please enter a title", "warning");
            return;
        }

        try {
            const slug = generateSlug(newArticle.title);
            const docRef = await addDoc(collection(db, "news"), {
                title: newArticle.title,
                slug: slug,
                excerpt: "",
                content: "",
                category: newArticle.category,
                status: "draft",
                featuredImage: "",
                author: "Admin",
                tags: [],
                metaTitle: "",
                metaDescription: "",
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                publishedAt: null,
            });

            showToast("Article created!", "success");
            setShowModal(false);
            setNewArticle({ title: "", category: "news" });
            window.location.href = `/main/news/${docRef.id}`;
        } catch (error) {
            console.error("Error creating article:", error);
            showToast("Failed to create article", "error");
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return;
        try {
            await deleteDoc(doc(db, "news", id));
            showToast("Article deleted", "success");
            loadArticles();
        } catch (error) {
            showToast("Failed to delete", "error");
        }
    };

    const handleToggleStatus = async (article: NewsArticle) => {
        try {
            const newStatus = article.status === "published" ? "draft" : "published";
            await updateDoc(doc(db, "news", article.id), {
                status: newStatus,
                publishedAt: newStatus === "published" ? Timestamp.now() : null,
                updatedAt: Timestamp.now(),
            });
            showToast(newStatus === "published" ? "Published!" : "Unpublished", "success");
            loadArticles();
        } catch (error) {
            showToast("Failed to update", "error");
        }
    };

    // Filter and paginate
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || article.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">News & Articles</h1>
                    <p className="text-slate-500 mt-1">{articles.length} total articles</p>
                </div>
                <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">
                    + New Article
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "published", "draft"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm ${filterStatus === status ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            >
                                {status === "all" ? "All" : status === "published" ? "Published" : "Drafts"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {paginatedArticles.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-5xl mb-4">📰</div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            + Create Article
                        </button>
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Article</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 hidden md:table-cell">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 hidden lg:table-cell">Date</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg flex-shrink-0 overflow-hidden">
                                                    {article.featuredImage ? (
                                                        <img src={article.featuredImage} alt="" className="w-full h-full object-cover" />
                                                    ) : "📰"}
                                                </div>
                                                <div>
                                                    <Link href={`/main/news/${article.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                                                        {article.title || "Untitled"}
                                                    </Link>
                                                    <p className="text-sm text-slate-500 truncate max-w-xs">{article.excerpt || "No excerpt"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm capitalize">{article.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(article)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${article.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                                            >
                                                {article.status === "published" ? "Published" : "Draft"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                                            {article.publishedAt?.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) || article.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/main/news/${article.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button onClick={() => handleDelete(article.id, article.title)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                                <p className="text-sm text-slate-500">
                                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredArticles.length)} of {filteredArticles.length}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                                        Math.max(0, currentPage - 3),
                                        Math.min(totalPages, currentPage + 2)
                                    ).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded-lg text-sm ${currentPage === page ? "bg-indigo-600 text-white" : "border border-slate-200 hover:bg-slate-50"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">Create New Article</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={newArticle.title}
                                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    placeholder="Article title..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    value={newArticle.category}
                                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                >
                                    <option value="news">News</option>
                                    <option value="article">Article</option>
                                    <option value="press-release">Press Release</option>
                                    <option value="announcement">Announcement</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                            <button onClick={handleCreate} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">
                                Create & Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
