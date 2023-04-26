'use client'

import { useRouter } from "next/navigation";
import { UserInfo } from "../../global/UserInfo.types";
import { removeFriendRequest, beFriends } from "@/components/friend/friendAction";
import { formatDuration } from "@/components/utils/formatData";
import { useContext, useState } from "react";
import { Notification } from "./Notification.types";
import { NotiContext } from "../nav/NotificationBtn";
import { markAsRead } from "./NotificationContainer";

interface Props {
  notification: Notification;
  myUserInfo: UserInfo;
}

const FriendRequestComponent: React.FC<Props> = ({ notification, myUserInfo }) => {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const { setShowNotification } = useContext(NotiContext)

  const handleAcceptFriend = async (e: React.MouseEvent) => {
    e.stopPropagation()

    setMessage("Friend request accepted!")
    await beFriends(myUserInfo, { "id": notification.sender.id, "username": notification.sender.username, "image": notification.sender.image })

    setTimeout(() => {
      setShowNotification(false)
      removeFriendRequest(myUserInfo, notification)
      setMessage('')
      router.refresh()
    }, 3000)
  }

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation()

    setMessage("Friend request rejected!")
    setTimeout(() => {
      setShowNotification(false)
      removeFriendRequest(myUserInfo, notification)
      setMessage('')
      router.refresh()
    }, 3000)
  }

  const handleClickProfile = () => {
    setShowNotification(false)
    router.push('/user/' + notification.sender.username)

    if (!notification.read)
      markAsRead(myUserInfo.username, notification)
  }

  return (
    <>
      <div onClick={handleClickProfile} className="flex items-center bg-[#212733] rounded-lg mt-1 mx-2 px-3 py-4 hover:cursor-pointer hover:bg-slate-50/25">
        <img
          src={notification.sender.image || '/bocchi.jpg'}
          alt={`${notification.sender.username}'s avatar`}
          className="h-10 w-10 rounded-full mr-4"
        />
        <div>
          <p className={`text-sm font-medium ${(notification.read || message) ? "text-[#a5a5a5]" : "text-white"}`}>
            {notification.sender.username} sent you a friend request.
          </p>
          {message ?
            <div className="text-xs text-gray-500">{message}</div> :
            <div>
              <button onClick={handleAcceptFriend} className="inline-block px-4 py-2 mt-2 mr-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600"> Confirm </button>
              <button onClick={handleReject} className="inline-block px-4 py-2 mt-2 font-medium text-ani-text-white bg-[#3a3b3c] rounded hover:bg-[#3a3b3c]/50"> Delete </button>
            </div>}
          <p className={`mt-1 text-xs ${(!notification.read && !message) ? "text-[#377dff]" : "text-[#a5a5a5]"}`}>
            {formatDuration(new Date().getTime() - notification.timestamp.toDate().getTime())}
          </p>
        </div>
      </div>
    </>
  );
};

export default FriendRequestComponent;
