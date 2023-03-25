import Friend from '@/components/chat/Friend';
import { UserInfo } from '@/components/nav/NavBar';
import { db } from '@/firebase/firebase-app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { doc, getDoc } from 'firebase/firestore';
import { getServerSession } from 'next-auth';

export interface Friend {
  username: string;
  image: string;
}

async function getFriendList(userId: string): Promise<Friend[] | undefined> {
  if (!userId) return;

  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().friend_list;
  } else {
    console.log('No such document in NavBar/getUserInfo()!');
  }
}

async function getUserInfo(userId: string): Promise<UserInfo | undefined> {
  if (!userId) return;

  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      "id": docSnap.id,
      "username": docSnap.data().username,
      "image": docSnap.data().image,
    }
  } else {
    console.log("No such document in page/getUserInfo()!");
  }
}

export default async function FriendList() {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id
  const friendList = await getFriendList(myUserId)
  const myUserInfo = await getUserInfo(myUserId)

  if (!myUserInfo) return null


  return (
    <div className="relative">
      <div className="flex justify-between items-center px-2 mb-4">
        <h2 className="text-white font-semibold text-xl">Friends</h2>
        <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2">
          <svg
            className="h-6 w-6 text-gray-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" /> <circle cx="5" cy="12" r="1" /> <circle cx="12" cy="12" r="1" />{' '}
            <circle cx="19" cy="12" r="1" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col flex-wrap -mx-2">
        {friendList?.map((friend) => (
          <div key={friend.username}>
            <Friend username={friend.username} image={friend.image} myUserInfo={myUserInfo}/>
          </div>
        ))}
      </div>
    </div>
  );
};
