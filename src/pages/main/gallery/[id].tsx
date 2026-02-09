import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import { galleryService, GalleryItem, GalleryImage } from "@/lib/services/gallery-service";
import { uploadService } from "@/lib/services/upload-service";
import Link from "next/link";

export default function GalleryEditor() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<Omit<GalleryItem, "id">>({
        name: "",
        type: "gallery",
        images: [],
        created_at: {} as any,
        updated_at: {} as any,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (!id || id === "new") {
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                const item = await galleryService.getGalleryById(id as string);
                if (item) {
                    setData(item);
                } else {
                    showToast("Gallery not found", "error");
                    router.push("/main/gallery");
                }
            } catch (error) {
                console.error("Error loading gallery:", error);
                showToast("Failed to load gallery", "error");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (id === "new") {
                await galleryService.createGallery(data as any);
                showToast("Gallery created!", "success");
            } else {
                await galleryService.updateGallery(id as string, data);
                showToast("Gallery updated!", "success");
            }
            router.push("/main/gallery");
        } catch (error) {
            console.error("Error saving gallery:", error);
            showToast("Failed to save gallery", "error");
        } finally {
            setSaving(false);
        }
    };

    const addImage = () => {
        const defaultType = data.type === "Home" ? "video_desktop" : "photo";
        setData({
            ...data,
            images: [...data.images, { type: defaultType, url: "" }]
        });
    };

    const removeImage = (index: number) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData({ ...data, images: newImages });
    };

    const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
        const newImages = [...data.images];
        newImages[index] = { ...newImages[index], [field]: value };
        setData({ ...data, images: newImages });
    };

    const handleUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIndex(index);
        try {
            const url = await uploadService.uploadMedia(file, "gallery");
            updateImage(index, "url", url);
            showToast("Upload success!", "success");
        } catch (error: any) {
            console.error("Upload error:", error);
            showToast(error.message || "Upload failed", "error");
        } finally {
            setUploadingIndex(null);
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
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/main/gallery" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {id === "new" ? "Create Gallery" : "Edit Gallery"}
                        </h1>
                        <p className="text-slate-500">{data.type} Content</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="max-w-4xl space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Gallery Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            placeholder="e.g. Home Section Video"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Type</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData({ ...data, type: e.target.value as any })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        >
                            <option value="Home">Home (Videos for Hero)</option>
                            <option value="gallery">Gallery (Photos/Videos for Page)</option>
                        </select>
                    </div>
                </div>

                {/* Media Items */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Media Items</h2>
                        <button
                            onClick={addImage}
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span>+</span> Add Media
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.images.map((img, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 relative group">
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    ×
                                </button>

                                <div className="w-full md:w-48 aspect-video bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                                    {(img.type === "photo" && img.url) ? (
                                        <img src={img.url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-4xl">
                                            {img.type.includes("video") ? "📽️" : "🖼️"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Type</label>
                                            <select
                                                value={img.type}
                                                onChange={(e) => updateImage(index, "type", e.target.value as any)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                                            >
                                                {data.type === "Home" ? (
                                                    <>
                                                        <option value="video_desktop">Video Desktop</option>
                                                        <option value="video_mobile">Video Mobile</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="photo">Photo</option>
                                                        <option value="video">Video</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">URL / Upload</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={img.url}
                                                    onChange={(e) => updateImage(index, "url", e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                                                    placeholder="https://..."
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept={img.type === "photo" ? "image/*" : "video/*"}
                                                        onChange={(e) => handleUpload(index, e)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        disabled={uploadingIndex === index}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={`px-4 py-2 ${uploadingIndex === index ? "bg-slate-200" : "bg-amber-500 hover:bg-amber-600"} text-white font-medium rounded-lg transition-colors flex items-center gap-2`}
                                                    >
                                                        {uploadingIndex === index ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            "Upload"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data.images.length === 0 && (
                            <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                                No media items added.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
