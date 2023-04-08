import { getUserInfo } from "@/global/getUserInfo";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import '../globals.css';
import { fetchMyAnimeList, fetchPostPreference, getFriendList } from "./functions/fetchData";
import { syncAnimeUpdate, updateLastView } from "./functions/syncUpdates";
import Posts from "./components/PostContainer";
import PostForm from './components/postForm/PostForm';
import ContextProvider from "./HomeContext";
import AnimeRecommendList from "./components/leftsidebar/AnimeRecommendList";
import FriendList from "./components/rightsidebar/FriendList";

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
          <div className="hidden xl:block w-[360px] py-16 px-2 h-full fixed left-0 z-20 bg-ani-black">
            {/* @ts-expect-error Server Component */}
            <AnimeRecommendList myUserInfo={myUserInfo} potentialAnimes={postPreference.animeList} />
          </div>
        </div>

        <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 w-full">
          <div className="h-screen flex flex-col pt-10">
            <PostForm
              myAnimeList={myAnimeList?.animeList}
            />

            <Posts
              myFriendList={myFriendList}
              myAnimeList={myAnimeList?.animeList}
              postPreference={postPreference}
            />
          </div>
        </div >

        <div className="lg:block lg:flex-1 flex-shrink max-w-[320px]">
          <div className="hidden lg:block w-[320px] pt-16 px-2 h-screen fixed right-0 z-20 bg-ani-black">
            {/* @ts-expect-error Server Component */}
            <FriendList myFriendList={myFriendList} />
          </div>
        </div>
      </ContextProvider >
    </div >
  )
}
