import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, collection, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { UserInfo } from "../NavBar";
import { makeFriendRequest, removeFriendRequest, beFriends } from "@/components/addFriend/friendRequest";

export interface Notification {
  notification_id: string;
  sender: {
    username: string;
    image: string;
  };
  type: 'friend request' | 'like' | 'comment' | 'plan to watch';
  post: {
    id: string;
    title: string;
  };
  timestamp: Timestamp;
  read: boolean;
}

interface Props {
  notification: Notification;
  myUserInfo: UserInfo;
}

const NotificationComponent: React.FC<Props> = ({ notification, myUserInfo }) => {
  const router = useRouter()

  const handleAddFriend = async (e: React.MouseEvent) => {
    e.stopPropagation()

    beFriends(myUserInfo, notification)
    removeFriendRequest(myUserInfo, notification)
  }

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation()

    removeFriendRequest(myUserInfo, notification)
  }

  const handleClickProfile = () => {
    router.push('/' + notification.sender.username)
  }

  if (notification.type === 'friend request') {
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
          <div>
            <button onClick={handleAddFriend} className="inline-block px-4 py-2 mt-2 mr-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
              Confirm
            </button>
            <button onClick={handleReject} className="inline-block px-4 py-2 mt-2 font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
              Delete
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {new Date().getTime() - notification.timestamp.toDate().getTime() + "s ago"} - {notification.read ? "read" : "not read"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-white rounded-lg px-3 py-4 hover:cursor-pointer hover:bg-gray-100">
      <img
        className="h-10 w-10 rounded-full mr-4"
        src={notification.sender.image || '/images/default-profile-pic.png'}
        alt={`${notification.sender.username}'s avatar`}
        onClick={handleClickProfile}
      />
      <div>
        <p className="text-sm font-medium text-gray-900">
          {notification.sender.username} {notification.type === 'like' ? 'liked' : 'commented on'} your post
        </p>
        <p className="text-sm text-gray-500">
          {notification.type === 'like' ? 'Liked' : 'Commented'} {notification.post.title}
        </p>
      </div>
    </div>
  );
};

export default NotificationComponent;
