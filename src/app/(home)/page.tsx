import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { getUserInfo } from "@/global/getUserInfo"
import PostForm from "./components/PostForm"
import Posts from "./components/PostContainer"
import { getUserAnimeUpdate } from "./components/getUserAnimeUpdate"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId)

  if (!myUserInfo) return null
  await getUserAnimeUpdate(myUserInfo)

  return (
    <div className="flex flex-col pt-10">
      <PostForm
        className="mt-4"
        avatarUrl={myUserInfo.image}
        username={myUserInfo.username}
        isBanned={!!myUserInfo.is_banned}
        malAuthCode={myUserInfo?.mal_connect?.accessToken}
      />

      <Posts myUserInfo={myUserInfo} />
    </div>
  )
}
