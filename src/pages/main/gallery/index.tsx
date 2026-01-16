import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface Category {
    id: string;
    label: string;
}

interface Project {
    id: number;
    slug: string;
    title: string;
    category: string;
    location: string;
    status: string;
    type: string;
    units: string;
    description: string;
    gradient: string;
}

interface GalleryPageData {
    hero: {
        title: string;
        subtitle: string;
    };
    categories: Category[];
    projects: Project[];
    cta: {
        title: string;
        description: string;
        primaryButtonLabel: string;
        primaryButtonLink: string;
        secondaryButtonLabel: string;
        secondaryButtonLink: string;
    };
}

const gradientOptions = [
    { value: "from-blue-900 to-blue-700", label: "Blue" },
    { value: "from-amber-500 to-orange-600", label: "Amber" },
    { value: "from-green-600 to-emerald-700", label: "Green" },
    { value: "from-purple-600 to-indigo-700", label: "Purple" },
    { value: "from-pink-600 to-rose-700", label: "Pink" },
    { value: "from-cyan-600 to-blue-700", label: "Cyan" },
    { value: "from-red-500 to-rose-600", label: "Red" },
    { value: "from-teal-500 to-emerald-600", label: "Teal" },
];

const defaultData: GalleryPageData = {
    hero: {
        title: "Galeri Proyek",
        subtitle: "Jelajahi portofolio proyek kami yang telah mengubah visi menjadi kenyataan",
    },
    categories: [
        { id: "all", label: "Semua Proyek" },
        { id: "residential", label: "Residensial" },
        { id: "commercial", label: "Komersial" },
        { id: "interior", label: "Interior" },
    ],
    projects: [
        { id: 1, slug: "vistara-residence", title: "Vistara Residence", category: "residential", location: "Jakarta Selatan", status: "Selesai", type: "Apartemen Mewah", units: "120 Unit", description: "Apartemen modern dengan fasilitas lengkap di lokasi strategis Jakarta Selatan", gradient: "from-blue-900 to-blue-700" },
        { id: 2, slug: "mandala-office-park", title: "Mandala Office Park", category: "commercial", location: "BSD City", status: "Sedang Berjalan", type: "Perkantoran", units: "15.000 m²", description: "Kompleks perkantoran modern dengan teknologi smart building", gradient: "from-amber-500 to-orange-600" },
    ],
    cta: {
        title: "Tertarik dengan Proyek Kami?",
        description: "Hubungi kami untuk konsultasi gratis dan wujudkan proyek impian Anda",
        primaryButtonLabel: "Konsultasi Sekarang",
        primaryButtonLink: "/contact",
        secondaryButtonLabel: "Pelajari Lebih Lanjut",
        secondaryButtonLink: "/mandala-bumi-nusantara",
    },
};

type TabType = "hero" | "categories" | "projects" | "cta";

