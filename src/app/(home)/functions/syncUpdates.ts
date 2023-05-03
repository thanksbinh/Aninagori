import { db } from "@/firebase/firebase-app"
import { FriendInfo } from "@/global/FriendInfo.types"
import { UserInfo } from "@/global/UserInfo.types"
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, where, writeBatch } from "firebase/firestore"

async function getFriendList(myUserInfo: UserInfo): Promise<FriendInfo[]> {
  const snapshot = await getDoc(doc(db, "users", myUserInfo.id))
  const friendList = snapshot.data()?.friend_list?.reverse()
  return friendList ? JSON.parse(JSON.stringify(friendList)) : []
}

export async function updateStatusOnFriendLists(myUserInfo: UserInfo, postAnimeData: any) {
  if (postAnimeData.status === "plan_to_watch") return

  const myFriendList = await getFriendList(myUserInfo)

  const friendsDocsPromises = myFriendList.map((friend: FriendInfo) => {
    const docQuery = query(collection(db, "users"), where("username", "==", friend.username))
    return getDocs(docQuery)
  })
  const friendsDocs = await Promise.all(friendsDocsPromises)

  const updatePromises = friendsDocs.map((friendDoc: any) => {
    if (!friendDoc.empty) {
      const docRef = friendDoc.docs[0].ref
      const oldInfo = friendDoc.docs[0].data().friend_list?.find((info: FriendInfo) => info.username === myUserInfo.username)

      if (!oldInfo) return
      const batch = writeBatch(db)

      batch.update(docRef, {
        friend_list: arrayRemove(oldInfo),
      })
      batch.update(docRef, {
        friend_list: arrayUnion({
          ...oldInfo,
          anime_status: {
            status: postAnimeData.status,
            updated_at: new Date(),
            title: postAnimeData.anime_name,
          },
        }),
      })

      return batch.commit()
    }
  })
  await Promise.all(updatePromises)
}
