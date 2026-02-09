import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  created_at: Timestamp;
}

export const emailService = {
  /**
   * Get all emails from the 'emails' collection ordered by creation date
   */
  async getAllEmails() {
    const q = query(collection(db, "emails"), orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EmailMessage[];
  },

  /**
   * Add a new email message to the 'emails' collection
   */
  async sendEmail(data: { from: string; to: string; message: string }) {
    const payload = {
      ...data,
      created_at: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "emails"), payload);
    return docRef.id;
  },

  /**
   * Delete an email message by ID
   */
  async deleteEmail(id: string) {
    const docRef = doc(db, "emails", id);
    await deleteDoc(docRef);
  },
};
