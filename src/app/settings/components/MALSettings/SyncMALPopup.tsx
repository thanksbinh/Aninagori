import Modal from "@/components/utils/Modal";
import getProductionBaseUrl from "@/components/utils/getProductionBaseURL";
import { db } from "@/firebase/firebase-app";
import { AnimeInfo } from "@/global/AnimeInfo.types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

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

const SyncMALPopup = ({ username, mal_connect, isOpen, onClose }: { username: string, mal_connect: any, isOpen: boolean, onClose: () => void }) => {
  const [log, setLog] = useState("")

  const updateFirebaseAnimeList = async (mergedAnimeList: AnimeInfo[]) => {
    await setDoc(doc(db, "myAnimeList", username), {
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
          auth_code: mal_connect.accessToken,
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
    setLog("Synchronizing with MAL...")

    const malUsername = mal_connect.myAnimeList_username
    const [firebaseAnimeList, malAnimeList] = await Promise.all([
      getDoc(doc(db, "myAnimeList", username)).then(doc => doc.data()),
      fetch(getProductionBaseUrl() + "/api/user_anime_list_full/" + malUsername).then(res => res.json())
    ])

    const animeListDiff = getArrayDiff(malAnimeList.data, firebaseAnimeList?.animeList || [])
    const mergedAnimeList = [...malAnimeList.data, ...animeListDiff]

    await updateFirebaseAnimeList(mergedAnimeList)
    setLog("Firebase's anime list updated, now updating MAL's anime list...")

    await updateMALAnimeList(animeListDiff)
    setLog("MAL's anime list updated, sync anime list completed")

    setTimeout(() => {
      onClose()
      setLog("")
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="bg-ani-gray max-w-[600px] rounded-md shadow-md">
        <h2 className="py-4 text-ani-text-white font-bold text-2xl text-center border-b-[1px] border-ani-light-gray">Synchronize Manually</h2>

        <div className="p-4 border-b-[1px] border-ani-light-gray">
          <p className="text-ani-text-white">This will merge your anime lists on MyAnimeList and Aninagori, then update it to both platforms.</p><br />
          <p className="text-ani-text-white">Note: if there're differences in details (tags, score, ...) from one of two lists, data from MyAnimeList is kept in the merged list.</p>
          {log && (
            <>
              <br />
              <p className="text-ani-text-white">{log}</p>
            </>
          )}
        </div>

        <div className="flex justify-end px-6 py-4">
          <button onClick={onClose} className="text-blue-500 font-bold mr-8">Cancel</button>
          <button onClick={onSyncWithMAL} className="my-4 py-2 px-4 rounded-md bg-blue-500 font-semibold">Synchronize</button>
        </div>
      </div>
    </Modal>
  )
}

export default SyncMALPopup