import { getUserInfo } from "@/components/utils/getUserInfo";
import { db } from "@/firebase/firebase-admin-app";
import { FriendInfoRaw } from "@/global/FriendInfo.types";
import { UserInfo } from "@/global/UserInfo.types";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { FieldValue } from "firebase-admin/firestore";
import { getServerSession } from "next-auth";
import '../globals.css';
import ContextProvider from "./HomeContext";
import Posts from "./components/PostContainer";
import AnimeRecommendList from "./components/leftsidebar/AnimeRecommendList";
import PostForm from './components/postForm/PostForm';
import FriendList from "./components/rightsidebar/FriendList";
import { FriendInfo } from "./components/rightsidebar/Friend";

async function getFriendList(myUserInfo: UserInfo): Promise<FriendInfo[]> {
  const userRef = db.doc(`users/${myUserInfo.id}`)
  const user = await userRef.get()
  const friendList = user.data()?.friend_list?.reverse()
  return friendList.map((friend: FriendInfoRaw) => {
    return {
      ...friend,
      anime_status: friend.anime_status ? {
        ...friend.anime_status,
        updated_at: friend.anime_status.updated_at.toDate()
      } : null
    }
  })
}

async function fetchMyAnimeList(myUserInfo: UserInfo) {
  const malRef = db.doc(`myAnimeList/${myUserInfo.username}`)
  const mal = await malRef.get()

  if (!mal.exists) { // init myAnimeList
    malRef.set({ last_updated: null }, { merge: true })
  }
  return mal.data();
}

async function fetchPostPreference(myUserInfo: UserInfo) {
  const postPrefRef = db.doc(`postPreferences/${myUserInfo.username}`)
  const postPref = await postPrefRef.get()

  // updateLastView
  postPrefRef.set({ last_view: FieldValue.serverTimestamp() }, { merge: true })

  return postPref ? JSON.parse(JSON.stringify(postPref.data())) : { last_view: 1 };
}

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

  return (
    <div className="flex justify-between pt-4">
      <ContextProvider myUserInfo={myUserInfo}>
        <div className="xl:block xl:flex-1 flex-shrink max-w-[320px]">
          <div className="hidden xl:block w-[320px] py-16 px-2 h-full fixed left-0 z-20 bg-ani-black">
            {/* @ts-expect-error Server Component */}
            <AnimeRecommendList myUserInfo={myUserInfo} potentialAnimes={postPreference.animeList} myAnimeList={myAnimeList} />
          </div>
        </div>

        <div className="xl:w-[55%] lg:w-3/5 md:w-4/5 w-full">
          <div className="h-screen flex flex-col items-center pt-10">
            <div className="w-[72%]">
              <PostForm
                myAnimeList={myAnimeList?.animeList}
              />
            </div>
            <div className="mb-4 w-full">
              <Posts
                myFriendList={myFriendList}
                myAnimeList={myAnimeList?.animeList}
                postPreference={postPreference}
              />
            </div>
          </div>
        </div >

        <div className="lg:block lg:flex-1 flex-shrink max-w-[320px]">
          <div className="hidden lg:block w-[320px] pt-16 px-2 h-screen fixed right-0 z-20 bg-ani-black">
            <FriendList myFriendList={myFriendList} myUserInfo={myUserInfo} />
          </div>
        </div>
      </ContextProvider >
    </div >
  )
}
