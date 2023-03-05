import { FriendRequestDoc } from "@/components/addFriend/friendRequest";
import { db } from "@/firebase/firebase-app";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserInfo } from "../NavBar";
import NotificationComponent, { Notification } from "./NotificationComponent"

interface Props {
  myUserInfo: UserInfo
}

const NotificationContainer: React.FC<Props> = ({ myUserInfo }) => {
  const [userNoti, setUserNoti] = useState([])

  // Get notifications real-time
  useEffect(() => {
    if (!myUserInfo) return;

    const docRef = doc(db, "users", myUserInfo.id);
    const unsubscribe = onSnapshot(docRef, docSnap => {
      setUserNoti(docSnap.data()?.friend_request_list?.map((acc: FriendRequestDoc) => {
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
    })
    return () => {
      unsubscribe && unsubscribe();
    }
  }, [])

  return (
    <div className="absolute right-0 w-80 top-12 z-50 bg-white rounded-md shadow-lg">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-gray-800 font-semibold text-xl">Notification</h2>
        <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
      </div>
      <div>
        {userNoti?.length ?
          userNoti.map((noti: Notification, i: number) =>
            <NotificationComponent notification={noti} myUserInfo={myUserInfo} key={i} />)
          : <div className="flex items-center bg-white rounded-lg px-4 py-4"> Empty! </div>
        }
      </div>
    </div>
  )
}

export default NotificationContainer
