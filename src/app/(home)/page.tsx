import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { getUserInfo } from "@/global/getUserInfo"
import PostForm from "./components/PostForm"
import Posts from "./components/PostContainer"
import AnimeRecommendList from "./leftsidebar/AnimeRecommendList"
import FriendList from "./rightsidebar/FriendList"
import ContextProvider from "./HomeContext"
import { getFriendList, fetchPostPreference, fetchMyAnimeList } from "./components/functions/fetchData"
import { syncAnimeUpdate, updateLastView } from "./components/functions/syncUpdates"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId)

  if (!myUserInfo) return null

  const [myFriendList, postPreference, myAnimeList] = await Promise.all([
    getFriendList(myUserInfo),
    fetchPostPreference(myUserInfo),
    fetchMyAnimeList(myUserInfo)
  ])

  syncAnimeUpdate(myUserInfo, myAnimeList)
  updateLastView(myUserInfo)

  return (
    <div className="flex justify-between pt-4">
      <ContextProvider myUserInfo={myUserInfo}>
        <div className="xl:block xl:flex-1 flex-shrink max-w-[320px]">
          <div className="hidden xl:block max-w-[360px] py-16 px-2 h-full fixed left-0 z-20 bg-ani-black">
            {/* @ts-expect-error Server Component */}
            <AnimeRecommendList myUsername={myUserInfo.username} potentialAnimes={postPreference.animeList} />
          </div>
        </div>

        <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 w-full">
          <div className="h-screen flex flex-col pt-10">
            <PostForm
              avatarUrl={myUserInfo.image}
              username={myUserInfo.username}
              isBanned={!!myUserInfo.is_banned}
              malAuthCode={myUserInfo?.auth_code}
            />

            <Posts
              myUserInfo={myUserInfo}
              myFriendList={myFriendList}
              myAnimeList={myAnimeList?.animeList}
              postPreference={postPreference}
            />
          </div>
        </div>

        <div className="lg:block lg:flex-1 flex-shrink max-w-[320px]">
          <div className="hidden lg:block w-[320px] pt-16 px-2 h-screen fixed right-0 z-20 bg-ani-black">
            {/* @ts-expect-error Server Component */}
            <FriendList myFriendList={myFriendList} />
          </div>
        </div>
      </ContextProvider>
    </div>
  )
}
