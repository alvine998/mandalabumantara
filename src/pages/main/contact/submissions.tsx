import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy, Timestamp } from "firebase/firestore";
import Link from "next/link";

interface Submission {
    id: string;
    name: string;
    email: string;
    message: string;
    status: "new" | "read" | "replied";
    createdAt: Date;
}

export default function ContactSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [filterStatus, setFilterStatus] = useState<"all" | "new" | "read" | "replied">("all");
    const { showToast } = useToast();

    const loadSubmissions = async () => {
        try {
            const q = query(collection(db, "contact_submissions"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Submission[];
            setSubmissions(data);
        } catch (error) {
            console.error("Error loading submissions:", error);
            showToast("Failed to load submissions", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await updateDoc(doc(db, "contact_submissions", id), { status: "read" });
            loadSubmissions();
            showToast("Marked as read", "success");
        } catch (error) {
            showToast("Failed to update status", "error");
        }
    };

    const handleMarkAsReplied = async (id: string) => {
        try {
            await updateDoc(doc(db, "contact_submissions", id), { status: "replied" });
            loadSubmissions();
            showToast("Marked as replied", "success");
        } catch (error) {
            showToast("Failed to update status", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission?")) return;
        try {
            await deleteDoc(doc(db, "contact_submissions", id));
            setSelectedSubmission(null);
            loadSubmissions();
            showToast("Submission deleted", "success");
        } catch (error) {
            showToast("Failed to delete submission", "error");
        }
    };

    const filteredSubmissions = filterStatus === "all"
        ? submissions
        : submissions.filter(s => s.status === filterStatus);

    const newCount = submissions.filter(s => s.status === "new").length;

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
                <div className="flex items-center gap-4">
                    <Link href="/main/contact" className="p-2 hover:bg-slate-100 rounded-lg">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Contact Submissions</h1>
                        <p className="text-slate-500 mt-1">
                            {newCount > 0 ? `${newCount} new message${newCount > 1 ? "s" : ""}` : "No new messages"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {(["all", "new", "read", "replied"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterStatus === status ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                        {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                        {status === "new" && newCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{newCount}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Submissions List */}
                <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {filteredSubmissions.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="text-slate-500">No submissions found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                            {filteredSubmissions.map((submission) => (
                                <button
                                    key={submission.id}
                                    onClick={() => {
                                        setSelectedSubmission(submission);
                                        if (submission.status === "new") handleMarkAsRead(submission.id);
                                    }}
                                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selectedSubmission?.id === submission.id ? "bg-indigo-50 border-l-4 border-indigo-600" : ""}`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className={`font-semibold ${submission.status === "new" ? "text-slate-900" : "text-slate-600"}`}>
                                            {submission.name}
                                        </span>
                                        {submission.status === "new" && (
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">{submission.email}</p>
                                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">{submission.message}</p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {submission.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submission Detail */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    {selectedSubmission ? (
                        <div>
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedSubmission.name}</h2>
                                    <a href={`mailto:${selectedSubmission.email}`} className="text-indigo-600 hover:underline">
                                        {selectedSubmission.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedSubmission.status === "new" ? "bg-indigo-100 text-indigo-700" :
                                            selectedSubmission.status === "read" ? "bg-amber-100 text-amber-700" :
                                                "bg-green-100 text-green-700"
                                        }`}>
                                        {selectedSubmission.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-500 mb-4">
                                    Received on {selectedSubmission.createdAt.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                                <div className="bg-slate-50 rounded-lg p-6 mb-6">
                                    <p className="text-slate-700 whitespace-pre-wrap">{selectedSubmission.message}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={`mailto:${selectedSubmission.email}?subject=Re: Your message to Mandala Bumantara`}
                                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
                                        onClick={() => handleMarkAsReplied(selectedSubmission.id)}
                                    >
                                        Reply via Email
                                    </a>
                                    {selectedSubmission.status !== "replied" && (
                                        <button
                                            onClick={() => handleMarkAsReplied(selectedSubmission.id)}
                                            className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                                        >
                                            Mark as Replied
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(selectedSubmission.id)}
                                        className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 ml-auto"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-5xl mb-4">📬</div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a message</h3>
                            <p className="text-slate-500">Choose a submission from the list to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
