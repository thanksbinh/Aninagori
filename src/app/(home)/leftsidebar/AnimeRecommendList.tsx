import { db } from '@/firebase/firebase-app';
import { doc, getDoc } from 'firebase/firestore';
import { AnimeExtend } from './AnimeExtend';
import { AnimeComponent } from './Anime';
import { UserInfo } from '@/global/UserInfo.types';

async function fetchMyAnimeIds(username: string | undefined) {
  if (!username) return [];

  const malRef = doc(db, "myAnimeList", username)
  const myAnimeList = (await getDoc(malRef))

  // Dropped or on-hold anime are still potential 
  const myAnimeIds = myAnimeList.data()?.animeList?.map((anime: any) => {
    if (["completed", "watching", "plan_to_watch"].includes(anime.list_status.status)) return anime.node.id
  })
  return myAnimeIds || [];
}

async function getAnimeDetail(animeId: string, potential: number) {
  try {
    const animeInfo = await fetch(
      `https://api.myanimelist.net/v2/anime/${animeId}?fields=id,title,main_picture,mean,num_list_users,media_type,num_episodes`, {
      headers: {
        "X-MAL-Client-ID": process.env.X_MAL_CLIENT_ID as string,
      },
    }).then(res => res.json())

    return { ...animeInfo, potential: potential }
  } catch (error) {
    console.log(error)
  }
}

export default async function AnimeRecommendList({ myUserInfo, potentialAnimes }: { myUserInfo: UserInfo, potentialAnimes: any }) {
  const myAnimeIds = await fetchMyAnimeIds(myUserInfo?.username)

  const recommendAnimes = potentialAnimes
    ?.filter((anime: any) => (!myAnimeIds.includes(anime.id) && anime.potential >= 12))
    .sort((a: any, b: any) => b.potential - a.potential)

  const recommendAnimeDetailPromises = recommendAnimes?.map((anime: any) => getAnimeDetail(anime.id, anime.potential))
  const recommendAnimeDetails = !!recommendAnimeDetailPromises && await Promise.all(recommendAnimeDetailPromises)

  return (
    <div className="h-full anime-recommend-list relative">
      <div className="flex justify-between items-center pl-2 mb-4">
        <h2 className="text-ani-text-main font-semibold text-xl">Anime you may like</h2>
      </div>
      <div className="h-full overflow-y-auto flex flex-col flex-wrap">
        {!!recommendAnimeDetails && recommendAnimeDetails.length ? (
          <div>
            <AnimeComponent myUserInfo={myUserInfo} anime={recommendAnimeDetails[0]} />
            <AnimeExtend myUserInfo={myUserInfo} animeDetails={recommendAnimeDetails.slice(1)} />
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
