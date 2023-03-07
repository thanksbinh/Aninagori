import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { UserInfo } from "../NavBar";

export interface Notification {
  notification_id: string;
  sender: {
    id: string;
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

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  return 'less than a minute ago';
}

const FriendNotification: React.FC<Props> = ({ notification, myUserInfo }) => {
  const router = useRouter()

  const handleClickProfile = () => {
    router.push('/user/' + notification.sender.username)
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

export default FriendNotification;
