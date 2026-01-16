import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface Specification {
    label: string;
    value: string;
}

interface ProjectData {
    title: string;
    slug: string;
    category: string;
    status: "draft" | "published";
    location: string;
    description: string;
    thumbnail: string;
    featured: boolean;
    images: string[];
    features: Feature[];
    specifications: Specification[];
    units: string;
    type: string;
    gradient: string;
    content: string;
}

const defaultProject: ProjectData = {
    title: "",
    slug: "",
    category: "residential",
    status: "draft",
    location: "",
    description: "",
    thumbnail: "",
    featured: false,
    images: [],
    features: [],
    specifications: [],
    units: "",
    type: "",
    gradient: "from-blue-900 to-blue-700",
    content: "",
};

const gradientOptions = [
    { value: "from-blue-900 to-blue-700", label: "Blue" },
    { value: "from-amber-500 to-orange-600", label: "Amber" },
    { value: "from-green-600 to-emerald-700", label: "Green" },
    { value: "from-purple-600 to-indigo-700", label: "Purple" },
    { value: "from-pink-600 to-rose-700", label: "Pink" },
    { value: "from-cyan-600 to-blue-700", label: "Cyan" },
];

type TabType = "general" | "media" | "features" | "specs";

export default function ProjectDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<ProjectData>(defaultProject);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const { showToast } = useToast();

    useEffect(() => {
        if (!id) return;

        const loadProject = async () => {
            try {
                const docRef = doc(db, "projects", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData({ ...defaultProject, ...docSnap.data() } as ProjectData);
                } else {
                    showToast("Project not found", "error");
                    router.push("/main/projects");
                }
            } catch (error) {
                console.error("Error loading project:", error);
                showToast("Failed to load project", "error");
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [id]);

    const handleSave = async () => {
        if (!id) return;
        setSaving(true);
        try {
            const docRef = doc(db, "projects", id as string);
            await updateDoc(docRef, {
                ...data,
                updatedAt: Timestamp.now(),
            });
            showToast("Project saved!", "success");
        } catch (error) {
            console.error("Error saving project:", error);
            showToast("Failed to save project", "error");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!id) return;
        try {
            const newStatus = data.status === "published" ? "draft" : "published";
            const docRef = doc(db, "projects", id as string);
            await updateDoc(docRef, {
                status: newStatus,
                updatedAt: Timestamp.now(),
            });
            setData({ ...data, status: newStatus });
            showToast(newStatus === "published" ? "Project published!" : "Project unpublished", "success");
        } catch (error) {
            console.error("Error updating status:", error);
            showToast("Failed to update status", "error");
        }
    };

    const tabs = [
        { id: "general" as TabType, label: "General", icon: "📝" },
        { id: "media" as TabType, label: "Media", icon: "🖼️" },
        { id: "features" as TabType, label: "Features", icon: "✨" },
        { id: "specs" as TabType, label: "Specifications", icon: "📋" },
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
                <div className="flex items-center gap-4">
                    <Link href="/main/projects" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{data.title || "Untitled Project"}</h1>
                        <p className="text-slate-500 mt-1">/{data.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {data.status === "published" ? "Published" : "Draft"}
                    </span>
                    <button onClick={handlePublish} className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50">
                        {data.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50">
                        {saving ? "Saving..." : "Save"}
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
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            <span className="mr-2">{tab.icon}</span>{tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* General Tab */}
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData({ ...data, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData({ ...data, slug: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData({ ...data, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    >
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="interior">Interior</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData({ ...data, location: e.target.value })}
                                        placeholder="e.g. Jakarta Selatan"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                    <input
                                        type="text"
                                        value={data.type}
                                        onChange={(e) => setData({ ...data, type: e.target.value })}
                                        placeholder="e.g. Apartemen Mewah"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Units/Size</label>
                                    <input
                                        type="text"
                                        value={data.units}
                                        onChange={(e) => setData({ ...data, units: e.target.value })}
                                        placeholder="e.g. 120 Unit"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Color Theme</label>
                                    <div className="flex flex-wrap gap-2">
                                        {gradientOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setData({ ...data, gradient: opt.value })}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center ${data.gradient === opt.value ? "ring-2 ring-offset-2 ring-indigo-500" : ""}`}
                                            >
                                                <span className={`inline-block w-4 h-4 rounded bg-gradient-to-r ${opt.value} mr-2`}></span>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Content</label>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData({ ...data, content: e.target.value })}
                                    rows={8}
                                    placeholder="Write detailed project description..."
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={data.featured}
                                    onChange={(e) => setData({ ...data, featured: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                                    Featured project (show on homepage)
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Media Tab */}
                    {activeTab === "media" && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail URL</label>
                                <input
                                    type="text"
                                    value={data.thumbnail}
                                    onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                                {data.thumbnail && (
                                    <div className="mt-4">
                                        <img src={data.thumbnail} alt="Thumbnail" className="w-48 h-32 object-cover rounded-lg" />
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Gallery Images</h3>
                                    <button
                                        onClick={() => setData({ ...data, images: [...data.images, ""] })}
                                        className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium"
                                    >
                                        + Add Image
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.images.map((image, index) => (
                                        <div key={index} className="flex gap-3 items-center">
                                            <input
                                                type="text"
                                                value={image}
                                                onChange={(e) => {
                                                    const newImages = [...data.images];
                                                    newImages[index] = e.target.value;
                                                    setData({ ...data, images: newImages });
                                                }}
                                                placeholder="Image URL"
                                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg"
                                            />
                                            <button
                                                onClick={() => setData({ ...data, images: data.images.filter((_, i) => i !== index) })}
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

                    {/* Features Tab */}
                    {activeTab === "features" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Project Features</h3>
                                <button
                                    onClick={() => setData({ ...data, features: [...data.features, { icon: "✨", title: "", description: "" }] })}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium"
                                >
                                    + Add Feature
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.features.map((feature, index) => (
                                    <div key={index} className="p-4 bg-slate-50 rounded-xl border">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="text"
                                                value={feature.icon}
                                                onChange={(e) => {
                                                    const newFeatures = [...data.features];
                                                    newFeatures[index].icon = e.target.value;
                                                    setData({ ...data, features: newFeatures });
                                                }}
                                                className="w-14 px-2 py-2 border border-slate-200 rounded-lg text-2xl text-center"
                                            />
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={feature.title}
                                                    onChange={(e) => {
                                                        const newFeatures = [...data.features];
                                                        newFeatures[index].title = e.target.value;
                                                        setData({ ...data, features: newFeatures });
                                                    }}
                                                    placeholder="Feature title"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-2"
                                                />
                                                <textarea
                                                    value={feature.description}
                                                    onChange={(e) => {
                                                        const newFeatures = [...data.features];
                                                        newFeatures[index].description = e.target.value;
                                                        setData({ ...data, features: newFeatures });
                                                    }}
                                                    placeholder="Description"
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                                />
                                            </div>
                                            <button onClick={() => setData({ ...data, features: data.features.filter((_, i) => i !== index) })} className="p-1 text-red-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specifications Tab */}
                    {activeTab === "specs" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Project Specifications</h3>
                                <button
                                    onClick={() => setData({ ...data, specifications: [...data.specifications, { label: "", value: "" }] })}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium"
                                >
                                    + Add Spec
                                </button>
                            </div>
                            <div className="space-y-3">
                                {data.specifications.map((spec, index) => (
                                    <div key={index} className="flex gap-4 items-center p-4 bg-slate-50 rounded-lg">
                                        <input
                                            type="text"
                                            value={spec.label}
                                            onChange={(e) => {
                                                const newSpecs = [...data.specifications];
                                                newSpecs[index].label = e.target.value;
                                                setData({ ...data, specifications: newSpecs });
                                            }}
                                            placeholder="Label (e.g. Luas Tanah)"
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            value={spec.value}
                                            onChange={(e) => {
                                                const newSpecs = [...data.specifications];
                                                newSpecs[index].value = e.target.value;
                                                setData({ ...data, specifications: newSpecs });
                                            }}
                                            placeholder="Value (e.g. 5000 m²)"
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                        <button onClick={() => setData({ ...data, specifications: data.specifications.filter((_, i) => i !== index) })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
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
