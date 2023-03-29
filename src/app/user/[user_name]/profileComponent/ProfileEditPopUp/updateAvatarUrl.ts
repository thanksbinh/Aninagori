import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

async function updateAvatarUrl(userId: string, avatarUrl: string) {
  const docRef = doc(db, "users", userId)

  const oldDoc = await getDoc(docRef)
  const friendList = oldDoc.data()?.friend_list.map((friend: any) => friend.username)

  await Promise.all([
    updateDoc(docRef, { image: avatarUrl }),
    updateAvatarFriendList(oldDoc.data()?.username, friendList, avatarUrl)
  ])
}

async function updateAvatarFriendList(myUsername: string, friendList: string[], avatarUrl: string) {
  const newInfo = {
    image: avatarUrl,
    username: myUsername,
  }

  const friendsDocsPromises = friendList.map((username: string) => {
    const docQuery = query(collection(db, "users"), where("username", "==", username))
    return getDocs(docQuery)
  })
  const friendsDocs = await Promise.all(friendsDocsPromises)

  const updatePromises = friendsDocs.map((friendDoc: any) => {
    if (!friendDoc.empty) {
      const docRef = friendDoc.docs[0].ref
      const oldInfo = friendDoc.docs[0].data().friend_list.find((myInfo: any) => myInfo.username === newInfo.username)

      return Promise.all([
        updateDoc(docRef, {
          friend_list: arrayRemove(oldInfo)
        }),
        updateDoc(docRef, {
          friend_list: arrayUnion(newInfo)
        }),
      ])
    }
  })
  await Promise.all(updatePromises)
}

export { updateAvatarUrl }