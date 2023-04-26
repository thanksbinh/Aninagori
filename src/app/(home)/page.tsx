import { db } from "@/firebase/firebase-admin-app";
import { UserInfo } from "@/global/UserInfo.types";
import { getUserInfo } from "@/global/getUserInfo";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { FieldValue } from "firebase-admin/firestore";
import { getServerSession } from "next-auth";
import '../globals.css';
import ContextProvider from "./HomeContext";
import Posts from "./components/PostContainer";
import AnimeRecommendList from "./components/leftsidebar/AnimeRecommendList";
import PostForm from './components/postForm/PostForm';
import FriendList from "./components/rightsidebar/FriendList";

async function getFriendList(myUserInfo: UserInfo): Promise<string[]> {
  const userRef = db.doc(`users/${myUserInfo.id}`)
  const user = await userRef.get()
  const friendList = user.data()?.friend_list?.reverse()
  return friendList ? JSON.parse(JSON.stringify(friendList)) : []
}

async function fetchMyAnimeList(myUserInfo: UserInfo) {
  const malRef = db.doc(`myAnimeList/${myUserInfo.username}`)
  const mal = await malRef.get()

  if (!mal.exists) initMyAnimeList(malRef)
  return mal.data();
}

async function initMyAnimeList(malRef: any) {
  malRef.set({ last_updated: null }, { merge: true })
}

async function fetchPostPreference(myUserInfo: UserInfo) {
  const postPrefRef = db.doc(`postPreferences/${myUserInfo.username}`)
  const postPref = await postPrefRef.get()

  updateLastView(postPrefRef)
  return postPref ? JSON.parse(JSON.stringify(postPref.data())) : { last_view: 1 };
}

async function updateLastView(postPrefRef: any) {
  postPrefRef.set({ last_view: FieldValue.serverTimestamp() }, { merge: true })
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
  ]) as any

  return (
    <div className="flex justify-between pt-4">
      <ContextProvider myUserInfo={myUserInfo}>
        <div className="xl:block xl:flex-1 flex-shrink max-w-[320px]">
          <div className="hidden xl:block w-[320px] py-16 px-2 h-full fixed left-0 z-20 bg-ani-black">
            {/* @ts-expect-error Server Component */}
            <AnimeRecommendList myUserInfo={myUserInfo} potentialAnimes={postPreference.animeList} myAnimeList={myAnimeList} />
          </div>
        </div>

        <div className="lg:w-[55%] xl-between:w-[78%] w-full">
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
