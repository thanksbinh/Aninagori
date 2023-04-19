import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import getProductionBaseUrl from "../utils/getProductionBaseURL";

export default function SyncFromMALBtn({ myUserInfo, onClose }: { myUserInfo: UserInfo | undefined, onClose: any }) {
  const router = useRouter();

  const onSyncFromMAL = async () => {
    if (!myUserInfo || !myUserInfo.mal_connect) return;
    onClose();

    const userUpdate = await fetch(getProductionBaseUrl() + "/api/user_anime_list_full/" + myUserInfo.mal_connect.myAnimeList_username).then(res => res.json());
    await setDoc(doc(db, "myAnimeList", myUserInfo.username), {
      animeList: userUpdate.data,
      last_updated: userUpdate.data[0].list_status.updated_at,
    }, { merge: true })

    console.log("Synced anime list completed")
    router.refresh()
  };

  return (
    <button
      className="block px-4 py-2 text-ani-text-main hover:bg-slate-50/25 w-full text-left rounded-md"
      onClick={onSyncFromMAL}
    >
      Sync From MAL
    </button>
  )
}