import { getServerSession } from "next-auth";
import Settings from "./components/Settings";
import TabSelector from "./components/TabSelector";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getUserInfo } from "@/global/getUserInfo";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id

  const myUserInfo = await getUserInfo(myUserId)
  if (!myUserInfo) return null

  return (
    <div className="flex">
      <div className="hidden sm:block w-[360px] h-screen py-20 px-2 bg-ani-gray border-r-[1px] border-ani-light-gray">
        <TabSelector />
      </div>

      <div className="flex-1 pt-20 mx-14">
        <Settings myUserInfo={myUserInfo} />
      </div>
    </div>
  )
}