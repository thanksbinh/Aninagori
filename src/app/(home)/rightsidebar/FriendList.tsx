import Friend from '@/components/chat/Friend';
import { db } from '@/firebase/firebase-app';
import { getUserInfo } from '@/global/getUserInfo';
import { doc, getDoc } from 'firebase/firestore';
import { SiThreedotjs } from 'react-icons/si';

interface Friend {
  username: string
  image: string
}

async function getFriendList(userId?: string): Promise<Friend[] | undefined> {
  if (!userId) return

  const docRef = doc(db, "users", userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data().friend_list
  } else {
    console.log("No such document in NavBar/getUserInfo()!")
  }
}

export default async function FriendList({ myUserId }: { myUserId: string | undefined }) {
  const friendList = await getFriendList(myUserId)
  const myUserInfo = await getUserInfo(myUserId)
  if (!myUserInfo) return null

  return (
    <div className="relative">
      <div className="flex justify-between items-center pr-2 mb-4">
        <h2 className="text-ani-text-main font-semibold text-xl">Friends</h2>
        <div className="hover:cursor-pointer rounded-full p-2">
          <SiThreedotjs className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div className="flex flex-col flex-wrap -mx-2">
        {friendList?.map((friend) => (
          <div key={friend.username}>
            <Friend username={friend.username} image={friend.image} myUserInfo={myUserInfo} />
          </div>
        ))}
      </div>
    </div>
  )
}