export default function GalleryPageEditor() {
    const [data, setData] = useState<GalleryPageData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("projects");
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                const docRef = doc(db, "pages", "gallery");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData({ ...defaultData, ...docSnap.data() } as GalleryPageData);
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
            const docRef = doc(db, "pages", "gallery");
            await setDoc(docRef, data);
            showToast("Changes saved successfully!", "success");
        } catch (error) {
            console.error("Error saving data:", error);
            showToast("Failed to save changes", "error");
        } finally {
            setSaving(false);
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const addProject = () => {
        const newId = Math.max(...data.projects.map(p => p.id), 0) + 1;
        const newProject: Project = {
            id: newId,
            slug: "",
            title: "",
            category: data.categories[1]?.id || "residential",
            location: "",
            status: "Sedang Berjalan",
            type: "",
            units: "",
            description: "",
            gradient: "from-blue-900 to-blue-700",
        };
        setEditingProject(newProject);
    };

    const saveProject = () => {
        if (!editingProject) return;

        const projectWithSlug = {
            ...editingProject,
            slug: editingProject.slug || generateSlug(editingProject.title),
        };

        const existingIndex = data.projects.findIndex(p => p.id === projectWithSlug.id);
        if (existingIndex >= 0) {
            const newProjects = [...data.projects];
            newProjects[existingIndex] = projectWithSlug;
            setData({ ...data, projects: newProjects });
        } else {
            setData({ ...data, projects: [...data.projects, projectWithSlug] });
        }
        setEditingProject(null);
        showToast("Project saved!", "success");
    };

    const deleteProject = (id: number) => {
        if (confirm("Are you sure you want to delete this project?")) {
            setData({ ...data, projects: data.projects.filter(p => p.id !== id) });
            showToast("Project deleted", "success");
        }
    };

    const tabs = [
        { id: "projects" as TabType, label: "Projects", icon: "🏢" },
        { id: "categories" as TabType, label: "Categories", icon: "📁" },
        { id: "hero" as TabType, label: "Hero", icon: "🎯" },
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
                    <h1 className="text-2xl font-bold text-slate-900">Gallery Page Editor</h1>
                    <p className="text-slate-500 mt-1">Manage your project gallery</p>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/gallery" target="_blank" className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        Preview
                    </a>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Project Edit Modal */}
            {editingProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {data.projects.find(p => p.id === editingProject.id) ? "Edit Project" : "Add Project"}
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={editingProject.title}
                                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        value={editingProject.slug}
                                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                                        placeholder={generateSlug(editingProject.title) || "auto-generated"}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select
                                        value={editingProject.category}
                                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    >
                                        {data.categories.filter(c => c.id !== "all").map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={editingProject.location}
                                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select
                                        value={editingProject.status}
                                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    >
                                        <option value="Selesai">Selesai</option>
                                        <option value="Sedang Berjalan">Sedang Berjalan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <input
                                        type="text"
                                        value={editingProject.type}
                                        onChange={(e) => setEditingProject({ ...editingProject, type: e.target.value })}
                                        placeholder="e.g. Apartemen Mewah"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Units/Size</label>
                                    <input
                                        type="text"
                                        value={editingProject.units}
                                        onChange={(e) => setEditingProject({ ...editingProject, units: e.target.value })}
                                        placeholder="e.g. 120 Unit"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Color Theme</label>
                                <div className="flex flex-wrap gap-2">
                                    {gradientOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setEditingProject({ ...editingProject, gradient: opt.value })}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${editingProject.gradient === opt.value ? "ring-2 ring-offset-2 ring-indigo-500" : ""}`}
                                        >
                                            <span className={`inline-block w-4 h-4 rounded bg-gradient-to-r ${opt.value} mr-2`}></span>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={editingProject.description}
                                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            <button onClick={() => setEditingProject(null)} className="px-4 py-2 text-slate-600 hover:text-slate-900">
                                Cancel
                            </button>
                            <button onClick={saveProject} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">
                                Save Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    {/* Projects Tab */}
                    {activeTab === "projects" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">Projects ({data.projects.length})</h3>
                                <button onClick={addProject} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                                    + Add Project
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.projects.map((project) => (
                                    <div key={project.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                        <div className={`h-24 bg-gradient-to-r ${project.gradient} relative`}>
                                            <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${project.status === "Selesai" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-semibold text-slate-900">{project.title}</h4>
                                            <p className="text-sm text-slate-500">{project.location}</p>
                                            <p className="text-xs text-slate-400 mt-1">{project.category} • {project.units}</p>
                                            <div className="flex gap-2 mt-3">
                                                <button onClick={() => setEditingProject(project)} className="flex-1 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg">
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteProject(project.id)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Categories Tab */}
                    {activeTab === "categories" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Categories</h3>
                                <button
                                    onClick={() => setData({ ...data, categories: [...data.categories, { id: "", label: "" }] })}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 text-sm font-medium"
                                >
                                    + Add Category
                                </button>
                            </div>
                            <div className="space-y-3">
                                {data.categories.map((category, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                        <input
                                            type="text"
                                            value={category.id}
                                            onChange={(e) => {
                                                const newCategories = [...data.categories];
                                                newCategories[index].id = e.target.value;
                                                setData({ ...data, categories: newCategories });
                                            }}
                                            placeholder="ID (e.g. residential)"
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                                            disabled={category.id === "all"}
                                        />
                                        <input
                                            type="text"
                                            value={category.label}
                                            onChange={(e) => {
                                                const newCategories = [...data.categories];
                                                newCategories[index].label = e.target.value;
                                                setData({ ...data, categories: newCategories });
                                            }}
                                            placeholder="Label"
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                        {category.id !== "all" && (
                                            <button
                                                onClick={() => setData({ ...data, categories: data.categories.filter((_, i) => i !== index) })}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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

                    {/* CTA Tab */}
                    {activeTab === "cta" && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={data.cta.title}
                                    onChange={(e) => setData({ ...data, cta: { ...data.cta, title: e.target.value } })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={data.cta.description}
                                    onChange={(e) => setData({ ...data, cta: { ...data.cta, description: e.target.value } })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-indigo-50 rounded-lg space-y-3">
                                    <h4 className="font-medium text-indigo-900">Primary Button</h4>
                                    <input
                                        type="text"
                                        value={data.cta.primaryButtonLabel}
                                        onChange={(e) => setData({ ...data, cta: { ...data.cta, primaryButtonLabel: e.target.value } })}
                                        placeholder="Label"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        value={data.cta.primaryButtonLink}
                                        onChange={(e) => setData({ ...data, cta: { ...data.cta, primaryButtonLink: e.target.value } })}
                                        placeholder="Link"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div className="p-4 bg-slate-100 rounded-lg space-y-3">
                                    <h4 className="font-medium text-slate-900">Secondary Button</h4>
                                    <input
                                        type="text"
                                        value={data.cta.secondaryButtonLabel}
                                        onChange={(e) => setData({ ...data, cta: { ...data.cta, secondaryButtonLabel: e.target.value } })}
                                        placeholder="Label"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        value={data.cta.secondaryButtonLink}
                                        onChange={(e) => setData({ ...data, cta: { ...data.cta, secondaryButtonLink: e.target.value } })}
                                        placeholder="Link"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
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
