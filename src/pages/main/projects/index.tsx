import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    status: "draft" | "published";
    location: string;
    description: string;
    thumbnail: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ title: "", slug: "", category: "residential" });
    const { showToast } = useToast();

    const loadProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "projects"));
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Project[];
            setProjects(projectsData.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
        } catch (error) {
            console.error("Error loading projects:", error);
            showToast("Failed to load projects", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleCreateProject = async () => {
        if (!newProject.title.trim()) {
            showToast("Please enter a project title", "warning");
            return;
        }

        try {
            const slug = newProject.slug || generateSlug(newProject.title);
            const docRef = await addDoc(collection(db, "projects"), {
                title: newProject.title,
                slug: slug,
                category: newProject.category,
                status: "draft",
                location: "",
                description: "",
                thumbnail: "",
                featured: false,
                images: [],
                features: [],
                specifications: [],
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });

            showToast("Project created!", "success");
            setShowModal(false);
            setNewProject({ title: "", slug: "", category: "residential" });

            // Navigate to edit page
            window.location.href = `/main/projects/${docRef.id}`;
        } catch (error) {
            console.error("Error creating project:", error);
            showToast("Failed to create project", "error");
        }
    };

    const handleDeleteProject = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await deleteDoc(doc(db, "projects", id));
            showToast("Project deleted", "success");
            loadProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            showToast("Failed to delete project", "error");
        }
    };

    const handleToggleStatus = async (project: Project) => {
        try {
            const newStatus = project.status === "published" ? "draft" : "published";
            await updateDoc(doc(db, "projects", project.id), {
                status: newStatus,
                updatedAt: Timestamp.now(),
            });
            showToast(`Project ${newStatus === "published" ? "published" : "unpublished"}`, "success");
            loadProjects();
        } catch (error) {
            console.error("Error updating status:", error);
            showToast("Failed to update status", "error");
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || project.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
                    <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                    <p className="text-slate-500 mt-1">Manage your project portfolio</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    + New Project
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "published", "draft"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterStatus === status
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {status === "all" ? "All" : status === "published" ? "Published" : "Drafts"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredProjects.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-5xl mb-4">📁</div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
                        <p className="text-slate-500 mb-4">
                            {searchQuery || filterStatus !== "all" ? "Try adjusting your filters" : "Create your first project to get started"}
                        </p>
                        {!searchQuery && filterStatus === "all" && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                            >
                                + Create Project
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Project</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 hidden md:table-cell">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 hidden lg:table-cell">Updated</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg flex-shrink-0">
                                                🏢
                                            </div>
                                            <div>
                                                <Link href={`/main/projects/${project.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                                                    {project.title || "Untitled"}
                                                </Link>
                                                <p className="text-sm text-slate-500">/{project.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm capitalize">
                                            {project.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(project)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === "published"
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                }`}
                                        >
                                            {project.status === "published" ? "Published" : "Draft"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                                        {project.updatedAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/main/projects/${project.id}`}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteProject(project.id, project.title)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">Create New Project</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Project Title *</label>
                                <input
                                    type="text"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    placeholder="e.g. Vistara Residence"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={newProject.slug}
                                    onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    placeholder={generateSlug(newProject.title) || "auto-generated"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    value={newProject.category}
                                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                >
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="interior">Interior</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-900"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateProject}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
                            >
                                Create & Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
