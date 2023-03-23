'use client'

import { useRouter } from "next/navigation";
import { UserInfo } from "../../../global/UserInfo.types";
import { removeFriendRequest, beFriends } from "@/components/friend/friendAction";
import { formatDuration } from "@/components/utils/formatDuration";
import { useContext, useState } from "react";
import { Notification } from "./Notification.types";
import { NotiContext } from "./NotificationBtn";
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
    router.refresh()

    setTimeout(() => {
      setShowNotification(false)
      removeFriendRequest(myUserInfo, notification)
      setMessage('')
    }, 3000)
  }

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation()

    setMessage("Friend request rejected!")
    setTimeout(() => {
      setShowNotification(false)
      removeFriendRequest(myUserInfo, notification)
      setMessage('')
    }, 1000)
  }

  const handleClickProfile = () => {
    setShowNotification(false)
    router.push('/user/' + notification.sender.username)

    if (!notification.read)
      markAsRead(myUserInfo.username, notification)
  }

  return (
    <div onClick={handleClickProfile} className="flex items-center bg-white rounded-lg px-3 py-4 hover:cursor-pointer hover:bg-gray-100">
      <img
        src={notification.sender.image || '/bocchi.jpg'}
        alt={`${notification.sender.username}'s avatar`}
        className="h-10 w-10 rounded-full mr-4"
      />
      <div>
        <p className="text-sm font-medium text-gray-900">
          {notification.sender.username} sent you a friend request.
        </p>
        {message ?
          <div className="text-xs text-gray-500">{message}</div> :
          <div>
            <button onClick={handleAcceptFriend} className="inline-block px-4 py-2 mt-2 mr-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600"> Confirm </button>
            <button onClick={handleReject} className="inline-block px-4 py-2 mt-2 font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"> Delete </button>
          </div>}
        <p className="text-xs text-gray-500">
          {formatDuration(new Date().getTime() - notification.timestamp.toDate().getTime())} - {(notification.read || message) ? "read" : "not read"}
        </p>
      </div>
    </div>
  );
};

export default FriendRequestComponent;
