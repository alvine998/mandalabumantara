import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ContactInfo {
    icon: string;
    title: string;
    value: string;
}

interface SocialLink {
    name: string;
    url: string;
}

interface ContactPageData {
    hero: {
        title: string;
        subtitle: string;
    };
    form: {
        title: string;
        buttonLabel: string;
        successMessage: string;
    };
    contactInfo: {
        title: string;
        items: ContactInfo[];
    };
    social: {
        title: string;
        links: SocialLink[];
    };
}

const defaultData: ContactPageData = {
    hero: {
        title: "Get in Touch",
        subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    },
    form: {
        title: "Send us a message",
        buttonLabel: "Send Message",
        successMessage: "Thank you! Your message has been sent successfully.",
    },
    contactInfo: {
        title: "Contact Information",
        items: [
            { icon: "📧", title: "Email", value: "hello@mandala.com" },
            { icon: "📞", title: "Phone", value: "+62 21 1234 5678" },
            { icon: "📍", title: "Address", value: "Jl. Sudirman No. 123\nJakarta Pusat, 10220" },
        ],
    },
    social: {
        title: "Follow Us",
        links: [
            { name: "Instagram", url: "https://instagram.com" },
            { name: "Facebook", url: "https://facebook.com" },
            { name: "LinkedIn", url: "https://linkedin.com" },
        ],
    },
};

type TabType = "hero" | "form" | "contactInfo" | "social";

export default function ContactPageEditor() {
    const [data, setData] = useState<ContactPageData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("hero");
    const { showToast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                const docRef = doc(db, "pages", "contact");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData({ ...defaultData, ...docSnap.data() } as ContactPageData);
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
            const docRef = doc(db, "pages", "contact");
            await setDoc(docRef, data);
            showToast("Changes saved!", "success");
        } catch (error) {
            console.error("Error saving data:", error);
            showToast("Failed to save changes", "error");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: "hero" as TabType, label: "Hero", icon: "🎯" },
        { id: "form" as TabType, label: "Form Settings", icon: "📝" },
        { id: "contactInfo" as TabType, label: "Contact Info", icon: "📞" },
        { id: "social" as TabType, label: "Social Links", icon: "🌐" },
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
                    <h1 className="text-2xl font-bold text-slate-900">Contact Page Editor</h1>
                    <p className="text-slate-500 mt-1">Customize contact page content</p>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/main/contact/submissions" className="px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 font-medium">
                        View Submissions
                    </a>
                    <a href="/contact" target="_blank" className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                        Preview
                    </a>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50">
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

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
                    {/* Hero Tab */}
                    {activeTab === "hero" && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={data.hero.title}
                                    onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
                                <textarea
                                    value={data.hero.subtitle}
                                    onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    {/* Form Settings Tab */}
                    {activeTab === "form" && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Form Title</label>
                                <input
                                    type="text"
                                    value={data.form.title}
                                    onChange={(e) => setData({ ...data, form: { ...data.form, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Submit Button Label</label>
                                <input
                                    type="text"
                                    value={data.form.buttonLabel}
                                    onChange={(e) => setData({ ...data, form: { ...data.form, buttonLabel: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Success Message</label>
                                <textarea
                                    value={data.form.successMessage}
                                    onChange={(e) => setData({ ...data, form: { ...data.form, successMessage: e.target.value } })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    {/* Contact Info Tab */}
                    {activeTab === "contactInfo" && (
                        <div className="space-y-6">
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
                                <input
                                    type="text"
                                    value={data.contactInfo.title}
                                    onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Contact Items</h3>
                                    <button
                                        onClick={() => setData({ ...data, contactInfo: { ...data.contactInfo, items: [...data.contactInfo.items, { icon: "📧", title: "", value: "" }] } })}
                                        className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {data.contactInfo.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                                            <input
                                                type="text"
                                                value={item.icon}
                                                onChange={(e) => {
                                                    const newItems = [...data.contactInfo.items];
                                                    newItems[index].icon = e.target.value;
                                                    setData({ ...data, contactInfo: { ...data.contactInfo, items: newItems } });
                                                }}
                                                className="w-16 px-3 py-2 border border-slate-200 rounded-lg text-2xl text-center"
                                            />
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const newItems = [...data.contactInfo.items];
                                                    newItems[index].title = e.target.value;
                                                    setData({ ...data, contactInfo: { ...data.contactInfo, items: newItems } });
                                                }}
                                                placeholder="Title"
                                                className="w-32 px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                            <textarea
                                                value={item.value}
                                                onChange={(e) => {
                                                    const newItems = [...data.contactInfo.items];
                                                    newItems[index].value = e.target.value;
                                                    setData({ ...data, contactInfo: { ...data.contactInfo, items: newItems } });
                                                }}
                                                placeholder="Value (use new line for multiple lines)"
                                                rows={2}
                                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                            <button
                                                onClick={() => setData({ ...data, contactInfo: { ...data.contactInfo, items: data.contactInfo.items.filter((_, i) => i !== index) } })}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start"
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

                    {/* Social Links Tab */}
                    {activeTab === "social" && (
                        <div className="space-y-6">
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
                                <input
                                    type="text"
                                    value={data.social.title}
                                    onChange={(e) => setData({ ...data, social: { ...data.social, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Social Links</h3>
                                    <button
                                        onClick={() => setData({ ...data, social: { ...data.social, links: [...data.social.links, { name: "", url: "" }] } })}
                                        className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium"
                                    >
                                        + Add Link
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.social.links.map((link, index) => (
                                        <div key={index} className="flex gap-4 items-center p-4 bg-slate-50 rounded-lg">
                                            <input
                                                type="text"
                                                value={link.name}
                                                onChange={(e) => {
                                                    const newLinks = [...data.social.links];
                                                    newLinks[index].name = e.target.value;
                                                    setData({ ...data, social: { ...data.social, links: newLinks } });
                                                }}
                                                placeholder="Name (e.g. Instagram)"
                                                className="w-40 px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                            <input
                                                type="text"
                                                value={link.url}
                                                onChange={(e) => {
                                                    const newLinks = [...data.social.links];
                                                    newLinks[index].url = e.target.value;
                                                    setData({ ...data, social: { ...data.social, links: newLinks } });
                                                }}
                                                placeholder="URL"
                                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                            <button
                                                onClick={() => setData({ ...data, social: { ...data.social, links: data.social.links.filter((_, i) => i !== index) } })}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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
                </div>
            </div>
        </AdminLayout>
    );
}
