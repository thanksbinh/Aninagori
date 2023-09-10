import { getUserInfo } from "@/components/utils/getUserInfo";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
const Settings = dynamic(() => import("./components/Settings"))

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId)

  return (
    <>
      <Settings myUserInfo={myUserInfo} />
    </>
  )
}