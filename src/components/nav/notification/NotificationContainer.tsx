'use client'

import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, doc, onSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc, writeBatch } from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SiThreedotjs } from "react-icons/si";
import { UserInfo } from "../../../global/UserInfo.types";
import FriendRequestComponent from "./FriendRequest";
import NotificationComponent from "./Notification";
import { Notification } from "./Notification.types";
import { noticationFilter } from "./notificationFilter";

interface Props {
  myUserInfo: UserInfo
  setUnreadNoti: Dispatch<SetStateAction<number>>
  showNotification: boolean
}

export async function markAsRead(username: string, notification: Notification) {
  const notificationsRef = doc(db, "notifications", username)
  const batch = writeBatch(db);

  batch.update(notificationsRef, {
    recentNotifications: arrayRemove(notification)
  });
  batch.update(notificationsRef, {
    recentNotifications: arrayUnion({
      ...notification,
      read: true
    })
  });

  await batch.commit();
}

const NotificationContainer: React.FC<Props> = ({ myUserInfo, setUnreadNoti, showNotification }) => {
  const [notification, setNotification] = useState<Notification[]>([])
  const [lastRead, setLastRead] = useState<Timestamp>()

  // Get notifications real-time
  useEffect(() => {
    const notificationsRef = doc(db, "notifications", myUserInfo.username);
    const unsubscribe = onSnapshot(notificationsRef, docSnap => {
      if (!docSnap.exists()) {
        setDoc(notificationsRef, {}, { merge: true })
      } else {
        docSnap.data().recentNotifications && setNotification(noticationFilter(docSnap.data().recentNotifications))
        setLastRead(docSnap.data().lastRead)
      }
    })

    return () => {
      unsubscribe && unsubscribe();
    }
  }, [])

  useEffect(() => {
    if (showNotification) return;

    lastRead && setUnreadNoti(notification.filter((noti) => noti.timestamp.seconds > lastRead.seconds).length)
  }, [notification, lastRead])

  useEffect(() => {
    if (!showNotification) return;

    setUnreadNoti(0);

    const notificationsRef = doc(db, "notifications", myUserInfo.username);
    updateDoc(notificationsRef, {
      lastRead: serverTimestamp()
    })
  }, [showNotification])

  return (
    <div className="absolute right-0 h-[23rem] w-80 top-12 z-40 bg-[#212733] rounded-b-md shadow-lg">
      <div className="flex justify-between items-center px-4 py-2">
        <h2 className="text-white font-semibold text-xl pt-4">Notification</h2>
        <div className="hover:cursor-pointer rounded-full p-2"><SiThreedotjs color="gray" className="h-5 w-5" aria-hidden="true" /></div>
      </div>
      <div className="h-full bg-[#212733] rounded-md pb-2">
        <div className="h-full overflow-y-auto bg-[#212733] rounded-md">
          {notification?.map((noti: Notification, i: number) =>
            (noti.type === "friend request") ?
              <FriendRequestComponent notification={noti} myUserInfo={myUserInfo} key={i} /> :
              <NotificationComponent notification={noti} myUserInfo={myUserInfo} key={i} />)}
          {!notification?.length && <div className="flex items-center text-black bg-white rounded-lg px-4 py-4"> Empty! </div>}
        </div>
      </div>
    </div>
  )
}

export default NotificationContainer
