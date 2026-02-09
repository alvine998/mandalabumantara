import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { companyProfileService, CompanyProfile } from "@/lib/services/company-profile-service";
import MediaUpload from "@/components/MediaUpload";

const defaultProfile: CompanyProfile = {
    address: "",
    admin_email: "",
    description: "",
    facebook: "",
    info_email: "",
    instagram: "",
    logo: "",
    mobile_phone: "",
    name: "",
    privacy_policy: "",
    slogan: "",
    term_condition: "",
    tiktok: "",
    youtube: "",
};

type TabType = "general" | "contact" | "social" | "legal";

export default function Settings() {
    const [profile, setProfile] = useState<CompanyProfile>(defaultProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const { showToast } = useToast();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await companyProfileService.getProfile();
                if (data) {
                    setProfile(data);
                }
            } catch (error) {
                console.error("Error loading profile:", error);
                showToast("Failed to load settings", "error");
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await companyProfileService.updateProfile(profile);
            showToast("Settings updated successfully!", "success");
        } catch (error) {
            console.error("Error saving profile:", error);
            showToast("Failed to update settings", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    const tabs = [
        { id: "general" as TabType, label: "General Info", icon: "🏢" },
        { id: "contact" as TabType, label: "Contact Details", icon: "📞" },
        { id: "social" as TabType, label: "Social Media", icon: "📱" },
        { id: "legal" as TabType, label: "Legal & Policies", icon: "⚖️" },
    ];

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Company Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your company's public profile and contact information.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 active:scale-95"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 border-r border-slate-100 bg-slate-50/30">
                    <div className="p-4 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? "bg-white text-indigo-600 shadow-sm border border-slate-100"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
                            >
                                <span className="text-xl">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {activeTab === "general" && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                        placeholder="Mandala Bumantara"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Slogan</label>
                                    <input
                                        type="text"
                                        name="slogan"
                                        value={profile.slogan}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                        placeholder="Building New Experience"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                    <textarea
                                        name="description"
                                        value={profile.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                        placeholder="Describe your company..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <MediaUpload
                                        label="Logo"
                                        value={profile.logo}
                                        onChange={(url) => setProfile({ ...profile, logo: url })}
                                        path="company_profile"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "contact" && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Info Email</label>
                                    <input
                                        type="email"
                                        name="info_email"
                                        value={profile.info_email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                        placeholder="info@mandalabumantara.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Admin Email</label>
                                    <input
                                        type="email"
                                        name="admin_email"
                                        value={profile.admin_email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                        placeholder="admin@mandalabumantara.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mobile Phone</label>
                                    <input
                                        type="text"
                                        name="mobile_phone"
                                        value={profile.mobile_phone}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                        placeholder="6281220150578"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Office Address</label>
                                    <textarea
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                        placeholder="Full office address..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "social" && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: "Instagram", name: "instagram", placeholder: "@username" },
                                    { label: "Facebook", name: "facebook", placeholder: "Facebook URL" },
                                    { label: "TikTok", name: "tiktok", placeholder: "@username" },
                                    { label: "YouTube", name: "youtube", placeholder: "YouTube Channel URL" },
                                ].map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">{field.label}</label>
                                        <input
                                            type="text"
                                            name={field.name}
                                            value={(profile as any)[field.name]}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "legal" && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Privacy Policy</label>
                                <textarea
                                    name="privacy_policy"
                                    value={profile.privacy_policy}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                    placeholder="Enter privacy policy text..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Terms & Conditions</label>
                                <textarea
                                    name="term_condition"
                                    value={profile.term_condition}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-slate-900"
                                    placeholder="Enter terms and conditions text..."
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
