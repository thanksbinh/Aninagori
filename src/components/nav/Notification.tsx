import { useRouter } from "next/navigation";

export interface Notification {
  notification_id: string;
  sender: {
    username: string;
    avatarUrl: string;
  };
  type: 'friend request' | 'like' | 'comment' | 'plan to watch';
  post: {
    id: string;
    title: string;
  };
  timestamp: string;
  read: boolean;
}

interface Props {
  notification: Notification;
}

const NotificationComponent: React.FC<Props> = ({ notification }) => {
  const router = useRouter()

  const handleClickProfile = () => {
    router.push('/' + notification.sender.username)
  }

  const handleAddFriend = (e: any) => {
    e.stopPropagation()
  }

  const handleReject = (e: any) => {
    e.stopPropagation()
  }

  if (notification.type === 'friend request') {
    return (
      <div className="flex items-center bg-white rounded-lg px-3 py-4 hover:cursor-pointer hover:bg-gray-100">
        <img
          className="h-10 w-10 rounded-full mr-4"
          src={notification.sender.avatarUrl || '/images/default-profile-pic.png'}
          alt={`${notification.sender.username}'s avatar`}
          onClick={handleClickProfile}
        />
        <div onClick={handleClickProfile}>
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
            {notification.timestamp} - {notification.read ? "read" : "not read"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-white rounded-lg px-3 py-4 hover:cursor-pointer hover:bg-gray-100">
      <img
        className="h-10 w-10 rounded-full mr-4"
        src={notification.sender.avatarUrl || '/images/default-profile-pic.png'}
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
