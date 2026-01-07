import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
    const [quickDraft, setQuickDraft] = useState({ title: "", content: "" });

    const stats = [
        {
            label: "Pages",
            value: "6",
            published: 6,
            draft: 0,
            icon: "📄",
            href: "/main/pages",
            color: "indigo"
        },
        {
            label: "Sections",
            value: "6",
            published: 5,
            draft: 1,
            icon: "🧩",
            href: "/main/content",
            color: "emerald"
        },
        {
            label: "Users",
            value: "12",
            active: 8,
            inactive: 4,
            icon: "👥",
            href: "/main/users",
            color: "cyan"
        }
    ];

    const recentPages = [
        { title: "Home", status: "published", modified: "2 hours ago", slug: "home" },
        { title: "About", status: "published", modified: "1 day ago", slug: "about" },
        { title: "Contact", status: "published", modified: "2 days ago", slug: "contact" },
        { title: "Gallery", status: "published", modified: "3 days ago", slug: "gallery" },
        { title: "Vistara", status: "published", modified: "4 days ago", slug: "vistara" }
    ];

    const activities = [
        { user: "Admin", action: "published", item: "Home page", time: "2 hours ago", type: "publish" },
        { user: "Editor", action: "updated", item: "About page", time: "1 day ago", type: "update" },
        { user: "Admin", action: "created", item: "Q4 Marketing Banner", time: "2 days ago", type: "create" },
        { user: "Editor", action: "updated", item: "Contact page", time: "3 days ago", type: "update" },
        { user: "Admin", action: "published", item: "Gallery page", time: "4 days ago", type: "publish" }
    ];

    const handleQuickDraft = () => {
        console.log("Saving quick draft:", quickDraft);
        setQuickDraft({ title: "", content: "" });
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your site.</p>
            </div>

            {/* At a Glance */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">At a Glance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <Link
                            key={index}
                            href={stat.href}
                            className="group p-6 rounded-xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`text-4xl group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                                {stat.published !== undefined && (
                                    <>
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                                            {stat.published} Published
                                        </span>
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
                                            {stat.draft} Draft
                                        </span>
                                    </>
                                )}
                                {stat.active !== undefined && (
                                    <>
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                                            {stat.active} Active
                                        </span>
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-slate-400 mr-1.5"></span>
                                            {stat.inactive} Inactive
                                        </span>
                                    </>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Quick Draft */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Draft</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={quickDraft.title}
                            onChange={(e) => setQuickDraft({ ...quickDraft, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <textarea
                            placeholder="What's on your mind?"
                            value={quickDraft.content}
                            onChange={(e) => setQuickDraft({ ...quickDraft, content: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all"
                        ></textarea>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleQuickDraft}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={() => setQuickDraft({ title: "", content: "" })}
                                className="text-sm text-slate-500 hover:text-slate-700"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/main/pages/new"
                            className="group p-4 rounded-lg border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200 text-center"
                        >
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                            <div className="text-sm font-medium text-slate-900">New Page</div>
                        </Link>
                        <Link
                            href="/main/content/new"
                            className="group p-4 rounded-lg border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-200 text-center"
                        >
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧩</div>
                            <div className="text-sm font-medium text-slate-900">New Section</div>
                        </Link>
                        <Link
                            href="/main/pages"
                            className="group p-4 rounded-lg border-2 border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all duration-200 text-center"
                        >
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                            <div className="text-sm font-medium text-slate-900">All Pages</div>
                        </Link>
                        <Link
                            href="/"
                            target="_blank"
                            className="group p-4 rounded-lg border-2 border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200 text-center"
                        >
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌐</div>
                            <div className="text-sm font-medium text-slate-900">View Site</div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Pages */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Recent Pages</h2>
                        <Link href="/main/pages" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentPages.map((page, index) => (
                            <Link
                                key={index}
                                href={`/main/pages/${page.slug}`}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                        {page.title}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {page.modified}
                                    </div>
                                </div>
                                <span className={`ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${page.status === 'published'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {page.status === 'published' && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                                    )}
                                    {page.status}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                    </div>
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'publish' ? 'bg-emerald-100 text-emerald-600' :
                                        activity.type === 'create' ? 'bg-indigo-100 text-indigo-600' :
                                            'bg-amber-100 text-amber-600'
                                    }`}>
                                    {activity.type === 'publish' && '✓'}
                                    {activity.type === 'create' && '+'}
                                    {activity.type === 'update' && '↻'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-900">
                                        <span className="font-semibold">{activity.user}</span>
                                        {' '}{activity.action}{' '}
                                        <span className="font-medium">{activity.item}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
