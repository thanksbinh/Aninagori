import { db } from '@/firebase/firebase-app';
import { getUserInfo } from '@/global/getUserInfo';
import { doc, getDoc } from 'firebase/firestore';
import { AnimeExtend } from './AnimeExtend';
import { AnimeComponent } from './Anime';

async function fetchMyAnimeIds(username: string) {
  const malRef = doc(db, "myAnimeList", username)
  const myAnimeList = (await getDoc(malRef))

  // Dropped or on-hold anime are still potential 
  const myAnimeIds = myAnimeList.data()?.animeList?.map((anime: any) => {
    if (["completed", "watching", "plan_to_watch"].includes(anime.list_status.status)) return anime.node.id
  })
  return myAnimeIds || [];
}

async function fetchPotentialAnimes(username: string) {
  const prefRef = doc(db, "postPreferences", username)
  const postPreference = (await getDoc(prefRef))

  const potentialAnimeIds = postPreference.data()?.animeList
  return potentialAnimeIds || [];
}

async function getAnimeDetail(animeId: string) {
  const animeInfo = await fetch(
    `https://api.myanimelist.net/v2/anime/${animeId}?fields=id,title,main_picture,mean,num_list_users,media_type,num_episodes`, {
    headers: {
      "X-MAL-Client-ID": process.env.X_MAL_CLIENT_ID as string,
    },
  }).then(res => res.json())

  return animeInfo
}

export default async function AnimeRecommendList({ myUserId }: { myUserId: string | undefined }) {
  const myUserInfo = await getUserInfo(myUserId)
  if (!myUserInfo) return null

  const [myAnimeIds, potentialAnimes] = await Promise.all([
    fetchMyAnimeIds(myUserInfo.username),
    fetchPotentialAnimes(myUserInfo.username)
  ])

  const recommendAnimes = potentialAnimes
    .filter((anime: any) => (!myAnimeIds.includes(anime.id) && anime.potential >= 10))
    .sort(() => 0.5 - Math.random())

  const recommendAnimeDetailPromises = recommendAnimes.map((anime: any) => getAnimeDetail(anime.id))
  const recommendAnimeDetails = await Promise.all(recommendAnimeDetailPromises)

  return (
    <div className="h-full relative">
      <div className="flex justify-between items-center pl-2 mb-4">
        <h2 className="text-ani-text-main font-semibold text-xl">Anime you may like</h2>
      </div>
      <div className="h-full overflow-y-auto flex flex-col flex-wrap">
        {recommendAnimeDetails.length > 0 ? (
          <div>
            <AnimeComponent anime={recommendAnimeDetails[0]} />
            <AnimeExtend animeDetails={recommendAnimeDetails.slice(1)} />
          </div>
        ) : (
          <div>
            Nothing yet ...
          </div>
        )}
      </div>
    </div>
  )
}
