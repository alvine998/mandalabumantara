import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";

export default function Dashboard() {
    const stats = [
        {
            label: "News",
            value: "Articles",
            icon: "📰",
            href: "/main/news",
            color: "indigo"
        },
        {
            label: "Gallery",
            value: "Projects",
            icon: "🖼️",
            href: "/main/gallery",
            color: "emerald"
        },
        {
            label: "Users",
            value: "Accounts",
            icon: "👥",
            href: "/main/users",
            color: "cyan"
        },
        {
            label: "Organizations",
            value: "Members",
            icon: "🏢",
            href: "/main/organizations",
            color: "purple"
        },
        {
            label: "Sub Companies",
            value: "Brands",
            icon: "🏭",
            href: "/main/sub-companies",
            color: "amber"
        },
        {
            label: "Divisions",
            value: "Units",
            icon: "🏗️",
            href: "/main/divisions",
            color: "rose"
        }
    ];

    const quickActions = [
        {
            label: "New Article",
            icon: "📝",
            href: "/main/news/new",
            color: "indigo"
        },
        {
            label: "New Gallery",
            icon: "🎨",
            href: "/main/gallery",
            color: "emerald"
        },
        {
            label: "Settings",
            icon: "⚙️",
            href: "/main/settings",
            color: "slate"
        },
        {
            label: "View Site",
            icon: "🌐",
            href: "/",
            color: "purple",
            external: true
        }
    ];

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">Welcome back! Manage your website content from here.</p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Content Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <Link
                            key={index}
                            href={stat.href}
                            className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                </div>
                                <div className="text-4xl group-hover:scale-110 transition-transform">
                                    {stat.icon}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            target={action.external ? "_blank" : undefined}
                            className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-200 text-center"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                                {action.icon}
                            </div>
                            <div className="text-sm font-medium text-slate-900">{action.label}</div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CMS Modules */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">CMS Modules</h2>
                    <div className="space-y-3">
                        <Link
                            href="/main/news"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📰</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">News Management</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/main/gallery"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🖼️</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">Gallery Management</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/main/organizations"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🏢</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">Organization</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/main/sub-companies"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🏭</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">Sub Companies</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/main/divisions"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🏗️</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">Divisions</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/main/benefits"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✨</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">Benefits</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* System Links */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">System</h2>
                    <div className="space-y-3">
                        <Link
                            href="/main/users"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">👥</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">User Management</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/main/emails"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📧</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">Email Inbox</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/main/settings"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⚙️</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">Settings</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🌐</span>
                                <span className="font-medium text-slate-900 group-hover:text-amber-600">View Public Site</span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
