import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface HeroSection {
    badge: string;
    title: string;
    titleGradient: string;
    description: string;
    videoUrl: string; // legacy support if needed
    videoUrlMobile: string;
    videoUrlDesktop: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    secondaryButtonLink: string;
}

interface Stat {
    value: string;
    label: string;
}

interface OverviewSection {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    secondaryButtonLink: string;
    stats: Stat[];
}

interface Division {
    icon: string;
    title: string;
    description: string;
}

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface HomePageData {
    hero: HeroSection;
    overview: OverviewSection;
    divisions: Division[];
    features: Feature[];
}

const defaultData: HomePageData = {
    hero: {
        badge: "✨ Welcome to the Future",
        title: "Experiences",
        titleGradient: "Build Amazing",
        description: "Create stunning web experiences with smooth transitions and beautiful design.",
        videoUrl: "https://firebasestorage.googleapis.com/v0/b/sales-midland.firebasestorage.app/o/Konten%201%20vistara.mp4?alt=media&token=adc090e2-c7e6-4f88-981e-fa5432a9ce6d",
        videoUrlMobile: "https://firebasestorage.googleapis.com/v0/b/sales-midland.firebasestorage.app/o/Konten%201%20vistara.mp4?alt=media&token=adc090e2-c7e6-4f88-981e-fa5432a9ce6d",
        videoUrlDesktop: "https://firebasestorage.googleapis.com/v0/b/sales-midland.firebasestorage.app/o/Konten%201%20vistara.mp4?alt=media&token=adc090e2-c7e6-4f88-981e-fa5432a9ce6d",
        primaryButtonLabel: "Start Building",
        secondaryButtonLabel: "Explore Features",
        secondaryButtonLink: "/features",
    },
    overview: {
        badge: "🏢 Solusi Properti Terintegrasi",
        title: "Mandala Bumantara",
        subtitle: "Ekosistem Properti Terpadu",
        description: "Dari konsultasi hingga perawatan, kami menyediakan solusi properti menyeluruh dengan standar kualitas terbaik dan komitmen kepada kepuasan pelanggan.",
        primaryButtonLabel: "Konsultasi Gratis",
        secondaryButtonLabel: "Tentang Kami",
        secondaryButtonLink: "/mandala-bumi-nusantara",
        stats: [
            { value: "500+", label: "Unit Terjual" },
            { value: "50+", label: "Proyek Selesai" },
            { value: "98%", label: "Kepuasan Klien" },
            { value: "15+", label: "Tahun Pengalaman" },
        ],
    },
    divisions: [
        { icon: "🏗️", title: "Developer", description: "Pengembangan dan penjualan properti berkualitas dengan lokasi strategis dan desain modern." },
        { icon: "👷", title: "Kontraktor", description: "Jasa konstruksi profesional with standar kualitas tinggi, tepat waktu, dan sesuai anggaran." },
        { icon: "🎨", title: "Interior", description: "Layanan desain dan konstruksi interior untuk meningkatkan nilai dan estetika properti Anda." },
        { icon: "💼", title: "Konsultan", description: "Saran ahli tentang investasi, pengembangan, dan manajemen properti yang optimal." },
        { icon: "📦", title: "Material", description: "Penyedia material bangunan berkualitas premium dengan harga kompetitif dan pengiriman cepat." },
        { icon: "🏠", title: "Home Service", description: "Layanan perawatan dan perbaikan rumah untuk kenyamanan hunian modern Anda." },
    ],
    features: [
        { icon: "🎯", title: "Lokasi Strategis", description: "Properti berlokasi di area premium dengan akses mudah ke pusat bisnis, pendidikan, dan fasilitas umum." },
        { icon: "🏆", title: "Kualitas Terjamin", description: "Standar konstruksi internasional dengan material berkualitas tinggi and pengawasan ketat." },
        { icon: "💎", title: "Investasi Menguntungkan", description: "Nilai properti yang terus meningkat dengan ROI yang menarik untuk investor jangka panjang." },
    ],
};

type TabType = "hero" | "overview" | "divisions" | "features";

