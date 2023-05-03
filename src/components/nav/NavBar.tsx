import { getUserInfo } from "@/components/utils/getUserInfo";
import Button from "../button/Button";
import ChatBtn from "./ChatBtn";
import Logo from "./Logo";
import NotificationBtn from "./NotificationBtn";
import ProfilePicture from "./ProfilePicture";
import SearchBar from "./SearchBar";

export default async function NavBar({ myUserId }: { myUserId: string | undefined }) {
  const myUserInfo = await getUserInfo(myUserId)

  return (
    <nav className="flex justify-between items-center px-8 fixed top-0 z-40 w-full h-14 header-fixed bg-ani-gray shadow-md border-b-[1px] border-ani-light-gray">
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
          <ProfilePicture myUserInfo={myUserInfo} />
        </div>
      }
    </nav>
  )
}
