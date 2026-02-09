import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { subCompanyService, SubCompany } from "@/lib/services/sub-company-service";
import Link from "next/link";
import MediaUpload from "@/components/MediaUpload";

type TabType = "general" | "contact" | "social";

export default function SubCompanyDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<SubCompany | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const { showToast } = useToast();

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await subCompanyService.getSubCompanyById(id as string);
            if (result) {
                setData(result);
            } else {
                showToast("Brand not found", "error");
                router.push("/main/sub-companies");
            }
        } catch (error) {
            console.error("Error loading brand:", error);
            showToast("Failed to load brand data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!data || !id) return;
        setSaving(true);
        try {
            const { id: _, created_at, updated_at, ...updateFields } = data as any;
            await subCompanyService.updateSubCompany(id as string, updateFields);
            showToast("Brand details saved!", "success");
        } catch (error) {
            console.error("Error saving brand:", error);
            showToast("Failed to save brands details", "error");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: "general" as TabType, label: "General Info", icon: "🏢" },
        { id: "contact" as TabType, label: "Contact Details", icon: "📞" },
        { id: "social" as TabType, label: "Social Media", icon: "📱" },
    ];

    if (loading || !data) {
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
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/main/sub-companies" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{data.name}</h1>
                        <p className="text-slate-500">Edit sub-company profile</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50 transition-all shadow-sm"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {activeTab === "general" && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                            </div>
                            <div>
                                <MediaUpload
                                    label="Logo"
                                    value={data.logo}
                                    onChange={(url) => setData({ ...data, logo: url })}
                                    path="sub_companies"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    placeholder="Brief about the brand..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "contact" && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    placeholder="brand@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Phone</label>
                                <input
                                    type="text"
                                    value={data.mobile_phone}
                                    onChange={(e) => setData({ ...data, mobile_phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    placeholder="+62 812..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData({ ...data, address: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    placeholder="Full office address..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "social" && (
                        <div className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
                                    <input
                                        type="text"
                                        value={data.instagram}
                                        onChange={(e) => setData({ ...data, instagram: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
                                    <input
                                        type="text"
                                        value={data.facebook}
                                        onChange={(e) => setData({ ...data, facebook: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">TikTok URL</label>
                                    <input
                                        type="text"
                                        value={data.tiktok}
                                        onChange={(e) => setData({ ...data, tiktok: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                        placeholder="https://tiktok.com/@..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
                                    <input
                                        type="text"
                                        value={data.youtube}
                                        onChange={(e) => setData({ ...data, youtube: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
