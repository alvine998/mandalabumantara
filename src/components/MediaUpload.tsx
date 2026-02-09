import { useState, useRef } from "react";
import { uploadService } from "@/lib/services/upload-service";
import { useToast } from "@/contexts/ToastContext";

interface MediaUploadProps {
    value: string;
    onChange: (url: string) => void;
    path: string;
    label?: string;
    type?: "image" | "video" | "both";
    className?: string;
    rounded?: "full" | "lg" | "xl";
}

export default function MediaUpload({
    value,
    onChange,
    path,
    label,
    type = "image",
    className = "",
    rounded = "lg",
}: MediaUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadService.uploadMedia(file, path);
            onChange(url);
            showToast("Upload successful!", "success");
        } catch (error: any) {
            console.error("Upload error:", error);
            showToast(error.message || "Upload failed", "error");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemove = async () => {
        if (!value) return;
        if (!confirm("Are you sure you want to remove this media?")) return;

        try {
            await uploadService.deleteFile(value);
            onChange("");
            showToast("Media removed", "success");
        } catch (error) {
            console.error("Remove error:", error);
            showToast("Failed to remove media from storage", "warning");
            onChange(""); // Still clear from UI
        }
    };

    const roundedClass = {
        full: "rounded-full",
        lg: "rounded-lg",
        xl: "rounded-xl",
    }[rounded];

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}

            <div className="flex items-center gap-4">
                {/* Preview Container */}
                <div className={`relative w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-200 ${roundedClass} overflow-hidden flex items-center justify-center flex-shrink-0 group`}>
                    {value ? (
                        <>
                            {value.includes(".mp4") || value.includes(".mov") || value.includes(".webm") ? (
                                <video src={value} className="w-full h-full object-cover" />
                            ) : (
                                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    title="Remove"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-slate-400 text-center">
                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] font-medium uppercase tracking-wider">Empty</span>
                        </div>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* Upload Actions */}
                <div className="flex-1 space-y-2">
                    <button
                        type="button"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {value ? "Change File" : "Upload File"}
                    </button>
                    <p className="text-xs text-slate-500">
                        {type === "image" ? "PNG, JPG up to 5MB" : type === "video" ? "MP4, MOV up to 50MB" : "Image (5MB) or Video (50MB)"}
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                        accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "image/*,video/*"}
                    />
                </div>
            </div>
        </div>
    );
}
