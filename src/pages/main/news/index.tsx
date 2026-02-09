import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { newsService, NewsArticle } from "@/lib/services/news-service";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function NewsList() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newArticle, setNewArticle] = useState({ title: "" });
    const { showToast } = useToast();

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await newsService.getAllNews();
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
            const created = await newsService.createNews({
                title: newArticle.title,
                slug: slug,
                author: "Admin"
            });

            showToast("Article created!", "success");
            setShowModal(false);
            setNewArticle({ title: "" });
            window.location.href = `/main/news/${created.id}`;
        } catch (error) {
            console.error("Error creating article:", error);
            showToast("Failed to create article", "error");
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return;
        try {
            await newsService.deleteNews(id);
            showToast("Article deleted", "success");
            loadArticles();
        } catch (error) {
            showToast("Failed to delete", "error");
        }
    };

    const handleToggleStatus = async (article: NewsArticle) => {
        try {
            const newStatus = article.status === "published" ? "draft" : "published";
            await newsService.updateNews(article.id, {
                status: newStatus,
                published_at: newStatus === "published" ? (new Date() as any) : null,
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

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "-";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    };

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
                <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm active:scale-95">
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
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "published", "draft"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filterStatus === status ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
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
                        <div className="text-5xl mb-4 animate-bounce">📰</div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                        <p className="text-slate-500 mb-6">Start by creating your first news post.</p>
                        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            + Create Article
                        </button>
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Article</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-lg flex-shrink-0 overflow-hidden border border-slate-200 group-hover:border-indigo-200 transition-colors">
                                                    {article.thumbnail ? (
                                                        <img src={article.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : "📰"}
                                                </div>
                                                <div className="min-w-0">
                                                    <Link href={`/main/news/${article.id}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block truncate">
                                                        {article.title || "Untitled"}
                                                    </Link>
                                                    <p className="text-[11px] font-medium text-slate-400 uppercase mt-1 tracking-wider">By {article.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(article)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${article.status === "published" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}
                                            >
                                                {article.status === "published" ? "Published" : "Draft"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-[12px] font-medium text-slate-400 hidden lg:table-cell">
                                            {formatDate(article.published_at || article.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <Link href={`/main/news/${article.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button onClick={() => handleDelete(article.id, article.title)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                                <p className="text-[12px] font-medium text-slate-400">
                                    Showing <span className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredArticles.length)}</span> of <span className="text-slate-900">{filteredArticles.length}</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                                    >
                                        &larr; Prev
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Create New Article</h2>
                            <p className="text-slate-400 text-xs mt-1 font-medium uppercase tracking-wider">News Content Management</p>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Article Title *</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newArticle.title}
                                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-medium"
                                    placeholder="e.g. New Project Launch 2026"
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-50">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500 text-sm font-bold uppercase tracking-wider hover:text-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleCreate} className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95">
                                Create & Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
