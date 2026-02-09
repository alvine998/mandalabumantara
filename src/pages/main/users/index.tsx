import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { userService, CMSUser } from "@/lib/services/user-service";
import { Timestamp } from "firebase/firestore";

export default function UserManagement() {
    const [users, setUsers] = useState<CMSUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<CMSUser | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "editor" });
    const { showToast } = useToast();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error loading users:", error);
            showToast("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, {
                    name: formData.name,
                    role: formData.role
                });
                showToast("User updated successfully", "success");
            } else {
                await userService.createUser(formData);
                showToast("User created successfully", "success");
            }
            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ name: "", email: "", role: "editor" });
            loadUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            showToast("Failed to save user", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await userService.deleteUser(id);
            showToast("User deleted successfully", "success");
            loadUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            showToast("Failed to delete user", "error");
        }
    };

    const openEditModal = (user: CMSUser) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setIsModalOpen(true);
    };

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return "-";
        const date = timestamp.toDate();
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                    <p className="text-slate-500 mt-1">Manage admin and editor accounts</p>
                </div>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({ name: "", email: "", role: "editor" });
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                    <span>+</span> Add New User
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Last Updated</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">Loading users...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(user.updated_at)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-1 px-3 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-1 px-3 text-sm text-red-600 hover:bg-red-50 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editingUser ? "Edit User" : "Add New User"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    required
                                    disabled={!!editingUser}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                >
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                                >
                                    {editingUser ? "Save Changes" : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
