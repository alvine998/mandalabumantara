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

export interface OrganizationMember {
  id: string;
  name: string;
  description: string;
  photo: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export const organizationService = {
  /**
   * Get all organization members
   */
  async getAllMembers() {
    const q = query(collection(db, "organizations"), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as OrganizationMember[];
  },

  /**
   * Get a member by ID
   */
  async getMemberById(id: string) {
    const docRef = doc(db, "organizations", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as OrganizationMember;
    }
    return null;
  },

  /**
   * Create a new organization member
   */
  async createMember(data: Partial<OrganizationMember>) {
    const payload = {
      name: "",
      description: "",
      photo: "",
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "organizations"), payload);
    return docRef.id;
  },

  /**
   * Update an organization member
   */
  async updateMember(id: string, data: Partial<OrganizationMember>) {
    const docRef = doc(db, "organizations", id);
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
  },

  /**
   * Delete an organization member
   */
  async deleteMember(id: string) {
    const docRef = doc(db, "organizations", id);
    await deleteDoc(docRef);
  },
};
