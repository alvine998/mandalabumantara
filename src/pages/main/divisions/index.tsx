import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { divisionService, Division } from "@/lib/services/division-service";
import { subCompanyService, SubCompany } from "@/lib/services/sub-company-service";
import MediaUpload from "@/components/MediaUpload";
import Image from "next/image";

export default function Divisions() {
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [subCompanies, setSubCompanies] = useState<SubCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDivision, setEditingDivision] = useState<Partial<Division> | null>(null);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [divisionsData, subCompaniesData] = await Promise.all([
                divisionService.getAllDivisions(),
                subCompaniesData_fetch()
            ]);
            setDivisions(divisionsData);
            setSubCompanies(subCompaniesData);
        } catch (error) {
            console.error("Error loading data:", error);
            showToast("Failed to load divisions", "error");
        } finally {
            setLoading(false);
        }
    };

    const subCompaniesData_fetch = async () => {
        return await subCompanyService.getAllSubCompanies();
    };

    const handleAdd = () => {
        setEditingDivision({
            name: "",
            description: "",
            icon: "",
            sub_company_id: subCompanies[0]?.id || "",
        });
        setModalOpen(true);
    };

    const handleEdit = (division: Division) => {
        setEditingDivision(division);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this division?")) return;

        try {
            await divisionService.deleteDivision(id);
            showToast("Division deleted successfully", "success");
            loadData();
        } catch (error) {
            console.error("Error deleting division:", error);
            showToast("Failed to delete division", "error");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDivision) return;

        setSaving(true);
        try {
            if (editingDivision.id) {
                await divisionService.updateDivision(editingDivision.id, editingDivision);
                showToast("Division updated successfully", "success");
            } else {
                await divisionService.createDivision(editingDivision);
                showToast("Division created successfully", "success");
            }
            setModalOpen(false);
            loadData();
        } catch (error) {
            console.error("Error saving division:", error);
            showToast("Failed to save division", "error");
        } finally {
            setSaving(false);
        }
    };

    const getSubCompanyName = (id: string) => {
        return subCompanies.find(sc => sc.id === id)?.name || "Unknown";
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

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Divisions</h1>
                    <p className="text-slate-500 mt-1">Manage business divisions belonging to each sub-company.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                    Add New Division
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Icon</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sub Company</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {divisions.map((division) => (
                            <tr key={division.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                                        {division.icon?.startsWith("http") ? (
                                            <Image
                                                src={division.icon}
                                                alt={division.name}
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <span className="text-2xl">{division.icon || "🏢"}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{division.name}</div>
                                    <div className="text-sm text-slate-500 line-clamp-1">{division.description}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {getSubCompanyName(division.sub_company_id)}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(division)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(division.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && editingDivision && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingDivision.id ? "Edit Division" : "Add Division"}
                            </h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Icon</label>
                                    <MediaUpload
                                        value={editingDivision.icon || ""}
                                        onChange={(url) => setEditingDivision({ ...editingDivision, icon: url })}
                                        path="divisions/icons"
                                        label="Division Icon"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                                    <input
                                        type="text"
                                        value={editingDivision.name || ""}
                                        onChange={(e) => setEditingDivision({ ...editingDivision, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none font-bold text-slate-900"
                                        placeholder="Project Management"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sub Company</label>
                                <select
                                    value={editingDivision.sub_company_id}
                                    onChange={(e) => setEditingDivision({ ...editingDivision, sub_company_id: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none font-bold text-slate-900"
                                    required
                                >
                                    <option value="">Select Sub Company</option>
                                    {subCompanies.map(sc => (
                                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    value={editingDivision.description}
                                    onChange={(e) => setEditingDivision({ ...editingDivision, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none text-slate-600"
                                    placeholder="Brief description of the division..."
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-3.5 px-6 border border-slate-200 text-slate-600 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3.5 px-6 bg-indigo-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Division"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
