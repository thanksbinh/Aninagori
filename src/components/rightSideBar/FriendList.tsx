'use client'

import { db } from "@/firebase/firebase-app";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Friend {
  username: string;
  image: string;
}

async function getFriendList(userId: string): Promise<Friend[] | undefined> {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().friend_list;
  } else {
    console.log("No such document in NavBar/getUserInfo()!");
  }
}

const FriendList = () => {
  const session = useSession()
  const [friendList, setFriendList] = useState<Friend[]>([])

  useEffect(() => {
    if (session.status != 'authenticated') return;

    const myUserId = (session as any).data?.user?.id
    const docRef = doc(db, "users", myUserId);
    const unsubscribe = onSnapshot(docRef, docSnap => {
      setFriendList(docSnap.data()?.friend_list)
    })
    return () => {
      unsubscribe && unsubscribe();
    }
  }, [session.status])

  return (
    <div className="relative">
      <div className="flex justify-between items-center px-2 mb-4">
        <h2 className="text-gray-800 font-semibold text-xl">Friends</h2>
        <div className="hover:cursor-pointer hover:bg-gray-200 rounded-full p-2"><svg className="h-6 w-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="5" cy="12" r="1" />  <circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /></svg></div>
      </div>
      <div className="flex flex-col flex-wrap -mx-2">
        {friendList?.map((friend) => (
          <div key={friend.username} className="w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-4">
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={friend.image || '/images/default-profile-pic.png'}
                alt={friend.username}
              />
              <span className="ml-2 font-medium">{friend.username}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;