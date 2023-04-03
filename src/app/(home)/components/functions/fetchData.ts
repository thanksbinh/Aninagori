import { db } from "@/firebase/firebase-app"
import { UserInfo } from "@/global/UserInfo.types"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

async function getFriendList(myUserInfo: UserInfo): Promise<string[]> {
  const userDoc = doc(db, "users", myUserInfo.id)
  const snapshot = await getDoc(userDoc)
  return snapshot.data()?.friend_list?.reverse() || []
}

async function fetchMyAnimeList(myUserInfo: UserInfo) {
  const malRef = doc(db, "myAnimeList", myUserInfo.username)
  const myAnimeList = (await getDoc(malRef)).data()

  return myAnimeList;
}

async function fetchPostPreference(myUserInfo: UserInfo) {
  const prefRef = doc(db, "postPreferences", myUserInfo.username)
  const postPreference = await getDoc(prefRef)

  if (!postPreference.exists()) {
    await setDoc(prefRef, { last_view: serverTimestamp() }, { merge: true })
    return { last_view: 1 }
  }
  return postPreference.data();
}

export { fetchMyAnimeList, fetchPostPreference, getFriendList }