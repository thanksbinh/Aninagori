import { db } from '@/firebase/firebase-app';
import { getUserInfo } from '@/global/getUserInfo';
import { doc, getDoc } from 'firebase/firestore';
import { AnimeComponent } from './AnimeComponent';

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
  const animeDetail = await fetch(`http://localhost:3000/api/anime/${animeId}`).then((res) => res.json())

  return animeDetail;
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
    .sort((a: any, b: any) => b.potential - a.potential)
    .slice(0, 3)

  const recommendAnimeDetailPromises = recommendAnimes.map((anime: any) => getAnimeDetail(anime.id))
  const recommendAnimeDetails = await Promise.all(recommendAnimeDetailPromises)

  return (
    <div className="relative">
      <div className="flex justify-between items-center pl-2 mb-4">
        <h2 className="text-ani-text-main font-semibold text-xl">Anime you may like</h2>
      </div>
      <div className="flex flex-col flex-wrap mx-2">
        {recommendAnimeDetails.map((animeDetails: any, id: number) =>
          animeDetails.error ? (
            <div key={id}>
              {animeDetails.error}
            </div>
          ) : (
            <div key={animeDetails.id}>
              <AnimeComponent animeDetails={animeDetails} />
            </div>
          )
        )}
      </div>
    </div>
  )
}
