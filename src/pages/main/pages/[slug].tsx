import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PageEditor() {
    const router = useRouter();
    const { slug } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        status: "draft",
        visibility: "public",
        featuredImage: "",
        template: "default",
        parentPage: "",
        order: 0,
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        author: "Admin"
    });

    // Mock fetch data
    useEffect(() => {
        if (!slug) return;

        setTimeout(() => {
            const mockData: Record<string, any> = {
                "home": {
                    title: "Home",
                    slug: "home",
                    content: "Welcome to Mandala Bumantara. We build amazing digital experiences.",
                    excerpt: "Main landing page for the website",
                    status: "published",
                    visibility: "public",
                    author: "Admin",
                    metaTitle: "Home - Mandala Bumantara",
                    metaDescription: "Welcome to Mandala Bumantara - Building digital experiences"
                },
                "about": {
                    title: "About",
                    slug: "about",
                    content: "Our company started with a simple vision to bridge digital gaps.",
                    excerpt: "Learn about our company and mission",
                    status: "published",
                    visibility: "public",
                    author: "Admin",
                    metaTitle: "About Us - Mandala Bumantara",
                    metaDescription: "Learn about Mandala Bumantara's mission and vision"
                },
                "contact": {
                    title: "Contact",
                    slug: "contact",
                    content: "Get in touch with us for any inquiries or collaborations.",
                    excerpt: "Contact information and form",
                    status: "published",
                    visibility: "public",
                    author: "Editor",
                    metaTitle: "Contact - Mandala Bumantara",
                    metaDescription: "Get in touch with Mandala Bumantara"
                },
                "gallery": {
                    title: "Gallery",
                    slug: "gallery",
                    content: "Visual portfolio of our latest projects and explorations.",
                    excerpt: "Project gallery and portfolio",
                    status: "published",
                    visibility: "public",
                    author: "Admin",
                    metaTitle: "Gallery - Mandala Bumantara",
                    metaDescription: "Explore our project gallery and portfolio"
                },
                "vistara": {
                    title: "Vistara",
                    slug: "vistara",
                    content: "Comprehensive details about the Vistara project and its impact.",
                    excerpt: "Vistara project details",
                    status: "published",
                    visibility: "public",
                    author: "Admin",
                    metaTitle: "Vistara - Mandala Bumantara",
                    metaDescription: "Learn about the Vistara project"
                },
                "mandala-bumi-nusantara": {
                    title: "Mandala Bumi Nusantara",
                    slug: "mandala-bumi-nusantara",
                    content: "Geographical and cultural context of our flagship initiative.",
                    excerpt: "Mandala Bumi Nusantara project overview",
                    status: "published",
                    visibility: "public",
                    author: "Admin",
                    metaTitle: "Mandala Bumi Nusantara",
                    metaDescription: "Discover the Mandala Bumi Nusantara initiative"
                }
            };

            if (slug === "new") {
                setFormData({
                    title: "",
                    slug: "",
                    content: "",
                    excerpt: "",
                    status: "draft",
                    visibility: "public",
                    featuredImage: "",
                    template: "default",
                    parentPage: "",
                    order: 0,
                    metaTitle: "",
                    metaDescription: "",
                    keywords: "",
                    author: "Admin"
                });
            } else if (mockData[slug as string]) {
                setFormData({ ...formData, ...mockData[slug as string] });
            }
            setIsLoading(false);
        }, 500);
    }, [slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePublish = () => {
        console.log("Publishing page:", formData);
        // Handle publish logic
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/main/pages"
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {slug === "new" ? "Add New Page" : "Edit Page"}
                            </h1>
                            <p className="text-slate-500 text-sm">
                                {slug === "new" ? "Create a new page for your website" : `Editing: ${formData.title}`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Add title"
                                className="w-full text-3xl font-bold border-none focus:ring-0 p-0 placeholder-slate-300 text-slate-900"
                            />
                            <div className="flex items-center mt-4 text-sm text-slate-500">
                                <span className="mr-2">Permalink:</span>
                                <span className="text-indigo-600">/{formData.slug || "page-slug"}</span>
                                <button className="ml-2 text-indigo-600 hover:text-indigo-700">Edit</button>
                            </div>
                        </div>

                        {/* Content Editor */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center space-x-2">
                                <button className="p-2 hover:bg-slate-200 rounded text-slate-600">
                                    <b className="font-bold">B</b>
                                </button>
                                <button className="p-2 hover:bg-slate-200 rounded text-slate-600">
                                    <i className="italic">I</i>
                                </button>
                                <button className="p-2 hover:bg-slate-200 rounded text-slate-600">
                                    <u className="underline">U</u>
                                </button>
                                <div className="w-px h-4 bg-slate-300 mx-2"></div>
                                <button className="p-2 hover:bg-slate-200 rounded text-slate-600 text-xs font-medium">H1</button>
                                <button className="p-2 hover:bg-slate-200 rounded text-slate-600 text-xs font-medium">H2</button>
                                <button className="p-2 hover:bg-slate-200 rounded text-slate-600 text-xs font-medium">Link</button>
                                <div className="w-px h-4 bg-slate-300 mx-2"></div>
                                <button className="p-2 hover:bg-slate-200 rounded text-slate-600 text-xs font-medium">Add Media</button>
                            </div>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={16}
                                placeholder="Start writing your content..."
                                className="w-full px-6 py-4 border-none focus:ring-0 resize-none text-slate-700 leading-relaxed"
                            ></textarea>
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Excerpt</h3>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Write a short excerpt for this page..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-700"
                            ></textarea>
                            <p className="text-xs text-slate-500 mt-2">Excerpts are optional hand-crafted summaries of your content.</p>
                        </div>

                        {/* SEO Settings */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">SEO Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Page title for search engines"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                                        placeholder="Brief description for search engines"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
                                    <input
                                        type="text"
                                        name="keywords"
                                        value={formData.keywords}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Panel */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Publish</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Status:</span>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Visibility:</span>
                                    <select
                                        name="visibility"
                                        value={formData.visibility}
                                        onChange={handleChange}
                                        className="text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="password">Password Protected</option>
                                    </select>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <button
                                        onClick={handlePublish}
                                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        {formData.status === 'published' ? 'Update' : 'Publish'}
                                    </button>
                                    <button className="w-full mt-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-medium rounded-lg transition-colors">
                                        Save Draft
                                    </button>
                                    {slug !== "new" && (
                                        <button className="w-full mt-2 px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors">
                                            Move to Trash
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Featured Image</h3>
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-slate-900">Set featured image</p>
                                <p className="text-xs text-slate-500 mt-1">Click to upload</p>
                            </div>
                        </div>

                        {/* Page Attributes */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Page Attributes</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Parent Page</label>
                                    <select
                                        name="parentPage"
                                        value={formData.parentPage}
                                        onChange={handleChange}
                                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">None</option>
                                        <option value="home">Home</option>
                                        <option value="about">About</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                                    <select
                                        name="template"
                                        value={formData.template}
                                        onChange={handleChange}
                                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="default">Default Template</option>
                                        <option value="full-width">Full Width</option>
                                        <option value="landing">Landing Page</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Pages are ordered numerically</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