export default function HomePageEditor() {
    const [data, setData] = useState<HomePageData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("hero");
    const { showToast } = useToast();

    // Load data from Firestore
    useEffect(() => {
        const loadData = async () => {
            try {
                const docRef = doc(db, "pages", "home");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData({ ...defaultData, ...docSnap.data() } as HomePageData);
                }
            } catch (error) {
                console.error("Error loading data:", error);
                showToast("Failed to load data", "error");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Save data to Firestore
    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, "pages", "home");
            await setDoc(docRef, data);
            showToast("Changes saved successfully!", "success");
        } catch (error) {
            console.error("Error saving data:", error);
            showToast("Failed to save changes", "error");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: "hero" as TabType, label: "Hero Section", icon: "🎬" },
        { id: "overview" as TabType, label: "Company Overview", icon: "🏢" },
        { id: "divisions" as TabType, label: "Business Divisions", icon: "🧩" },
        { id: "features" as TabType, label: "Features", icon: "⭐" },
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Home Page Editor</h1>
                    <p className="text-slate-500 mt-1">Customize your homepage content and appearance</p>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/"
                        target="_blank"
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Preview
                    </a>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Hero Section Tab */}
                    {activeTab === "hero" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Badge Text</label>
                                    <input
                                        type="text"
                                        value={data.hero.badge}
                                        onChange={(e) => setData({ ...data, hero: { ...data.hero, badge: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Desktop Video URL</label>
                                    <input
                                        type="text"
                                        value={data.hero.videoUrlDesktop}
                                        onChange={(e) => setData({ ...data, hero: { ...data.hero, videoUrlDesktop: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Video URL</label>
                                    <input
                                        type="text"
                                        value={data.hero.videoUrlMobile}
                                        onChange={(e) => setData({ ...data, hero: { ...data.hero, videoUrlMobile: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Title (Gradient)</label>
                                    <input
                                        type="text"
                                        value={data.hero.titleGradient}
                                        onChange={(e) => setData({ ...data, hero: { ...data.hero, titleGradient: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={data.hero.title}
                                        onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={data.hero.description}
                                    onChange={(e) => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Primary Button</label>
                                    <input
                                        type="text"
                                        value={data.hero.primaryButtonLabel}
                                        onChange={(e) => setData({ ...data, hero: { ...data.hero, primaryButtonLabel: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Secondary Button</label>
                                    <input
                                        type="text"
                                        value={data.hero.secondaryButtonLabel}
                                        onChange={(e) => setData({ ...data, hero: { ...data.hero, secondaryButtonLabel: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Secondary Button Link</label>
                                    <input
                                        type="text"
                                        value={data.hero.secondaryButtonLink}
                                        onChange={(e) => setData({ ...data, hero: { ...data.hero, secondaryButtonLink: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Overview Section Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Badge</label>
                                    <input
                                        type="text"
                                        value={data.overview.badge}
                                        onChange={(e) => setData({ ...data, overview: { ...data.overview, badge: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={data.overview.title}
                                        onChange={(e) => setData({ ...data, overview: { ...data.overview, title: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    value={data.overview.subtitle}
                                    onChange={(e) => setData({ ...data, overview: { ...data.overview, subtitle: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={data.overview.description}
                                    onChange={(e) => setData({ ...data, overview: { ...data.overview, description: e.target.value } })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Statistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {data.overview.stats.map((stat, index) => (
                                        <div key={index} className="p-4 bg-slate-50 rounded-lg">
                                            <input
                                                type="text"
                                                value={stat.value}
                                                onChange={(e) => {
                                                    const newStats = [...data.overview.stats];
                                                    newStats[index].value = e.target.value;
                                                    setData({ ...data, overview: { ...data.overview, stats: newStats } });
                                                }}
                                                placeholder="Value"
                                                className="w-full px-3 py-2 mb-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-center font-bold"
                                            />
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) => {
                                                    const newStats = [...data.overview.stats];
                                                    newStats[index].label = e.target.value;
                                                    setData({ ...data, overview: { ...data.overview, stats: newStats } });
                                                }}
                                                placeholder="Label"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-center text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Divisions Tab */}
                    {activeTab === "divisions" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-900">Business Divisions</h3>
                                <button
                                    onClick={() => setData({ ...data, divisions: [...data.divisions, { icon: "🏢", title: "", description: "" }] })}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                                >
                                    + Add Division
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.divisions.map((division, index) => (
                                    <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-start gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Icon</label>
                                                <input
                                                    type="text"
                                                    value={division.icon}
                                                    onChange={(e) => {
                                                        const newDivisions = [...data.divisions];
                                                        newDivisions[index].icon = e.target.value;
                                                        setData({ ...data, divisions: newDivisions });
                                                    }}
                                                    className="w-16 px-3 py-2 border border-slate-200 rounded-lg text-2xl text-center"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={division.title}
                                                    onChange={(e) => {
                                                        const newDivisions = [...data.divisions];
                                                        newDivisions[index].title = e.target.value;
                                                        setData({ ...data, divisions: newDivisions });
                                                    }}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newDivisions = data.divisions.filter((_, i) => i !== index);
                                                    setData({ ...data, divisions: newDivisions });
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                                            <textarea
                                                value={division.description}
                                                onChange={(e) => {
                                                    const newDivisions = [...data.divisions];
                                                    newDivisions[index].description = e.target.value;
                                                    setData({ ...data, divisions: newDivisions });
                                                }}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features Tab */}
                    {activeTab === "features" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-900">Why Choose Us - Features</h3>
                                <button
                                    onClick={() => setData({ ...data, features: [...data.features, { icon: "⭐", title: "", description: "" }] })}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                                >
                                    + Add Feature
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {data.features.map((feature, index) => (
                                    <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <input
                                                type="text"
                                                value={feature.icon}
                                                onChange={(e) => {
                                                    const newFeatures = [...data.features];
                                                    newFeatures[index].icon = e.target.value;
                                                    setData({ ...data, features: newFeatures });
                                                }}
                                                className="w-16 px-3 py-2 border border-slate-200 rounded-lg text-2xl text-center"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newFeatures = data.features.filter((_, i) => i !== index);
                                                    setData({ ...data, features: newFeatures });
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={feature.title}
                                            onChange={(e) => {
                                                const newFeatures = [...data.features];
                                                newFeatures[index].title = e.target.value;
                                                setData({ ...data, features: newFeatures });
                                            }}
                                            placeholder="Title"
                                            className="w-full px-3 py-2 mb-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                        />
                                        <textarea
                                            value={feature.description}
                                            onChange={(e) => {
                                                const newFeatures = [...data.features];
                                                newFeatures[index].description = e.target.value;
                                                setData({ ...data, features: newFeatures });
                                            }}
                                            placeholder="Description"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
