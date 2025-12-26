import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { useRouter } from "next/router";

export default function ContentSettings() {
    const [activeTab, setActiveTab] = useState("all");
    const router = useRouter();

    const contentItems = [
        {
            id: 1,
            title: "Home Hero Section",
            type: "Page Section",
            status: "published",
            lastUpdated: "2 mins ago",
            author: "Admin",
            thumbnail: "🏠"
        },
        {
            id: 2,
            title: "About Us Story",
            type: "Page Content",
            status: "published",
            lastUpdated: "2 hours ago",
            author: "Editor",
            thumbnail: "📖"
        },
        {
            id: 3,
            title: "Q4 Marketing Banner",
            type: "Banner",
            status: "draft",
            lastUpdated: "1 day ago",
            author: "Admin",
            thumbnail: "📢"
        },
        {
            id: 4,
            title: "Contact Form Settings",
            type: "Configuration",
            status: "published",
            lastUpdated: "3 days ago",
            author: "Dev",
            thumbnail: "✉️"
        },
        {
            id: 5,
            title: "Feature Grid (Home)",
            type: "Page Section",
            status: "published",
            lastUpdated: "5 days ago",
            author: "Admin",
            thumbnail: "✨"
        },
        {
            id: 6,
            title: "Footer Links",
            type: "Navigation",
            status: "published",
            lastUpdated: "1 week ago",
            author: "Admin",
            thumbnail: "🔗"
        }
    ];

    const tabs = [
        { id: "all", label: "All Content" },
        { id: "pages", label: "Pages" },
        { id: "posts", label: "Posts" },
        { id: "media", label: "Media" },
    ];

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Content Management</h1>
                    <p className="text-slate-500 mt-1">Manage your website content and sections.</p>
                </div>
                <button className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Content
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search content..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 text-slate-600"
                    />
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {contentItems.map((item) => (
                    <div key={item.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative">
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 z-10">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'published'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                }`}>
                                {item.status === 'published' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                        </div>

                        {/* Thumbnail Area */}
                        <div className="h-32 bg-slate-50 border-b border-slate-100 flex items-center justify-center group-hover:bg-indigo-50/50 transition-colors">
                            <span className="text-4xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{item.thumbnail}</span>
                        </div>

                        {/* Content Info */}
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1" title={item.title}>
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500">{item.type}</p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                        {item.author.charAt(0)}
                                    </div>
                                    <span>{item.author}</span>
                                </div>
                                <span>{item.lastUpdated}</span>
                            </div>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3 pointer-events-none group-hover:pointer-events-auto">
                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm" title="Edit">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 hover:scale-105 transition-all shadow-sm" title="Preview" onClick={() => { router.push(`/main/content/${item.id}`) }}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                            <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:scale-105 transition-all shadow-sm" title="Delete">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State Helper (Hidden by default, shown if needed logic added later) */}
            {contentItems.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No content found</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Get started by creating your first piece of content or page section.</p>
                </div>
            )}
        </AdminLayout>
    );
}
