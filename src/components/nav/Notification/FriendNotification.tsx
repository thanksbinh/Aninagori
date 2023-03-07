import { useRouter } from "next/navigation";
import { UserInfo } from "../NavBar";
import { removeFriendRequest, beFriends } from "@/components/addFriend/friendRequest";
import { formatDuration, Notification } from "./Notification";
import { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";

interface Props {
  notification: Notification;
  myUserInfo: UserInfo;
}

const FriendNotification: React.FC<Props> = ({ notification, myUserInfo }) => {
  const router = useRouter()
  const [message, setMessage] = useState('')

  const handleAcceptFriend = async (e: React.MouseEvent) => {
    e.stopPropagation()

    setMessage("Friend request accepted!")
    beFriends(myUserInfo, { "id": notification.sender.id, "username": notification.sender.username, "image": notification.sender.image })
    
    setTimeout(() => {
      removeFriendRequest(myUserInfo, notification)
    }, 3000)
  }

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation()

    setMessage("Friend request rejected!")
    setTimeout(() => {
      removeFriendRequest(myUserInfo, notification)
    }, 1000)
  }

  const handleClickProfile = () => {
    const userRef = doc(db, "users", myUserInfo.id);
    if (notification.read) return;

    updateDoc(userRef, {
      friend_request_list: arrayRemove({
        id: notification.sender.id,
        username: notification.sender.username,
        image: notification.sender.image,
        timestamp: notification.timestamp,
        read: notification.read
      })
    });

    updateDoc(userRef, {
      friend_request_list: arrayUnion({
        id: notification.sender.id,
        username: notification.sender.username,
        image: notification.sender.image,
        timestamp: notification.timestamp,
        read: true
      })
    });

    router.push('/user/' + notification.sender.username)
  }

  return (
    <div onClick={handleClickProfile} className="flex items-center bg-white rounded-lg px-3 py-4 hover:cursor-pointer hover:bg-gray-100">
      <img
        src={notification.sender.image || '/images/default-profile-pic.png'}
        alt={`${notification.sender.username}'s avatar`}
        className="h-10 w-10 rounded-full mr-4"
      />
      <div>
        <p className="text-sm font-medium text-gray-900">
          {notification.sender.username} sent you a friend request.
        </p>
        {message ?
          <div className="text-xs text-gray-500">
            {message}
          </div> :
          <div>
            <button onClick={handleAcceptFriend} className="inline-block px-4 py-2 mt-2 mr-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
              Confirm
            </button>
            <button onClick={handleReject} className="inline-block px-4 py-2 mt-2 font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
              Delete
            </button>
          </div>
        }
        <p className="text-xs text-gray-500">
          {formatDuration(new Date().getTime() - notification.timestamp.toDate().getTime())} - {(notification.read || message) ? "read" : "not read"}
        </p>
      </div>
    </div>
  );
};

export default FriendNotification;
