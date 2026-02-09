import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const uploadService = {
  /**
   * Upload an image to Firebase Storage
   * @deprecated Use uploadMedia instead
   */
  async uploadImage(file: File, path: string): Promise<string> {
    return this.uploadMedia(file, path);
  },

  /**
   * Upload media (image or video) to Firebase Storage
   * @param file The file to upload
   * @param path The path in storage (e.g., 'gallery')
   * @returns The download URL
   */
  async uploadMedia(file: File, path: string): Promise<string> {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      throw new Error("File must be an image or video.");
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      const sizeLabel = isImage ? "5MB" : "50MB";
      throw new Error(`File size exceeds ${sizeLabel} limit.`);
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Failed to upload file. Please try again.");
    }
  },

  /**
   * Delete a file from Firebase Storage
   * @param url The download URL of the file to delete
   */
  async deleteFile(url: string): Promise<void> {
    if (!url || !url.includes("firebasestorage.googleapis.com")) return;

    try {
      // Extract path from download URL
      // Firebase URLs are like: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?alt=media&token=[token]
      const decodedUrl = decodeURIComponent(url);
      const pathWithToken = decodedUrl.split("/o/")[1];
      const path = pathWithToken.split("?")[0];

      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error: any) {
      // If the file is already gone, it's fine
      if (error.code === "storage/object-not-found") {
        console.warn("File not found in storage, skipping deletion:", url);
        return;
      }
      console.error("Failed to delete file from storage:", error);
      // We don't necessarily want to block the whole process if storage deletion fails
    }
  },
};
