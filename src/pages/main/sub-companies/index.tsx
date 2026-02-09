import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { subCompanyService, SubCompany } from "@/lib/services/sub-company-service";
import Link from "next/link";

export default function SubCompaniesList() {
    const [subCompanies, setSubCompanies] = useState<SubCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        loadSubCompanies();
    }, []);

    const loadSubCompanies = async () => {
        setLoading(true);
        try {
            const data = await subCompanyService.getAllSubCompanies();
            setSubCompanies(data);
        } catch (error) {
            console.error("Error loading sub-companies:", error);
            showToast("Failed to load sub-companies", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newName.trim()) {
            showToast("Please enter a brand name", "warning");
            return;
        }

        try {
            const id = await subCompanyService.createSubCompany({ name: newName });
            showToast("Sub-company created!", "success");
            setShowModal(false);
            setNewName("");
            window.location.href = `/main/sub-companies/${id}`;
        } catch (error) {
            console.error("Error creating sub-company:", error);
            showToast("Failed to create sub-company", "error");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            await subCompanyService.deleteSubCompany(id);
            showToast("Sub-company deleted", "success");
            setSubCompanies(subCompanies.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting sub-company:", error);
            showToast("Failed to delete sub-company", "error");
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sub-Company Management</h1>
                    <p className="text-slate-500">Manage brand details and contact information</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    + New Brand
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : subCompanies.length === 0 ? (
                    <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                        <div className="text-5xl mb-4">🏢</div>
                        <p>No sub-companies found</p>
                    </div>
                ) : (
                    subCompanies.map((brand) => (
                        <div key={brand.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors group relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                                    {brand.logo ? <img src={brand.logo} alt="" className="w-full h-full object-contain rounded-lg" /> : "🏢"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{brand.name}</h3>
                                    <p className="text-xs text-slate-500">{brand.email || "No email set"}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-slate-600">
                                    <span className="w-5">📞</span> {brand.mobile_phone || "-"}
                                </div>
                                <div className="flex items-center text-sm text-slate-600 truncate">
                                    <span className="w-5">📍</span> {brand.address || "-"}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/main/sub-companies/${brand.id}`}
                                    className="flex-1 text-center px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-sm font-bold transition-colors"
                                >
                                    Edit Details
                                </Link>
                                <button
                                    onClick={() => handleDelete(brand.id, brand.name)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Brand Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Brand</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name *</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    placeholder="e.g. Vistara"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
                                >
                                    Create Brand
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
