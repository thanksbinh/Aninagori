import { db } from "@/firebase/firebase-app";
import { getUserInfo } from "@/global/getUserInfo";
import { UserInfo } from "@/global/UserInfo.types";
import { doc, setDoc } from "firebase/firestore";
import { BsChatLeftDotsFill } from 'react-icons/bs';
import Button from "../button/Button";
import Logo from "./Logo";
import NotificationBtn from "./notification/NotificationBtn";
import ProfilePicture from "./profilePicture/ProfilePicture";
import SearchBar from "./SearchBar";

async function getUserAnimeUpdate(myUserInfo: UserInfo) {
  const url = "https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=1000"
  const userUpdate = await fetch(url, {
    headers: {
      Authorization: `Bearer ${myUserInfo.mal_connect?.accessToken}`,
    },
  }).then((res) => res.json())

  console.log(userUpdate)
  await setDoc(doc(db, "myAnimeList", myUserInfo.username), {
    animeList: userUpdate.data
  }, { merge: true })
  console.log("update complete")
}

export default async function NavBar({ myUserId }: { myUserId: string | undefined }) {
  const myUserInfo = await getUserInfo(myUserId)

  // if (myUserInfo)
  //   await getUserAnimeUpdate(myUserInfo)

  return (
    <nav className="flex justify-between items-center px-8 fixed top-0 z-40 w-full h-14 header-fixed bg-ani-black shadow-md">
      <div className="flex gap-5">
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
        <div className="flex items-center gap-3">
          <button title="message" className="flex item-center justify-center space-x-1 text-[#fff] bg-[#798597] hover:bg-[#94B0DD] p-3 rounded-full"><BsChatLeftDotsFill className="w-4 h-4" /></button>
          <NotificationBtn myUserInfo={myUserInfo} />
          <ProfilePicture myUserInfo={myUserInfo} />
        </div>
      }
    </nav>
  )
}
