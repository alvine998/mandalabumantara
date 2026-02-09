import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface NewsArticle {
  id: string;
  author: string;
  content: string;
  created_at: Timestamp;
  published_at: Timestamp | null;
  slug: string;
  thumbnail: string;
  title: string;
  updated_at: Timestamp;
  keywords: string[];
  // Keeping some extra fields for UI consistency
  status: "draft" | "published";
}

const COLLECTION_NAME = "news";

export const newsService = {
  // Create News
  async createNews(newsData: { title: string; slug: string; author: string }) {
    const payload = {
      ...newsData,
      content: "",
      thumbnail: "",
      keywords: [],
      status: "draft",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      published_at: null,
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return { id: docRef.id, ...payload };
  },

  // Get All News
  async getAllNews(): Promise<NewsArticle[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("created_at", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as NewsArticle,
    );
  },

  // Get News by ID
  async getNewsById(id: string): Promise<NewsArticle | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as NewsArticle;
    }
    return null;
  },

  // Update News
  async updateNews(
    id: string,
    newsData: Partial<Omit<NewsArticle, "id" | "created_at">>,
  ) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const payload = {
      ...newsData,
      updated_at: serverTimestamp(),
    };
    await updateDoc(docRef, payload);
  },

  // Delete News
  async deleteNews(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
