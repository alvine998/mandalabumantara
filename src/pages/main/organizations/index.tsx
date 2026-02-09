import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { organizationService, OrganizationMember } from "@/lib/services/organization-service";
import MediaUpload from "@/components/MediaUpload";

export default function OrganizationList() {
    const [members, setMembers] = useState<OrganizationMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<Partial<OrganizationMember> | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = await organizationService.getAllMembers();
            setMembers(data);
        } catch (error) {
            console.error("Error loading members:", error);
            showToast("Failed to load members", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member?: OrganizationMember) => {
        setEditingMember(member || { name: "", description: "", photo: "" });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!editingMember || !editingMember.name) {
            showToast("Please enter a name", "warning");
            return;
        }

        setSaving(true);
        try {
            if (editingMember.id) {
                const { id, created_at, updated_at, ...data } = editingMember as any;
                await organizationService.updateMember(id, data);
                showToast("Member updated!", "success");
            } else {
                await organizationService.createMember(editingMember);
                showToast("Member created!", "success");
            }
            setShowModal(false);
            loadMembers();
        } catch (error) {
            console.error("Error saving member:", error);
            showToast("Failed to save member", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            await organizationService.deleteMember(id);
            showToast("Member deleted", "success");
            setMembers(members.filter(m => m.id !== id));
        } catch (error) {
            console.error("Error deleting member:", error);
            showToast("Failed to delete member", "error");
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Organization Management</h1>
                    <p className="text-slate-500">Manage leadership and team members</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    + Add Member
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <div className="text-5xl mb-4">👥</div>
                        <p>No members found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Member</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Description</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border bg-slate-50 flex-shrink-0 overflow-hidden">
                                                {member.photo ? (
                                                    <img src={member.photo} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                                                )}
                                            </div>
                                            <span className="font-semibold text-slate-900">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-500 line-clamp-2 max-w-xl">
                                            {member.description}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(member)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id, member.name)}
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

            {/* Edit/Create Modal */}
            {showModal && editingMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingMember.id ? "Edit Member" : "Add New Member"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={editingMember.name}
                                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    placeholder="e.g. Ir. Azka Ubaidillah"
                                />
                            </div>
                            <div>
                                <MediaUpload
                                    label="Member Photo"
                                    value={editingMember.photo || ""}
                                    onChange={(url) => setEditingMember({ ...editingMember, photo: url })}
                                    path="organizations"
                                    rounded="full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description / Bio</label>
                                <textarea
                                    value={editingMember.description}
                                    onChange={(e) => setEditingMember({ ...editingMember, description: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm leading-relaxed"
                                    placeholder="Write details about the person..."
                                />
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
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Member"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
