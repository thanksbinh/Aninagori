import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserInfo } from "../../../global/types";
import FriendRequestComponent, { FriendRequest } from "./FriendRequest"
import NotificationComponent, { Notification } from "./Notification";

interface Props {
  myUserInfo: UserInfo
  setUnreadNoti: Dispatch<SetStateAction<number>>
  setUnreadFriendReq: Dispatch<SetStateAction<number>>
  showNotification: boolean
}

const NotificationContainer: React.FC<Props> = ({ myUserInfo, setUnreadNoti, setUnreadFriendReq, showNotification }) => {
  const [friendRequest, setFriendRequest] = useState([])
  const [notification, setNotification] = useState<Notification[]>([])

  // Get notifications real-time
  useEffect(() => {
    const userRef = doc(db, "users", myUserInfo.id);
    const unsubscribe = onSnapshot(userRef, docSnap => {
      let count = 0
      setFriendRequest(docSnap.data()?.friend_request_list?.map((doc: any) => {
        count += (doc.read == null) ? 1 : 0
        return doc
      }))
      setUnreadFriendReq(count)
    })

    const notificationsRef = query(collection(db, 'users', myUserInfo.id, "notifications"), orderBy("timestamp", "desc"));
    const unsubscribe1 = onSnapshot(notificationsRef, docSnap => {
      let count = 0
      setNotification(docSnap.docs.map((doc: any) => {
        count += (doc.data().read == null) ? 1 : 0
        return doc.data()
      }))
      setUnreadNoti(count)
    })

    return () => {
      unsubscribe && unsubscribe();
      unsubscribe1 && unsubscribe1();
    }
  }, [])

  // read: null -> false
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

    async function updateNotiStatus() {
      const notificationsRef = collection(db, 'users', myUserInfo.id, "notifications")
      const notiQuery = query(notificationsRef, where("read", "==", null))
      const docSnap = await getDocs(notiQuery)
      docSnap.forEach((doc) => {
        updateDoc(doc.ref, { read: false })
      })
    }

    updateNotiStatus()
  }, [showNotification])

  return (
    <div className="absolute right-0 w-80 top-12 z-40 bg-white rounded-md shadow-lg">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-gray-800 font-semibold text-xl pt-4">Notification</h2>
        <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
      </div>
      <div>
        {friendRequest?.slice(0).reverse().map((noti: FriendRequest, i: number) =>
          <FriendRequestComponent notification={noti} myUserInfo={myUserInfo} key={i} />)
        }
        {notification?.map((noti: Notification, i: number) =>
          <NotificationComponent notification={noti} myUserInfo={myUserInfo} key={i} />)
        }
        {!(friendRequest?.length || notification?.length) && <div className="flex items-center text-black bg-white rounded-lg px-4 py-4"> Empty! </div>}
      </div>
    </div>
  )
}

export default NotificationContainer
