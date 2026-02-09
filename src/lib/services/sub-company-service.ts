import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export interface SubCompany {
  id: string;
  name: string;
  email: string;
  mobile_phone: string;
  address: string;
  description: string;
  logo: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export const subCompanyService = {
  /**
   * Get all sub-companies
   */
  async getAllSubCompanies() {
    const q = query(collection(db, "sub_companies"), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SubCompany[];
  },

  /**
   * Get a single sub-company by ID
   */
  async getSubCompanyById(id: string) {
    const docRef = doc(db, "sub_companies", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as SubCompany;
    }
    return null;
  },

  /**
   * Create a new sub-company
   */
  async createSubCompany(data: Partial<SubCompany>) {
    const payload = {
      name: "",
      email: "",
      mobile_phone: "",
      address: "",
      description: "",
      logo: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "sub_companies"), payload);
    return docRef.id;
  },

  /**
   * Update a sub-company
   */
  async updateSubCompany(id: string, data: Partial<SubCompany>) {
    const docRef = doc(db, "sub_companies", id);
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
  },

  /**
   * Delete a sub-company
   */
  async deleteSubCompany(id: string) {
    const docRef = doc(db, "sub_companies", id);
    await deleteDoc(docRef);
  },
};
