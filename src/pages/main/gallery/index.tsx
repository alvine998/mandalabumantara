import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { galleryService, GalleryItem } from "@/lib/services/gallery-service";
import Link from "next/link";
import { useRouter } from "next/router";

export default function GalleryList() {
    const [galleries, setGalleries] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const router = useRouter();

    const loadGalleries = async () => {
        setLoading(true);
        try {
            const data = await galleryService.getAllGalleries();
            setGalleries(data);
        } catch (error) {
            console.error("Error loading galleries:", error);
            showToast("Failed to load galleries", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGalleries();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this gallery item?")) return;
        try {
            await galleryService.deleteGallery(id);
            showToast("Gallery deleted successfully!", "success");
            loadGalleries();
        } catch (error) {
            console.error("Error deleting gallery:", error);
            showToast("Failed to delete gallery", "error");
        }
    };

    const handleCreate = async (type: "Home" | "gallery") => {
        try {
            const id = await galleryService.createGallery({
                name: "New " + (type === "Home" ? "Home Video" : "Gallery Item"),
                type: type,
                images: [],
            });
            router.push(`/main/gallery/${id}`);
        } catch (error) {
            console.error("Error creating gallery:", error);
            showToast("Failed to create gallery", "error");
        }
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
                    <h1 className="text-2xl font-bold text-slate-900">Gallery Management</h1>
                    <p className="text-slate-500 mt-1">Manage videos and photos for your website</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleCreate("Home")}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span>🏠</span> New Home Video
                    </button>
                    <button
                        onClick={() => handleCreate("gallery")}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span>🖼️</span> New Gallery Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                        <div className="aspect-video bg-slate-100 relative">
                            {item.images && item.images.length > 0 ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                    {item.images[0].type.includes("video") ? (
                                        <div className="text-4xl text-slate-400">📽️</div>
                                    ) : (
                                        <img
                                            src={item.images[0].url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    No content
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.type === "Home" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                    }`}>
                                    {item.type}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{item.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                {item.images?.length || 0} media items
                            </p>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/main/gallery/${item.id}`}
                                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center font-medium rounded-lg transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="px-4 py-2 text-red-500 hover:bg-red-50 font-medium rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {galleries.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                        No gallery items found. Create one to get started!
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
