import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ContentDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        type: "Page Section",
        status: "draft",
        content: "",
        author: "Admin"
    });

    // Mock fetch data
    useEffect(() => {
        if (!id) return;

        // Simulate API call
        setTimeout(() => {
            const mockData: Record<string, any> = {
                "1": { title: "Home Hero Section", slug: "home", type: "Landing Pages", status: "published", content: "Welcome to Mandala Bumantara. We build amazing digital experiences.", author: "Admin" },
                "2": { title: "About Us Story", slug: "about", type: "Landing Pages", status: "published", content: "Our company started with a simple vision to bridge digital gaps.", author: "Editor" },
                "4": { title: "Contact Form Settings", slug: "contact", type: "Landing Pages", status: "published", content: "Contact info and form configuration for the public site.", author: "Dev" },
                "7": { title: "Gallery Collection", slug: "gallery", type: "Landing Pages", status: "published", content: "Visual portfolio of our latest projects and explorations.", author: "Editor" },
                "8": { title: "Vistara Details", slug: "vistara", type: "Landing Pages", status: "published", content: "Comprehensive details about the Vistara project and its impact.", author: "Admin" },
                "9": { title: "Mandala Bumi Nusantara", slug: "mandala-bumi-nusantara", type: "Landing Pages", status: "published", content: "Geographical and cultural context of our flagship initiative.", author: "Admin" }
            };

            if (id === "new") {
                setFormData({
                    title: "",
                    slug: "",
                    type: "Landing Pages",
                    status: "draft",
                    content: "",
                    author: "Admin"
                });
            } else if (mockData[id as string]) {
                setFormData(mockData[id as string]);
            } else {
                // Default fallback
                setFormData({
                    title: "Unknown Content",
                    slug: "unknown",
                    type: "Page Section",
                    status: "draft",
                    content: "No data found for this ID.",
                    author: "Admin"
                });
            }
            setIsLoading(false);
        }, 500);
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/main/content"
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {id === "new" ? "Create New Content" : "Edit Content"}
                            </h1>
                            <p className="text-slate-500 text-sm">
                                {id === "new" ? "Add a new section to your website" : `Editing ID: ${id}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/main/content"
                            className="px-4 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="e.g., Home Hero Section"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                                            /
                                        </span>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-r-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                                            placeholder="home-hero"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Content Body</label>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center space-x-2 text-slate-500">
                                            <button className="p-1 hover:bg-slate-200 rounded"><b className="font-serif font-bold">B</b></button>
                                            <button className="p-1 hover:bg-slate-200 rounded"><i className="font-serif italic">I</i></button>
                                            <button className="p-1 hover:bg-slate-200 rounded"><u className="font-serif underline">U</u></button>
                                            <div className="w-px h-4 bg-slate-300 mx-2"></div>
                                            <button className="p-1 hover:bg-slate-200 rounded text-xs">H1</button>
                                            <button className="p-1 hover:bg-slate-200 rounded text-xs">H2</button>
                                            <button className="p-1 hover:bg-slate-200 rounded text-xs">Link</button>
                                        </div>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            rows={12}
                                            className="w-full px-4 py-3 border-none focus:ring-0 resize-none text-slate-700 leading-relaxed"
                                            placeholder="Start writing your content here..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Publishing</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Content Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    >
                                        <option value="Landing Pages">Landing Pages</option>
                                        <option value="Page Section">Page Section</option>
                                        <option value="Page Content">Page Content</option>
                                        <option value="Banner">Banner</option>
                                        <option value="Navigation">Navigation</option>
                                    </select>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                                        <span>Author</span>
                                        <span className="font-medium text-slate-800">{formData.author}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Last Revised</span>
                                        <span className="font-medium text-slate-800">Just now</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Featured Image</h3>
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-slate-900">Click to upload</p>
                                <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
