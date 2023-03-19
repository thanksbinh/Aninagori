'use client'

import { formatDuration } from "@/components/utils/formatDuration";
import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, doc, Timestamp, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { UserInfo } from "../../../global/types";

export interface Notification {
  title: string;
  url: string;
  sender: {
    id: string;
    username: string;
    image: string;
  };
  type: string;
  timestamp: Timestamp;
  read: boolean | null;
}

interface Props {
  notification: Notification;
  myUserInfo: UserInfo;
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

const NotificationComponent: React.FC<Props> = ({ notification, myUserInfo }) => {
  const router = useRouter()

  const handleClickProfile = () => {
    if (notification.read) return;
    markAsRead(myUserInfo.username, notification)
    router.push('/user/' + notification.sender.username)
  }

  const handleClickNoti = () => {
    if (notification.read) return;
    markAsRead(myUserInfo.username, notification)
    router.push(notification.url)
  }

  return (
    <div className="flex items-center bg-white rounded-lg px-3 py-4 hover:cursor-pointer hover:bg-gray-100">
      <img
        src={notification.sender.image || '/bocchi.jpg'}
        alt={`${notification.sender.username}'s avatar`}
        onClick={handleClickProfile}
        className="h-10 w-10 rounded-full mr-4"
      />
      <div onClick={handleClickNoti}>
        <p className="text-sm font-medium text-gray-900">
          {notification.title}
        </p>
        <p className="text-xs text-gray-500">
          {formatDuration(new Date().getTime() - notification.timestamp.toDate().getTime())} - {notification.read ? "read" : "not read"}
        </p>
      </div>
    </div>
  );
};

export default NotificationComponent;