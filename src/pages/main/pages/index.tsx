import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function PagesManagement() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("all");
    const [selectedPages, setSelectedPages] = useState<number[]>([]);

    const pages = [
        {
            id: 1,
            title: "Home",
            slug: "home",
            author: "Admin",
            status: "published",
            lastModified: "2026-01-07 08:30",
            comments: 0
        },
        {
            id: 2,
            title: "About",
            slug: "about",
            author: "Admin",
            status: "published",
            lastModified: "2026-01-06 14:20",
            comments: 2
        },
        {
            id: 3,
            title: "Contact",
            slug: "contact",
            author: "Editor",
            status: "published",
            lastModified: "2026-01-05 10:15",
            comments: 0
        },
        {
            id: 4,
            title: "Gallery",
            slug: "gallery",
            author: "Admin",
            status: "published",
            lastModified: "2026-01-04 16:45",
            comments: 5
        },
        {
            id: 5,
            title: "Vistara",
            slug: "vistara",
            author: "Admin",
            status: "published",
            lastModified: "2026-01-03 09:30",
            comments: 1
        },
        {
            id: 6,
            title: "Mandala Bumi Nusantara",
            slug: "mandala-bumi-nusantara",
            author: "Admin",
            status: "published",
            lastModified: "2026-01-02 11:00",
            comments: 3
        }
    ];

    const tabs = [
        { id: "all", label: "All", count: pages.length },
        { id: "published", label: "Published", count: pages.filter(p => p.status === "published").length },
        { id: "draft", label: "Draft", count: pages.filter(p => p.status === "draft").length },
        { id: "trash", label: "Trash", count: 0 }
    ];

    const filteredPages = pages.filter(page => {
        if (activeTab === "all") return true;
        return page.status === activeTab;
    });

    const toggleSelectAll = () => {
        if (selectedPages.length === filteredPages.length) {
            setSelectedPages([]);
        } else {
            setSelectedPages(filteredPages.map(p => p.id));
        }
    };

    const toggleSelectPage = (id: number) => {
        if (selectedPages.includes(id)) {
            setSelectedPages(selectedPages.filter(pageId => pageId !== id));
        } else {
            setSelectedPages([...selectedPages, id]);
        }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pages</h1>
                    <p className="text-slate-500 mt-1">Manage your website pages</p>
                </div>
                <Link
                    href="/main/pages/new"
                    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Page
                </Link>
            </div>

            {/* Tabs & Bulk Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
                {/* Tabs */}
                <div className="flex items-center border-b border-slate-200 px-6 py-3 space-x-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-3 -mb-3"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab.label} <span className="text-slate-400">({tab.count})</span>
                        </button>
                    ))}
                </div>

                {/* Bulk Actions Bar */}
                {selectedPages.length > 0 && (
                    <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-indigo-900">
                                {selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'} selected
                            </span>
                            <select className="text-sm border-slate-200 rounded-lg bg-white">
                                <option>Bulk Actions</option>
                                <option>Edit</option>
                                <option>Move to Trash</option>
                            </select>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                Apply
                            </button>
                        </div>
                        <button
                            onClick={() => setSelectedPages([])}
                            className="text-sm text-slate-500 hover:text-slate-700"
                        >
                            Clear selection
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="w-12 px-6 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Comments
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Last Modified
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPages.map((page) => (
                                <tr
                                    key={page.id}
                                    className="group hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedPages.includes(page.id)}
                                            onChange={() => toggleSelectPage(page.id)}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <Link
                                                href={`/main/pages/${page.slug}`}
                                                className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                                            >
                                                {page.title}
                                            </Link>
                                            <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/main/pages/${page.slug}`}
                                                    className="text-xs text-indigo-600 hover:text-indigo-700"
                                                >
                                                    Edit
                                                </Link>
                                                <span className="text-slate-300">|</span>
                                                <button className="text-xs text-slate-600 hover:text-slate-700">
                                                    Quick Edit
                                                </button>
                                                <span className="text-slate-300">|</span>
                                                <button className="text-xs text-red-600 hover:text-red-700">
                                                    Trash
                                                </button>
                                                <span className="text-slate-300">|</span>
                                                <Link
                                                    href={`/${page.slug}`}
                                                    target="_blank"
                                                    className="text-xs text-slate-600 hover:text-slate-700"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{page.author}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.status === 'published'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {page.status === 'published' && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                            )}
                                            {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span>{page.comments}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{page.lastModified}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredPages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No pages found</h3>
                        <p className="text-slate-500 mt-1">Get started by creating your first page.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
