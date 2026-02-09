import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CompanyProfile {
  address: string;
  admin_email: string;
  description: string;
  facebook: string;
  info_email: string;
  instagram: string;
  logo: string;
  mobile_phone: string;
  name: string;
  privacy_policy: string;
  slogan: string;
  term_condition: string;
  tiktok: string;
  youtube: string;
  updated_at?: Timestamp;
}

const COLLECTION_NAME = "company_profiles";
const DOC_ID = "4f0BUdgkIKlNvWuufql8";

export const companyProfileService = {
  // Get Company Profile
  async getProfile(): Promise<CompanyProfile | null> {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as CompanyProfile;
    }
    return null;
  },

  // Update Company Profile
  async updateProfile(profileData: CompanyProfile) {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const payload = {
      ...profileData,
      updated_at: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
  },
};
