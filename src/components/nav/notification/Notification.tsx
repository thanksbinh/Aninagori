import { formatDuration } from "@/components/utils/formatDuration";
import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { UserInfo } from "../../../global/UserInfo";

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
  read: boolean;
}

interface Props {
  notification: Notification;
  myUserInfo: UserInfo;
}

const NotificationComponent: React.FC<Props> = ({ notification, myUserInfo }) => {
  const router = useRouter()

  const handleClickProfile = () => {
    router.push('/user/' + notification.sender.username)
  }

  const handleClickNoti = () => {
    const userRef = doc(db, "users", myUserInfo.id);
    if (notification.read) return;

    updateDoc(userRef, {
      notification: arrayRemove(notification)
    });

    updateDoc(userRef, {
      notification: arrayUnion({
        ...notification,
        read: true
      })
    });

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