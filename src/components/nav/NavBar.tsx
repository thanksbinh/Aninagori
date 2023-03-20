import { db } from "@/firebase/firebase-app";
import { doc, getDoc } from "firebase/firestore";
import { BsChatLeftDotsFill } from 'react-icons/bs';
import { UserInfo } from "../../global/types";
import Button from "../button/Button";
import Logo from "./Logo";
import NotificationBtn from "./notification/NotificationBtn";
import ProfilePicture from "./profilePicture/ProfilePicture";
import SearchBar from "./SearchBar";

async function getUserInfo(userId: string | undefined): Promise<UserInfo | undefined> {
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
    console.log("No such document in NavBar/getUserInfo()!");
  }
}

export default async function NavBar({ myUserId }: { myUserId: string | undefined }) {
  const myUserInfo = await getUserInfo(myUserId)

  return (
    <nav className="flex justify-between items-center px-8 fixed top-0 z-40 w-full h-14 header-fixed bg-ani-light-gray shadow-md">
      <div className="flex items-center gap-10">
        <Logo />
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
