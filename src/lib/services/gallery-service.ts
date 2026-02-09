import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { uploadService } from "./upload-service";

export interface GalleryImage {
  type: "video_mobile" | "video_desktop" | "photo" | "video";
  url: string;
}

export interface GalleryItem {
  id: string;
  name: string;
  type: "Home" | "gallery";
  images: GalleryImage[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export const galleryService = {
  async getAllGalleries() {
    const q = query(collection(db, "galleries"), orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GalleryItem[];
  },

  async getGalleriesByType(type: "Home" | "gallery") {
    const q = query(
      collection(db, "galleries"),
      where("type", "==", type),
      orderBy("created_at", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GalleryItem[];
  },

  async getGalleryById(id: string) {
    const docRef = doc(db, "galleries", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as GalleryItem;
    }
    return null;
  },

  async createGallery(galleryData: {
    name: string;
    type: "Home" | "gallery";
    images: GalleryImage[];
  }) {
    const payload = {
      ...galleryData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "galleries"), payload);
    return docRef.id;
  },

  async updateGallery(
    id: string,
    galleryData: Partial<Omit<GalleryItem, "id" | "created_at">>,
  ) {
    const docRef = doc(db, "galleries", id);
    const payload = {
      ...galleryData,
      updated_at: serverTimestamp(),
    };
    await updateDoc(docRef, payload);
  },

  async deleteGallery(id: string) {
    const item = await this.getGalleryById(id);
    if (item && item.images) {
      // Delete all media from storage
      const deletePromises = item.images.map((img) =>
        uploadService.deleteFile(img.url),
      );
      await Promise.all(deletePromises);
    }

    const docRef = doc(db, "galleries", id);
    await deleteDoc(docRef);
  },
};
