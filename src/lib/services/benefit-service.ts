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
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export interface Benefit {
  id: string;
  name: string;
  description: string;
  icon: string;
  sub_company_id: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

const COLLECTION_NAME = "benefits";

export const benefitService = {
  /**
   * Get all benefits ordered by name
   */
  async getAllBenefits() {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Benefit[];
  },

  /**
   * Get a single benefit by ID
   */
  async getBenefitById(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Benefit;
    }
    return null;
  },

  /**
   * Create a new benefit
   */
  async createBenefit(data: Partial<Benefit>) {
    const payload = {
      name: "",
      description: "",
      icon: "",
      sub_company_id: "",
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return docRef.id;
  },

  /**
   * Update an existing benefit
   */
  async updateBenefit(id: string, data: Partial<Benefit>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
  },

  /**
   * Delete a benefit
   */
  async deleteBenefit(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
