/* eslint-disable @next/next/no-img-element */
import PostForm from "@/app/(home)/components/postForm/PostForm"
import * as apiServices from "@/app/api/apiServices/apiServicesConfig"
import AnimeFavorite from "@/app/user/[user_name]/profileComponent/AnimeFavorite/AnimeFavorite"
import AnimeStatus from "@/app/user/[user_name]/profileComponent/AnimeStatus/AnimeStatus"
import AnimeUpdate from "@/app/user/[user_name]/profileComponent/AnimeUpdate/AnimeUpdate"
import ProfileHeader from "@/app/user/[user_name]/profileComponent/ProfileHeader/ProfileHeader"
import { db } from "@/firebase/firebase-app"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import classNames from "classnames/bind"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { getServerSession } from "next-auth/next"
import { Suspense } from "react"
import styles from "./Profile.module.scss"
import ProfilePosts from "./profileComponent/posts/PostContainer"
import { getUserInfo } from "@/global/getUserInfo"
import ContextProvider from "@/app/(home)/HomeContext"

const cx = classNames.bind(styles)

async function Profile({ params }: { params: { user_name: string } }) {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId)

  if (!myUserInfo) return null

  // get admin information
  let adminData = {} as any

  if (session && !!session.user) {
    const docRef = doc(db, "users", (session.user as any).id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      adminData = { ...docSnap.data(), joined_date: "", id: docSnap.id }
    }
  }

  // get guess information
  const usersRef = collection(db, "users")
  const usernameQuery = query(usersRef, where("username", "==", params.user_name))
  const querySnapshot = await getDocs(usernameQuery)
  if (querySnapshot.empty) return

  const guessData = { ...querySnapshot.docs[0].data(), joined_date: "", id: querySnapshot.docs[0].id } as any

  // compare between admin and guess
  const isAdmin = !querySnapshot.empty && !!session?.user && params.user_name === adminData.username
  return (
    <div className='bg-ani-black w-full flex justify-center mt-14'>
      <ContextProvider myUserInfo={myUserInfo}>
        <div className='w-[81%] xl-max:w-full'>
          <ProfileHeader guess={guessData} admin={adminData} />
          <div className='w-full flex mt-6 box-border justify-between p-5 bg-profile-post-bg rounded-xl relative lgx-max:w-[90%] lgx-max:mx-[5%] lgx-max:flex-col lgx-max:mt-8'>
            <div className='w-[44.5%] rounded-xl sticky lgx-max:w-[94%] lgx-max:mx-[3%] sm-max:!w-full sm-max:!mx-0'>
              {guessData?.mal_connect ? (
                <Suspense
                  fallback={
                    <>
                      {/* @ts-expect-error Server Component */}
                      <AnimeUpdate data={[]} />
                      <AnimeStatus statusData={{}} />
                      <AnimeFavorite favorite_data={{}} />
                    </>
                  }
                >
                  {/* @ts-expect-error Server Component */}
                  <AnimeComponent
                    access_token={guessData.mal_connect.accessToken}
                    mal_username={guessData.mal_connect.myAnimeList_username}
                  />
                </Suspense>
              ) : (
                <div className={cx("mal-notfound")}>Not connected to MAL yet</div>
              )}
            </div>
            <div className='relative rounded-xl w-[53.5%] lgx-max:w-[94%] lgx-max:mx-[3%] sm-max:!w-full sm-max:!mx-0'>
              {/* {isAdmin && (
                <div className={cx('form-profile') + " -mt-4"}>
                  <PostForm
                    myAnimeList={null}
                  />
                </div>
              )} */}
              <ProfilePosts className={cx('post-profile-container')} myUserInfo={adminData} profileUsername={guessData.username} />
            </div>
          </div>
        </div>
      </ContextProvider>
    </div>
  )
}

async function AnimeComponent({ mal_username, access_token }: { mal_username: string; access_token: string }) {
  const animeData = getUserAnimeUpdate(access_token, mal_username)
  const animeStatus = getAnimeStatus(access_token)
  const userFavorite = getAnimeFavorite(mal_username)
  const [data, anime_status, user_favorite] = await Promise.all([animeData, animeStatus, userFavorite])

  return (
    <div className="flex flex-col">
      <div className="lg-between:flex lg-between:w-full lg-between:justify-between">
        {/* @ts-expect-error Server Component */}
        <AnimeUpdate data={data.data} />
        <AnimeStatus statusData={anime_status.anime_statistics} />
      </div>
      <AnimeFavorite favorite_data={user_favorite.data.data.favorites} />
    </div>
  )
}

function getAnimeStatus(access_token: any) {
  try {
    const url = "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics"
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => res.json())
  } catch (error) {
    console.log(error)
  }
}

function getAnimeFavorite(mal_username: any) {
  return apiServices.jikanRequest.get(`/users/${mal_username}/full`)
}

async function getUserAnimeUpdate(access_token: any, mal_username: any) {
  try {
    const url =
      "https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status,num_episodes&limit=3&sort=list_updated_at"
    const userUpdate = fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => res.json())
    return userUpdate
  } catch (error) {
    console.log(error)
  }
}

export const fetchCache = 'force-no-store'
export default Profile

