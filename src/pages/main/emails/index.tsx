import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { emailService, EmailMessage } from "@/lib/services/email-service";

export default function EmailsList() {
    const [emails, setEmails] = useState<EmailMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        loadEmails();
    }, []);

    const loadEmails = async () => {
        setLoading(true);
        try {
            const data = await emailService.getAllEmails();
            setEmails(data);
        } catch (error) {
            console.error("Error loading emails:", error);
            showToast("Failed to load emails", "error");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "-";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Email Management</h1>
                    <p className="text-slate-500">View and respond to contact form submissions</p>
                </div>
                <button
                    onClick={loadEmails}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : emails.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                        <div className="text-5xl mb-4">📩</div>
                        <p>No emails found</p>
                    </div>
                ) : (
                    emails.map((email) => (
                        <div key={email.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors relative group">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-bold">
                                        {email.from.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{email.from}</p>
                                        <p className="text-xs text-slate-500">To: {email.to}</p>
                                    </div>
                                </div>
                                <div className="md:ml-auto flex items-center gap-4">
                                    <span className="text-xs text-slate-400">
                                        {formatDate(email.created_at)}
                                    </span>
                                    <a
                                        href="https://webmail.mandalabumantara.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                        Reply
                                    </a>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap italic">
                                "{email.message}"
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
