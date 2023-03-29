'use client'

import { formatDuration } from "@/components/utils/formatDuration";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserInfo } from "../../../global/UserInfo.types";
import { Notification } from "./Notification.types";
import { NotiContext } from "./NotificationBtn";
import { markAsRead } from "./NotificationContainer";

interface Props {
  notification: Notification;
  myUserInfo: UserInfo;
}

const NotificationComponent: React.FC<Props> = ({ notification, myUserInfo }) => {
  const router = useRouter()
  const { setShowNotification } = useContext(NotiContext)

  const handleClickProfile = () => {
    setShowNotification(false)
    router.push('/user/' + notification.sender.username)

    if (!notification.read)
      markAsRead(myUserInfo.username, notification)
  }

  const handleClickNoti = () => {
    setShowNotification(false)
    router.push(notification.url)

    if (!notification.read)
      markAsRead(myUserInfo.username, notification)
  }

  return (
    <>
      <div className="flex items-center bg-[#212733] rounded-lg mx-2 px-3 py-4 hover:cursor-pointer hover:bg-slate-50/25">
        <img
          src={notification.sender.image || '/bocchi.jpg'}
          alt={`${notification.sender.username}'s avatar`}
          onClick={handleClickProfile}
          className="h-10 w-10 rounded-full mr-4"
        />
        <div onClick={handleClickNoti}>
          <p className={`text-sm font-medium text-white ${notification.read && "text-[#a5a5a5]"}`}>
            {notification.title}
          </p>
          <p className="text-xs text-[#377dff]">
            {formatDuration(new Date().getTime() - notification.timestamp.toDate().getTime())}
          </p>
        </div>
      </div>
    </>
  );
};

export default NotificationComponent;