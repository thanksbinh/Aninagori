import { collection, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";

export async function banUser(authorName: string) {
  const userQuery = query(collection(db, "users"), where("username", "==", authorName), limit(1))
  const userRef = (await getDocs(userQuery)).docs[0].ref
  updateDoc(userRef, { is_banned: true })
}