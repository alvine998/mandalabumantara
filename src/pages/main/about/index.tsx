import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface Value {
    icon: string;
    title: string;
    description: string;
}

interface Advantage {
    title: string;
    description: string;
}

interface AboutPageData {
    hero: {
        title: string;
        subtitle: string;
    };
    story: {
        title: string;
        paragraphs: string[];
    };
    values: {
        title: string;
        items: Value[];
    };
    whyChooseUs: {
        title: string;
        description: string;
        advantages: Advantage[];
    };
    cta: {
        title: string;
        description: string;
        primaryButtonLabel: string;
        primaryButtonLink: string;
        secondaryButtonLabel: string;
        secondaryButtonLink: string;
    };
}

const defaultData: AboutPageData = {
    hero: {
        title: "Tentang Kami",
        subtitle: "Membangun masa depan properti Indonesia dengan integritas dan inovasi",
    },
    story: {
        title: "Kisah Kami",
        paragraphs: [
            "Mandala Bumantara lahir dari visi untuk menciptakan ekosistem properti yang terintegrasi dan berkelanjutan di Indonesia. Dengan pengalaman lebih dari 15 tahun di industri properti, kami telah berkembang menjadi perusahaan yang menyediakan solusi lengkap dari hulu ke hilir.",
            'Nama "Mandala" melambangkan kesempurnaan dan keseimbangan, sementara "Bumantara" menegaskan komitmen kami terhadap Bumi Nusantara. Kami percaya bahwa setiap properti yang kami kembangkan harus memberikan nilai jangka panjang bagi pemiliknya dan kontribusi positif bagi lingkungan sekitar.',
        ],
    },
    values: {
        title: "Nilai-Nilai Kami",
        items: [
            { icon: "🎯", title: "Integritas", description: "Kami berkomitmen pada transparansi dan kejujuran dalam setiap transaksi dan hubungan bisnis." },
            { icon: "🏆", title: "Kualitas", description: "Standar kualitas tinggi dalam setiap proyek, dari material hingga hasil akhir konstruksi." },
            { icon: "💡", title: "Inovasi", description: "Terus berinovasi dengan teknologi dan metode terbaru dalam industri properti." },
            { icon: "❤️", title: "Kepuasan Pelanggan", description: "Mengutamakan kepuasan pelanggan dengan layanan terbaik dan responsif." },
        ],
    },
    whyChooseUs: {
        title: "Mengapa Memilih Kami",
        description: "Sebagai perusahaan properti terintegrasi, kami menawarkan keunggulan yang membedakan kami dari kompetitor:",
        advantages: [
            { title: "Solusi End-to-End", description: "Dari konsultasi, pembangunan, hingga perawatan dalam satu ekosistem" },
            { title: "Tim Profesional", description: "Arsitek, engineer, dan konsultan berpengalaman dengan sertifikasi internasional" },
            { title: "Track Record Terbukti", description: "500+ unit terjual dan 98% tingkat kepuasan pelanggan" },
            { title: "Teknologi Modern", description: "Menggunakan BIM, smart home technology, dan sustainable building practices" },
            { title: "Lokasi Strategis", description: "Fokus pada area premium dengan potensi pertumbuhan tinggi" },
        ],
    },
    cta: {
        title: "Mari Wujudkan Impian Properti Anda",
        description: "Bergabunglah dengan ratusan klien yang telah mempercayai Mandala Bumantara untuk investasi dan hunian mereka. Tim kami siap membantu Anda.",
        primaryButtonLabel: "Hubungi Kami",
        primaryButtonLink: "/contact",
        secondaryButtonLabel: "Lihat Galeri Proyek",
        secondaryButtonLink: "/gallery",
    },
};

type TabType = "hero" | "story" | "values" | "whyChooseUs" | "cta";

