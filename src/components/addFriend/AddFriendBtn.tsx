'use client'

import { db } from "@/firebase/firebase-app";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { UserInfo } from "../nav/NavBar";
import { beFriends, FriendRequestDoc, makeFriendRequest, removeFriendRequestByRequest } from "./friendRequest";

export default function AddFriendBtn({ myUserInfo, userInfo, onClick }: { myUserInfo: UserInfo, userInfo: UserInfo, onClick: any }) {
  const [requesting, setRequesting] = useState(false)

  const handleAddFriend = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setRequesting(true)

    // Todo: check if userInfo.username in myUserInfo.request_list
    const docRef = doc(db, "users", myUserInfo.id);
    const docSnap = await getDoc(docRef)

    if (docSnap.exists() && docSnap.data().friend_request_list?.map((doc: FriendRequestDoc) => doc.username).includes(userInfo.username)) {
      beFriends(myUserInfo, userInfo)
      docSnap.data().friend_request_list.forEach((doc: FriendRequestDoc) => {
        if (doc.username === userInfo.username) {
          removeFriendRequestByRequest(myUserInfo, {
            id: doc.id,
            username: doc.username,
            image: doc.image,
            timestamp: doc.timestamp,
            read: doc.read,
          })
        }
      })
    } else {
      makeFriendRequest(myUserInfo, userInfo.id)
    }

    await onClick()
    setTimeout(() => {
      setRequesting(false)
    }, 500)
  }

  return (
    <button onClick={(e) => handleAddFriend(e)} className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2">
      {
        !requesting ?
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> :
          <svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M5 12l5 5l10 -10" /></svg>
      }
    </button>
  )
}
