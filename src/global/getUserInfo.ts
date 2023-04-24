import { db } from "@/firebase/firebase-app"
import { doc, getDoc } from "firebase/firestore"
import { UserInfo } from "./UserInfo.types"

async function getUserInfo(userId: string | undefined): Promise<UserInfo | undefined> {
  if (!userId) return

  const docRef = doc(db, "users", userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const malConnect = docSnap.data()?.mal_connect

    return {
      id: docSnap.id,
      username: docSnap.data().username,
      image: docSnap.data().image,
      is_admin: docSnap.data().is_admin,
      is_banned: docSnap.data().is_banned,
      mal_connect: malConnect ? JSON.parse(JSON.stringify(malConnect)) : undefined,
    }
  } else {
    console.log("No such document in getUserInfo()!")
  }
}

export { getUserInfo }