export default function AboutPageEditor() {
    const [data, setData] = useState<AboutPageData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("hero");
    const { showToast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                const docRef = doc(db, "pages", "about");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData({ ...defaultData, ...docSnap.data() } as AboutPageData);
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

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, "pages", "about");
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
        { id: "hero" as TabType, label: "Hero", icon: "🎯" },
        { id: "story" as TabType, label: "Story", icon: "📖" },
        { id: "values" as TabType, label: "Values", icon: "💎" },
        { id: "whyChooseUs" as TabType, label: "Why Choose Us", icon: "✓" },
        { id: "cta" as TabType, label: "CTA", icon: "📢" },
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">About Page Editor</h1>
                    <p className="text-slate-500 mt-1">Customize your about page content</p>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/about"
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
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
                    {/* Hero Tab */}
                    {activeTab === "hero" && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={data.hero.title}
                                    onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
                                <textarea
                                    value={data.hero.subtitle}
                                    onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Story Tab */}
                    {activeTab === "story" && (
                        <div className="space-y-6">
                            <div className="max-w-2xl">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
                                <input
                                    type="text"
                                    value={data.story.title}
                                    onChange={(e) => setData({ ...data, story: { ...data.story, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Paragraphs</h3>
                                    <button
                                        onClick={() => setData({ ...data, story: { ...data.story, paragraphs: [...data.story.paragraphs, ""] } })}
                                        className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                                    >
                                        + Add Paragraph
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {data.story.paragraphs.map((paragraph, index) => (
                                        <div key={index} className="flex gap-3">
                                            <textarea
                                                value={paragraph}
                                                onChange={(e) => {
                                                    const newParagraphs = [...data.story.paragraphs];
                                                    newParagraphs[index] = e.target.value;
                                                    setData({ ...data, story: { ...data.story, paragraphs: newParagraphs } });
                                                }}
                                                rows={3}
                                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                placeholder={`Paragraph ${index + 1}`}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newParagraphs = data.story.paragraphs.filter((_, i) => i !== index);
                                                    setData({ ...data, story: { ...data.story, paragraphs: newParagraphs } });
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Values Tab */}
                    {activeTab === "values" && (
                        <div className="space-y-6">
                            <div className="max-w-2xl">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
                                <input
                                    type="text"
                                    value={data.values.title}
                                    onChange={(e) => setData({ ...data, values: { ...data.values, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Values</h3>
                                    <button
                                        onClick={() => setData({ ...data, values: { ...data.values, items: [...data.values.items, { icon: "⭐", title: "", description: "" }] } })}
                                        className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                                    >
                                        + Add Value
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.values.items.map((value, index) => (
                                        <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex items-start gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Icon</label>
                                                    <input
                                                        type="text"
                                                        value={value.icon}
                                                        onChange={(e) => {
                                                            const newItems = [...data.values.items];
                                                            newItems[index].icon = e.target.value;
                                                            setData({ ...data, values: { ...data.values, items: newItems } });
                                                        }}
                                                        className="w-16 px-3 py-2 border border-slate-200 rounded-lg text-2xl text-center"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={value.title}
                                                        onChange={(e) => {
                                                            const newItems = [...data.values.items];
                                                            newItems[index].title = e.target.value;
                                                            setData({ ...data, values: { ...data.values, items: newItems } });
                                                        }}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newItems = data.values.items.filter((_, i) => i !== index);
                                                        setData({ ...data, values: { ...data.values, items: newItems } });
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="mt-3">
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                                                <textarea
                                                    value={value.description}
                                                    onChange={(e) => {
                                                        const newItems = [...data.values.items];
                                                        newItems[index].description = e.target.value;
                                                        setData({ ...data, values: { ...data.values, items: newItems } });
                                                    }}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Why Choose Us Tab */}
                    {activeTab === "whyChooseUs" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
                                    <input
                                        type="text"
                                        value={data.whyChooseUs.title}
                                        onChange={(e) => setData({ ...data, whyChooseUs: { ...data.whyChooseUs, title: e.target.value } })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                    <textarea
                                        value={data.whyChooseUs.description}
                                        onChange={(e) => setData({ ...data, whyChooseUs: { ...data.whyChooseUs, description: e.target.value } })}
                                        rows={2}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Advantages</h3>
                                    <button
                                        onClick={() => setData({ ...data, whyChooseUs: { ...data.whyChooseUs, advantages: [...data.whyChooseUs.advantages, { title: "", description: "" }] } })}
                                        className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                                    >
                                        + Add Advantage
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.whyChooseUs.advantages.map((advantage, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                                            <span className="text-amber-500 font-bold mt-2">✓</span>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={advantage.title}
                                                    onChange={(e) => {
                                                        const newAdvantages = [...data.whyChooseUs.advantages];
                                                        newAdvantages[index].title = e.target.value;
                                                        setData({ ...data, whyChooseUs: { ...data.whyChooseUs, advantages: newAdvantages } });
                                                    }}
                                                    placeholder="Title (bold)"
                                                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                                                />
                                                <input
                                                    type="text"
                                                    value={advantage.description}
                                                    onChange={(e) => {
                                                        const newAdvantages = [...data.whyChooseUs.advantages];
                                                        newAdvantages[index].description = e.target.value;
                                                        setData({ ...data, whyChooseUs: { ...data.whyChooseUs, advantages: newAdvantages } });
                                                    }}
                                                    placeholder="Description"
                                                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newAdvantages = data.whyChooseUs.advantages.filter((_, i) => i !== index);
                                                    setData({ ...data, whyChooseUs: { ...data.whyChooseUs, advantages: newAdvantages } });
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CTA Tab */}
                    {activeTab === "cta" && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={data.cta.title}
                                    onChange={(e) => setData({ ...data, cta: { ...data.cta, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={data.cta.description}
                                    onChange={(e) => setData({ ...data, cta: { ...data.cta, description: e.target.value } })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Buttons</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-indigo-50 rounded-lg">
                                        <h4 className="font-medium text-indigo-900 mb-3">Primary Button</h4>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={data.cta.primaryButtonLabel}
                                                onChange={(e) => setData({ ...data, cta: { ...data.cta, primaryButtonLabel: e.target.value } })}
                                                placeholder="Button Label"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                            <input
                                                type="text"
                                                value={data.cta.primaryButtonLink}
                                                onChange={(e) => setData({ ...data, cta: { ...data.cta, primaryButtonLink: e.target.value } })}
                                                placeholder="Button Link"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-100 rounded-lg">
                                        <h4 className="font-medium text-slate-900 mb-3">Secondary Button</h4>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={data.cta.secondaryButtonLabel}
                                                onChange={(e) => setData({ ...data, cta: { ...data.cta, secondaryButtonLabel: e.target.value } })}
                                                placeholder="Button Label"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                            <input
                                                type="text"
                                                value={data.cta.secondaryButtonLink}
                                                onChange={(e) => setData({ ...data, cta: { ...data.cta, secondaryButtonLink: e.target.value } })}
                                                placeholder="Button Link"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
