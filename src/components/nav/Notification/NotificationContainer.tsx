import { FriendRequestDoc } from "@/components/addFriend/friendRequest";
import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserInfo } from "../NavBar";
import FriendNotification from "./FriendNotification"
import { Notification } from "./Notification"

interface Props {
  myUserInfo: UserInfo
  setUnreadCount: Dispatch<SetStateAction<number>>
  showNotification: boolean
}

const NotificationContainer: React.FC<Props> = ({ myUserInfo, setUnreadCount, showNotification }) => {
  const [userNoti, setUserNoti] = useState([])

  // Get notifications real-time
  useEffect(() => {
    const userRef = doc(db, "users", myUserInfo.id);
    const unsubscribe = onSnapshot(userRef, docSnap => {
      let unreadCount = 0
      setUserNoti(docSnap.data()?.friend_request_list?.map((acc: FriendRequestDoc) => {
        unreadCount += (acc.read == null) ? 1 : 0
        return {
          notification_id: docSnap.id,
          sender: {
            id: acc.id,
            username: acc.username,
            image: acc.image,
          },
          type: 'friend request',
          timestamp: acc.timestamp,
          read: acc.read,
        }
      }))
      setUnreadCount(unreadCount)
    })

    return () => {
      unsubscribe && unsubscribe();
    }
  }, [])

  useEffect(() => {
    if (showNotification) {
      const userRef = doc(db, "users", myUserInfo.id);
      userNoti?.forEach((noti: Notification) => {
        if (noti.read != null) return;

        updateDoc(userRef, {
          friend_request_list: arrayRemove({
            id: noti.sender.id,
            username: noti.sender.username,
            image: noti.sender.image,
            timestamp: noti.timestamp,
          })
        });

        updateDoc(userRef, {
          friend_request_list: arrayUnion({
            id: noti.sender.id,
            username: noti.sender.username,
            image: noti.sender.image,
            timestamp: noti.timestamp,
            read: false
          })
        });
      })
    }
  }, [showNotification])

  return (
    <div className="absolute right-0 w-80 top-12 z-50 bg-white rounded-md shadow-lg">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-gray-800 font-semibold text-xl">Notification</h2>
        <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
      </div>
      <div>
        {userNoti?.length ?
          userNoti.slice(0).reverse().map((noti: Notification, i: number) =>
            <FriendNotification notification={noti} myUserInfo={myUserInfo} key={i} />)
          : <div className="flex items-center bg-white rounded-lg px-4 py-4"> Empty! </div>
        }
      </div>
    </div>
  )
}

export default NotificationContainer
