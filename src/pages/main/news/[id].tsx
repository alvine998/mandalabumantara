import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import "react-quill/dist/quill.snow.css";

// Dynamic import for React Quill (SSR fix)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ArticleData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    status: "draft" | "published";
    featuredImage: string;
    author: string;
    tags: string[];
    metaTitle: string;
    metaDescription: string;
}

const defaultArticle: ArticleData = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "news",
    status: "draft",
    featuredImage: "",
    author: "Admin",
    tags: [],
    metaTitle: "",
    metaDescription: "",
};

type TabType = "content" | "media" | "seo";

export default function NewsEditor() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<ArticleData>(defaultArticle);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("content");
    const [tagInput, setTagInput] = useState("");
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
                const docRef = doc(db, "news", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData({ ...defaultArticle, ...docSnap.data() } as ArticleData);
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
        if (!id) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, "news", id as string), {
                ...data,
                updatedAt: Timestamp.now(),
            });
            showToast("Saved!", "success");
        } catch (error) {
            console.error("Error saving:", error);
            showToast("Failed to save", "error");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!id) return;
        try {
            const newStatus = data.status === "published" ? "draft" : "published";
            await updateDoc(doc(db, "news", id as string), {
                status: newStatus,
                publishedAt: newStatus === "published" ? Timestamp.now() : null,
                updatedAt: Timestamp.now(),
            });
            setData({ ...data, status: newStatus });
            showToast(newStatus === "published" ? "Published!" : "Unpublished", "success");
        } catch (error) {
            showToast("Failed to update status", "error");
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData({ ...data, tags: [...data.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setData({ ...data, tags: data.tags.filter(t => t !== tag) });
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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

    return (
        <AdminLayout>
            {/* Custom Quill Styles */}
            <style jsx global>{`
        .ql-container {
          min-height: 400px;
          font-size: 16px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 400px;
        }
        .ql-toolbar {
          border-radius: 8px 8px 0 0;
          background: #f8fafc;
        }
        .ql-container {
          border-radius: 0 0 8px 8px;
        }
      `}</style>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/main/news" className="p-2 hover:bg-slate-100 rounded-lg">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{data.title || "Untitled Article"}</h1>
                        <p className="text-slate-500 mt-1">/news/{data.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {data.status === "published" ? "Published" : "Draft"}
                    </span>
                    {data.status === "published" && (
                        <a href={`/news/${data.slug}`} target="_blank" className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                            Preview
                        </a>
                    )}
                    <button onClick={handlePublish} className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                        {data.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50">
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            <span className="mr-2">{tab.icon}</span>{tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Content Tab */}
                    {activeTab === "content" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData({ ...data, title: e.target.value, slug: data.slug || generateSlug(e.target.value) })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-lg"
                                        placeholder="Article title..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData({ ...data, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    >
                                        <option value="news">News</option>
                                        <option value="article">Article</option>
                                        <option value="press-release">Press Release</option>
                                        <option value="announcement">Announcement</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
                                    <div className="flex">
                                        <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-slate-500">/news/</span>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData({ ...data, slug: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-r-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                                    <input
                                        type="text"
                                        value={data.author}
                                        onChange={(e) => setData({ ...data, author: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt</label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={(e) => setData({ ...data, excerpt: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    placeholder="Brief summary of the article..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                                <ReactQuill
                                    theme="snow"
                                    value={data.content}
                                    onChange={(content) => setData({ ...data, content })}
                                    modules={quillModules}
                                    placeholder="Write your article content here..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {data.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-indigo-900">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg"
                                        placeholder="Add a tag..."
                                    />
                                    <button onClick={addTag} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg">Add</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Media Tab */}
                    {activeTab === "media" && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Featured Image URL</label>
                                <input
                                    type="text"
                                    value={data.featuredImage}
                                    onChange={(e) => setData({ ...data, featuredImage: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    placeholder="https://..."
                                />
                                {data.featuredImage && (
                                    <div className="mt-4">
                                        <img src={data.featuredImage} alt="Featured" className="max-w-md h-48 object-cover rounded-lg" />
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 text-center">
                                <p className="text-slate-500">Image upload feature can be added with Firebase Storage or external service</p>
                            </div>
                        </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab === "seo" && (
                        <div className="space-y-6 max-w-2xl">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-medium text-blue-900 mb-2">SEO Preview</h3>
                                <div className="bg-white rounded-lg p-4 border">
                                    <p className="text-blue-700 text-lg">{data.metaTitle || data.title || "Page Title"}</p>
                                    <p className="text-green-700 text-sm">{`yoursite.com/news/${data.slug}`}</p>
                                    <p className="text-slate-600 text-sm">{data.metaDescription || data.excerpt || "Page description will appear here..."}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    value={data.metaTitle}
                                    onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    placeholder={data.title}
                                />
                                <p className="text-xs text-slate-500 mt-1">{(data.metaTitle || data.title).length}/60 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description</label>
                                <textarea
                                    value={data.metaDescription}
                                    onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    placeholder={data.excerpt}
                                />
                                <p className="text-xs text-slate-500 mt-1">{(data.metaDescription || data.excerpt).length}/160 characters</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
