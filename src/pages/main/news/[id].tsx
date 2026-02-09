import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { newsService, NewsArticle } from "@/lib/services/news-service";
import { uploadService } from "@/lib/services/upload-service";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import "react-quill/dist/quill.snow.css";

// Dynamic import for React Quill (SSR fix)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type TabType = "content" | "media" | "seo";

export default function NewsEditor() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("content");
    const [uploading, setUploading] = useState(false);
    const { showToast } = useToast();

    // Quill modules configuration
    const quillModules = useMemo(() => ({
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            ["clean"],
        ],
    }), []);

    useEffect(() => {
        if (!id) return;

        const loadArticle = async () => {
            try {
                setLoading(true);
                const article = await newsService.getNewsById(id as string);
                if (article) {
                    setData(article);
                } else {
                    showToast("Article not found", "error");
                    router.push("/main/news");
                }
            } catch (error) {
                console.error("Error loading article:", error);
                showToast("Failed to load article", "error");
            } finally {
                setLoading(false);
            }
        };
        loadArticle();
    }, [id]);

    const handleSave = async () => {
        if (!id || !data) return;
        setSaving(true);
        try {
            const { id: _, created_at: __, ...updateData } = data;
            await newsService.updateNews(id as string, updateData);
            showToast("Changes saved successfully!", "success");
        } catch (error) {
            console.error("Error saving:", error);
            showToast("Failed to save changes", "error");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!id || !data) return;
        try {
            const newStatus = data.status === "published" ? "draft" : "published";
            const published_at = newStatus === "published" ? (new Date() as any) : null;

            await newsService.updateNews(id as string, {
                status: newStatus,
                published_at: published_at
            });

            setData({ ...data, status: newStatus, published_at: published_at });
            showToast(newStatus === "published" ? "Article Published!" : "Article Unpublished", "success");
        } catch (error) {
            showToast("Failed to update status", "error");
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !data) return;

        try {
            setUploading(true);
            const downloadURL = await uploadService.uploadImage(file, "news/thumbnails");
            setData({ ...data, thumbnail: downloadURL });
            showToast("Thumbnail uploaded successfully!", "success");
        } catch (error: any) {
            console.error("Upload failed:", error);
            showToast(error.message || "Failed to upload image", "error");
        } finally {
            setUploading(false);
        }
    };

    const tabs = [
        { id: "content" as TabType, label: "Content", icon: "📝" },
        { id: "media" as TabType, label: "Media", icon: "🖼️" },
        { id: "seo" as TabType, label: "SEO", icon: "🔍" },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!data) return null;

    return (
        <AdminLayout>
            <style jsx global>{`
                .ql-container {
                    min-height: 500px;
                    font-size: 16px;
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                }
                .ql-editor {
                    min-height: 500px;
                    padding: 2rem;
                    line-height: 1.6;
                }
                .ql-toolbar {
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                    border-color: #e2e8f0 !important;
                    background: #f8fafc;
                    padding: 1rem !important;
                }
                .ql-container {
                    border-color: #e2e8f0 !important;
                }
            `}</style>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/main/news" className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all group">
                        <svg className="w-5 h-5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900">{data.title || "Untitled Article"}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${data.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {data.status}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-slate-400">/news/{data.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePublish}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        {data.status === "published" ? "Unpublish" : "Publish Now"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 active:scale-95"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Editor Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                <div className="flex border-b border-slate-100 bg-slate-50/30">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-6 py-5 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"}`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </span>
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {activeTab === "content" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Article Title *</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData({ ...data, title: e.target.value, slug: data.slug || generateSlug(e.target.value) })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900 text-lg"
                                        placeholder="Enter a compelling title..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Slug (URL Path)</label>
                                    <div className="flex">
                                        <span className="px-5 py-3.5 bg-slate-100 border border-r-0 border-slate-100 rounded-l-xl text-slate-400 font-bold text-sm">/news/</span>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData({ ...data, slug: e.target.value })}
                                            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-r-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Author Name</label>
                                    <input
                                        type="text"
                                        value={data.author}
                                        onChange={(e) => setData({ ...data, author: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Article Body Content (WYSIWYG)</label>
                                <div className="shadow-sm border border-slate-200 rounded-2xl overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-container]:border-none">
                                    <ReactQuill
                                        theme="snow"
                                        value={data.content}
                                        onChange={(content) => setData({ ...data, content })}
                                        modules={quillModules}
                                        placeholder="Start writing your story..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "media" && (
                        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Featured Image Upload</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                                className="hidden"
                                                id="thumbnail-upload"
                                            />
                                            <label
                                                htmlFor="thumbnail-upload"
                                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer transition-all hover:bg-slate-50 hover:border-indigo-300 group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Uploading...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-sm font-bold text-slate-600 block">Click to upload image</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Max size: 5MB</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Or Paste Image URL</label>
                                        <input
                                            type="text"
                                            value={data.thumbnail}
                                            onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preview</label>
                                    {data.thumbnail ? (
                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-4 border-slate-50 shadow-inner group">
                                            <img src={data.thumbnail} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                            <button
                                                onClick={() => setData({ ...data, thumbnail: "" })}
                                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="aspect-video w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <div className="text-4xl mb-2">🖼️</div>
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No preview available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "seo" && (
                        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
                            {/* Keywords Section */}
                            <div className="space-y-4">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Article Keywords (SEO Tags)</label>
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl min-h-[52px]">
                                        {(data.keywords || []).map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg group animate-in zoom-in duration-200"
                                            >
                                                {keyword}
                                                <button
                                                    onClick={() => {
                                                        const newKeywords = [...(data.keywords || [])];
                                                        newKeywords.splice(index, 1);
                                                        setData({ ...data, keywords: newKeywords });
                                                    }}
                                                    className="hover:text-indigo-900 transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            placeholder={(data.keywords || []).length === 0 ? "Type and press Enter to add keywords..." : "Add more..."}
                                            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 min-w-[120px]"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ',') {
                                                    e.preventDefault();
                                                    const value = e.currentTarget.value.trim().replace(/,$/, '');
                                                    if (value && !(data.keywords || []).includes(value)) {
                                                        setData({ ...data, keywords: [...(data.keywords || []), value] });
                                                        e.currentTarget.value = "";
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium italic">Keywords help search engines understand what your article is about. Separate with Enter or commas.</p>
                                </div>
                            </div>

                            {/* Google Preview */}
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Google Preview</h3>
                                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-1 hover:shadow-md transition-shadow">
                                    <p className="text-indigo-600 text-lg font-medium leading-tight truncate">{data.title || "Untitled Article"}</p>
                                    <p className="text-emerald-600 text-[13px] truncate">mandalabumantara.co.id › news › {data.slug}</p>
                                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                        {data.content.replace(/<[^>]*>/g, '').substring(0, 160) || "Start writing to see a description here..."}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-4">
                                <div className="text-2xl mt-0.5">💡</div>
                                <div>
                                    <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">SEO Tip</h4>
                                    <p className="text-amber-800/80 text-sm leading-relaxed">
                                        Search engines prioritize clear titles and relevant slug URLs. Make sure your title reflects the core topic and your content is rich with relevant keywords.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
