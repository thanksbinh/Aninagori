import FriendComponent, { Friend } from '@/app/(home)/rightsidebar/Friend';
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import Link from 'next/link';

export default async function FriendList({ myFriendList }: { myFriendList: Friend[] | undefined }) {
  return (
    <div className="h-full relative">
      <Link href="/landing" className="font-medium text-red-600 hover:text-red-500">To landing page</Link>
      <div className="flex justify-between items-center pr-2 mb-4">
        <h2 className="text-ani-text-main font-semibold text-xl">Friends</h2>
        <div className="hover:cursor-pointer rounded-full p-2">
          <BsThreeDots className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div className="h-full overflow-y-auto flex flex-col flex-wrap -mx-2">
        {myFriendList?.map((friend) => (
          <div key={friend.username}>
            <FriendComponent friendInfo={friend} />
          </div>
        ))}
      </div>
    </div>
  )
}
