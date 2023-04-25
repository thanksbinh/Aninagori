import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import getProductionBaseUrl from "../utils/getProductionBaseURL";
import { AnimeInfo } from "@/global/AnimeInfo.types";

// If array2 has more, different items than array1, return the differences
function getArrayDiff(arr1: AnimeInfo[], arr2: AnimeInfo[]) {
  const differences: AnimeInfo[] = [];
  arr2.forEach((obj2: AnimeInfo) => {
    const match = arr1.find((obj1) => obj1.node.id === obj2.node.id);
    if (!match) {
      differences.push(obj2);
    }
  });
  return differences;
}

export default function SyncWithMALBtn({ myUserInfo, onClose }: { myUserInfo: UserInfo, onClose: any }) {
  const router = useRouter();

  const updateFirebaseAnimeList = async (mergedAnimeList: AnimeInfo[]) => {
    await setDoc(doc(db, "myAnimeList", myUserInfo.username), {
      animeList: mergedAnimeList,
      last_updated: mergedAnimeList[0].list_status.updated_at,
    }, { merge: true })
  }

  const updateMALAnimeList = async (animeListDiff: AnimeInfo[]) => {
    for (let i = 0; i < animeListDiff.length; i++) {
      const thisAnimeInfo = animeListDiff[i];
      await fetch(getProductionBaseUrl() + "/api/updatestatus/" + thisAnimeInfo.node.id, {
        headers: {
          status: thisAnimeInfo.list_status.status,
          episode: thisAnimeInfo.list_status.num_episodes_watched,
          score: thisAnimeInfo.list_status.score || 0,
          auth_code: myUserInfo.mal_connect.accessToken,
          start_date: thisAnimeInfo.list_status.start_date || "",
          end_date: thisAnimeInfo.list_status.finish_date || "",
          rewatch_time: thisAnimeInfo.list_status.num_times_rewatched || 0,
          is_rewatching: thisAnimeInfo.list_status.is_rewatching,
          tags: thisAnimeInfo.list_status.tags || "aninagori",
        } as any,
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
    }
  }

  const onSyncWithMAL = async () => {
    onClose();
    console.log("Syncing with MAL...")

    const malUsername = myUserInfo.mal_connect.myAnimeList_username
    const [firebaseAnimeList, malAnimeList] = await Promise.all([
      getDoc(doc(db, "myAnimeList", myUserInfo.username)).then(doc => doc.data()),
      fetch(getProductionBaseUrl() + "/api/user_anime_list_full/" + malUsername).then(res => res.json())
    ])

    const animeListDiff = getArrayDiff(malAnimeList.data, firebaseAnimeList?.animeList || [])
    const mergedAnimeList = [...malAnimeList.data, ...animeListDiff]

    await updateFirebaseAnimeList(mergedAnimeList)
    console.log("Firebase's anime list updated, now updating MAL's anime list...", animeListDiff)
    router.refresh()

    await updateMALAnimeList(animeListDiff)
    console.log("MAL's anime list updated, synced anime list completed")
  };

  return (
    <button
      className="block px-4 py-2 text-ani-text-white hover:bg-slate-50/25 w-full text-left rounded-md"
      onClick={onSyncWithMAL}
    >
      Sync With MAL
    </button>
  )
}