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
  timestamp: number;
  read: boolean;
}

interface Props {
  notification: Notification;
}

const Notification: React.FC<Props> = ({ notification }) => {
  const router = useRouter()

  const handleClickProfile = () => {
    router.push('/' + notification.sender.username)
  }

  return (
    <div className="flex items-center bg-white shadow rounded-lg mt-2 p-3 hover:cursor-pointer hover:bg-gray-100">
      <img
        className="h-10 w-10 rounded-full mr-4"
        src={notification.sender.avatarUrl}
        alt={`${notification.sender.username}'s avatar`}
        onClick={handleClickProfile}
      />
      {notification.type === 'friend request' ?
        <div onClick={handleClickProfile}>
          <p className="text-sm font-medium text-gray-900">
            {notification.sender.username} sent you a friend request.
          </p>
          <p className="text-sm text-gray-500">
            <button className="inline-block px-4 py-2 mt-2 mr-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
              Confirm
            </button>
            <button className="inline-block px-4 py-2 mt-2 font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
              Delete
            </button>
          </p>
        </div>
        :
        <div>
          <p className="text-sm font-medium text-gray-900">
            {notification.sender.username} {notification.type === 'like' ? 'liked' : 'commented on'} your post
          </p>
          <p className="text-sm text-gray-500">
            {notification.type === 'like' ? 'Liked' : 'Commented'} {notification.post.title}
          </p>
        </div>
      }
    </div>
  );
};

export default Notification;
