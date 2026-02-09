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

export interface Division {
  id: string;
  name: string;
  description: string;
  icon: string;
  sub_company_id: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

const COLLECTION_NAME = "divisions";

export const divisionService = {
  /**
   * Get all divisions ordered by name
   */
  async getAllDivisions() {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Division[];
  },

  /**
   * Get a single division by ID
   */
  async getDivisionById(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Division;
    }
    return null;
  },

  /**
   * Create a new division
   */
  async createDivision(data: Partial<Division>) {
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
   * Update an existing division
   */
  async updateDivision(id: string, data: Partial<Division>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
  },

  /**
   * Delete a division
   */
  async deleteDivision(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
