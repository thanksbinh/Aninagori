import Link from "next/link";
import { getServerSession } from "next-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import ProfilePicture from "./profilePicture/ProfilePicture";
import SearchBar from "./search/SearchBar";
import NotificationBtn from "./notification/NotificationBtn";
import { BsChatLeftDotsFill } from 'react-icons/bs';
import Button from "../Button/Button";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export interface UserInfo {
  "id": string,
  "username": string,
  "image": string,
}

async function getUserInfo(userId: string): Promise<UserInfo | undefined> {
  if (!userId) return undefined

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

export default async function NavBar() {
  const session = await getServerSession(authOptions);
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId)

  return (
    <nav className="flex justify-between items-center px-8 fixed top-0 z-40 w-full h-14 header-fixed bg-[#4e5d78] shadow-md">
      <div className="flex items-center gap-10">
        <Link href="/" className="text-lg font-semibold">
          Aninagori
        </Link>
        <SearchBar />
      </div>
      {!myUserInfo ?
        <div>
          <Button small primary leftIcon={undefined} onClick={undefined} to={undefined} href={"/"} rightIcon={undefined}>
            Login
          </Button>
        </div>
        :
        <div className="flex items-center gap-2">
          <button title="message" className="flex item-center justify-center space-x-1 text-[#fff] bg-[#798597] hover:bg-[#94B0DD] p-3 rounded-full"><BsChatLeftDotsFill className="w-4 h-4" /></button>
          <NotificationBtn myUserInfo={myUserInfo} />
          <ProfilePicture myUserInfo={myUserInfo} />
        </div>
      }
    </nav>
  )
}
