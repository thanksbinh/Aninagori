import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { setDoc, doc, collection, getDocs, query, where, updateDoc, arrayRemove, arrayUnion, serverTimestamp } from "firebase/firestore";
import { getFriendList } from "./fetchData";

export async function updateLastView(myUserInfo: UserInfo) {
  const preferenceDoc = doc(db, "postPreferences", myUserInfo.username)
  await setDoc(preferenceDoc, { last_view: serverTimestamp() }, { merge: true })
}

async function needUpdate(myUserInfo: UserInfo, myAnimeList: any): Promise<boolean | undefined> {
  try {
    const urlCheck = "https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=1&sort=list_updated_at"
    const userUpdateCheck = await fetch(urlCheck, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${myUserInfo.mal_connect?.accessToken}`,
      },
    }).then((res) => res.json())

    if (userUpdateCheck?.data[0].list_status.updated_at != myAnimeList?.last_updated) return true;
  } catch (error) {
    console.log(error)
  }
}

async function updateMyAnimeList(myUserInfo: UserInfo, userUpdate: any) {
  await setDoc(doc(db, "myAnimeList", myUserInfo.username), {
    animeList: userUpdate.data,
    last_updated: userUpdate.data[0].list_status.updated_at,
  }, { merge: true })
}

export async function updateStatusOnFriendLists(myUserInfo: UserInfo, postAnimeData: any) {
  const myFriendList = await getFriendList(myUserInfo)

  const friendsDocsPromises = myFriendList.map((friend: any) => {
    const docQuery = query(collection(db, "users"), where("username", "==", friend.username))
    return getDocs(docQuery)
  })
  const friendsDocs = await Promise.all(friendsDocsPromises)

  const updatePromises = friendsDocs.map((friendDoc: any) => {
    if (!friendDoc.empty) {
      const docRef = friendDoc.docs[0].ref
      const oldInfo = friendDoc.docs[0].data().friend_list.find((info: any) => info.username === myUserInfo.username)

      return Promise.all([
        updateDoc(docRef, {
          friend_list: arrayRemove(oldInfo)
        }),
        updateDoc(docRef, {
          friend_list: arrayUnion({
            ...oldInfo, anime_status: {
              status: postAnimeData.status,
              updated_at: new Date(),
              title: postAnimeData.anime_name,
            }
          })
        }),
      ])
    }
  })
  await Promise.all(updatePromises)
}

export async function syncAnimeUpdate(myUserInfo: UserInfo, myFriendList: any, myAnimeList: any) {
  if (!myUserInfo.mal_connect) {
    if (!myAnimeList) {
      await setDoc(doc(db, "myAnimeList", myUserInfo.username), {
        last_updated: null,
      }, { merge: true })
    }
    return;
  }
  if (!(await needUpdate(myUserInfo, myAnimeList))) {
    return;
  }

  try {
    const url = "https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=1000&sort=list_updated_at"
    const userUpdate = await fetch(url, {
      headers: {
        Authorization: `Bearer ${myUserInfo.mal_connect.accessToken}`,
      },
    }).then((res) => res.json())

    await updateMyAnimeList(myUserInfo, userUpdate)
  } catch (error) {
    console.log(error)
  }
}