import { getUserInfo } from "@/components/utils/getUserInfo";
import Button from "../button/Button";
import Logo from "./Logo";
import dynamic from "next/dynamic";
import MyAnimeListBtn from "./MyAnimeListBtn";
const ChatBtn = dynamic(() => import("./ChatBtn"))
const NotificationBtn = dynamic(() => import("./NotificationBtn"))
const ProfilePicture = dynamic(() => import("./ProfilePicture"))
const SearchBar = dynamic(() => import("./SearchBar"))

export default async function NavBar({ myUserId }: { myUserId: string | undefined }) {
  const myUserInfo = await getUserInfo(myUserId)

  return (
    <nav className="flex justify-between items-center px-6 py-2 fixed top-0 z-40 w-full header-fixed bg-ani-gray shadow-md border-b-[1px] border-ani-light-gray">
      <div className="flex items-center gap-5">
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
          <ChatBtn myUserInfo={myUserInfo} />
          <NotificationBtn myUserInfo={myUserInfo} />
          <MyAnimeListBtn myAnimeList_username={myUserInfo?.mal_connect?.myAnimeList_username} />
          <ProfilePicture myUserInfo={myUserInfo} />
        </div>
      }
    </nav>
  )
}
