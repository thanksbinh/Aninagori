import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserInfo } from "../NavBar";
import FriendRequestComponent, { FriendRequest } from "./FriendRequest"
import NotificationComponent, { Notification } from "./Notification";

interface Props {
  myUserInfo: UserInfo
  setUnreadCount: Dispatch<SetStateAction<number>>
  showNotification: boolean
}

const NotificationContainer: React.FC<Props> = ({ myUserInfo, setUnreadCount, showNotification }) => {
  const [friendRequest, setFriendRequest] = useState([])
  const [notification, setNotification] = useState([])

  // Get notifications real-time
  useEffect(() => {
    const userRef = doc(db, "users", myUserInfo.id);
    const unsubscribe = onSnapshot(userRef, docSnap => {
      let unreadCount = 0
      setFriendRequest(docSnap.data()?.friend_request_list?.map((acc: FriendRequest) => {
        unreadCount += (acc.read == null) ? 1 : 0
        return acc
      }))
      setNotification(docSnap.data()?.notification?.map((noti: Notification) => {
        unreadCount += (noti.read == null) ? 1 : 0
        return noti
      }))
      setUnreadCount(unreadCount)
    })

    return () => {
      unsubscribe && unsubscribe();
    }
  }, [])

  useEffect(() => {
    if (!showNotification) return;

    const userRef = doc(db, "users", myUserInfo.id);

    friendRequest?.forEach((noti: FriendRequest) => {
      if (noti.read != null) return;
      updateDoc(userRef, {
        friend_request_list: arrayRemove(noti)
      });
      updateDoc(userRef, {
        friend_request_list: arrayUnion({
          ...noti,
          read: false
        })
      });
    })

    notification?.forEach((noti: Notification) => {
      if (noti.read != null) return;
      updateDoc(userRef, {
        notification: arrayRemove(noti)
      });
      updateDoc(userRef, {
        notification: arrayUnion({
          ...noti,
          read: false
        })
      });
    })
  }, [showNotification])

  return (
    <div className="absolute right-0 w-80 top-12 z-50 bg-white rounded-md shadow-lg">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-gray-800 font-semibold text-xl pt-4">Notification</h2>
        <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
      </div>
      <div>
        {friendRequest?.slice(0).reverse().map((noti: FriendRequest, i: number) =>
          <FriendRequestComponent notification={noti} myUserInfo={myUserInfo} key={i} />)
        }
        {notification?.slice(0).reverse().map((noti: Notification, i: number) =>
          <NotificationComponent notification={noti} myUserInfo={myUserInfo} key={i} />)
        }
        {!(friendRequest?.length || notification?.length) ? <div className="flex items-center text-black bg-white rounded-lg px-4 py-4"> Empty! </div> : null}
      </div>
    </div>
  )
}

export default NotificationContainer
