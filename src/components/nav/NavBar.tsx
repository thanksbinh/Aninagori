import Link from "next/link";
import { Session } from "next-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import ProfilePicture from "./ProfilePicture";
import SearchBar from "./SearchBar";
import NotificationBtn from "./notification/NotificationBtn";

export interface UserInfo {
  "id": string,
  "username": string,
  "image": string,
}

async function getUserInfo(userId: string): Promise<UserInfo | undefined> {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      "id": docSnap.id,
      "username": docSnap.data().username,
      "image": docSnap.data().image,
    }
  } else {
    console.log("No such document in NavBar/getUserInfo()!");
  }
}

export default async function NavBar({ session }: { session: Session | null }) {
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId)

  return (
    <nav className="py-2 border-b-2 px-4 flex justify-between items-center fixed top-0 z-50 w-full bg-white">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-lg font-semibold">
          Aninagori
        </Link>
        {myUserInfo ? <SearchBar myUserInfo={myUserInfo} /> : null}
      </div>
      <div className="flex items-center gap-2">
        <NotificationBtn myUserInfo={myUserInfo} />
        <ProfilePicture myUserInfo={myUserInfo} />
      </div>
    </nav>
  )
}
