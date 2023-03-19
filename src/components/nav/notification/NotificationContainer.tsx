'use client'

import { db } from "@/firebase/firebase-app";
import { doc, onSnapshot, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserInfo } from "../../../global/types";
import FriendRequestComponent from "./FriendRequest";
import NotificationComponent, { Notification } from "./Notification";

interface Props {
  myUserInfo: UserInfo
  setUnreadNoti: Dispatch<SetStateAction<number>>
  showNotification: boolean
}

const NotificationContainer: React.FC<Props> = ({ myUserInfo, setUnreadNoti, showNotification }) => {
  const [notification, setNotification] = useState<Notification[]>([])
  const [lastRead, setLastRead] = useState<Timestamp>()

  // Get notifications real-time
  useEffect(() => {
    const notificationsRef = doc(db, "notifications", myUserInfo.username);
    const unsubscribe = onSnapshot(notificationsRef, docSnap => {
      if (!docSnap.exists()) return;

      setNotification(docSnap.data()?.recentNotifications.sort((a: any, b: any) => b.timestamp - a.timestamp))
      setLastRead(docSnap.data().lastRead)
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
    if (showNotification) setUnreadNoti(0);

    const notificationsRef = doc(db, "notifications", myUserInfo.username);
    updateDoc(notificationsRef, {
      lastRead: serverTimestamp()
    })
  }, [showNotification])

  return (
    <div className="absolute right-0 w-80 top-12 z-40 bg-white rounded-md shadow-lg">
      <div className="flex justify-between items-center px-4 pt-2">
        <h2 className="text-gray-800 font-semibold text-xl pt-4">Notification</h2>
        <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
      </div>
      <div>
        {notification?.map((noti: Notification, i: number) =>
          (noti.type === "friend request") ?
            <FriendRequestComponent notification={noti} myUserInfo={myUserInfo} key={i} /> :
            <NotificationComponent notification={noti} myUserInfo={myUserInfo} key={i} />)}
        {!notification?.length && <div className="flex items-center text-black bg-white rounded-lg px-4 py-4"> Empty! </div>}
      </div>
    </div>
  )
}

export default NotificationContainer
