import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { setDoc, doc, getDoc } from "firebase/firestore";

export async function getUserAnimeUpdate(myUserInfo: UserInfo) {
  if (!myUserInfo.mal_connect) {
    await setDoc(doc(db, "myAnimeList", myUserInfo.username), {
      last_updated: null,
    }, { merge: true })
    return;
  }

  const urlCheck = "https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=1&sort=list_updated_at"
  const userUpdateCheck = await fetch(urlCheck, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${myUserInfo.mal_connect?.accessToken}`,
    },
  }).then((res) => res.json())

  const malRef = doc(db, "myAnimeList", myUserInfo.username)
  const myAnimeList = (await getDoc(malRef)).data()

  // If update is not needed
  if (userUpdateCheck?.data[0].list_status.updated_at === myAnimeList?.last_updated) return;

  const url = "https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=1000&sort=list_updated_at"
  const userUpdate = await fetch(url, {
    headers: {
      Authorization: `Bearer ${myUserInfo.mal_connect?.accessToken}`,
    },
  }).then((res) => res.json())

  await setDoc(doc(db, "myAnimeList", myUserInfo.username), {
    animeList: userUpdate.data,
    last_updated: userUpdate.data[0].list_status.updated_at,
  }, { merge: true })
}