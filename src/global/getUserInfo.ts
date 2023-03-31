import { db } from "@/firebase/firebase-app"
import { doc, getDoc } from "firebase/firestore"
import { UserInfo } from "./UserInfo.types"

async function getUserInfo(userId: string | undefined): Promise<UserInfo | undefined> {
  if (!userId) return

  const docRef = doc(db, "users", userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      username: docSnap.data().username,
      image: docSnap.data().image,
      is_admin: docSnap.data().is_admin,
      is_banned: docSnap.data().is_banned,
      auth_code: docSnap.data()?.mal_connect?.accessToken,
    }
  } else {
    console.log("No such document in NavBar/getUserInfo()!")
  }
}

export { getUserInfo }
