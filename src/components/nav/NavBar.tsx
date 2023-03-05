import { db } from "@/firebase/firebase-app";
import { doc, getDoc } from "firebase/firestore";
import { Session } from "next-auth";
import Link from "next/link";
import ProfilePicture from "./ProfilePicture";
import SearchBar from "./SearchBar";
import NotificationBtn from "./Notification/NotificationBtn";
import NotificationContainer from "./Notification/NotificationContainer";
import { userInfo } from "os";

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
  const myUserId = (session?.user as any).id
  const myUserInfo = await getUserInfo(myUserId)

  return (
    <nav className="py-2 border-b-2 px-4 flex justify-between items-center sticky top-0 z-50 bg-white">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-lg font-semibold">
          Aninagori
        </Link>
        <SearchBar myUserInfo={myUserInfo} />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBtn>
          {myUserInfo ? <NotificationContainer myUserInfo={myUserInfo} /> : null}
        </NotificationBtn>
        <ProfilePicture myUserInfo={myUserInfo} />
      </div>
    </nav>
  )
}
