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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CMSUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

const COLLECTION_NAME = "users";

export const userService = {
  // Create User
  async createUser(userData: { name: string; email: string; role: string }) {
    const userRef = doc(collection(db, COLLECTION_NAME));
    const payload = {
      ...userData,
      password: "hashPassword", // placeholder as requested
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    await setDoc(userRef, payload);
    return { id: userRef.id, ...payload };
  },

  // Get All Users
  async getAllUsers(): Promise<CMSUser[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("updated_at", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as CMSUser,
    );
  },

  // Get User by ID
  async getUserById(id: string): Promise<CMSUser | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CMSUser;
    }
    return null;
  },

  // Update User
  async updateUser(id: string, userData: { name?: string; role?: string }) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const payload = {
      ...userData,
      updated_at: serverTimestamp(),
    };
    await updateDoc(docRef, payload);
  },

  // Delete User
  async deleteUser(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
