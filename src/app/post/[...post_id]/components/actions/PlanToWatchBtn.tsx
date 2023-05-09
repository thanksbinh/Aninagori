import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"
import { db } from "@/firebase/firebase-app"
import { RiAddCircleLine } from "@react-icons/all-files/ri/RiAddCircleLine"
import { RiCheckboxCircleLine } from "@react-icons/all-files/ri/RiCheckboxCircleLine"
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { PostContext } from "../../PostContext"
import { AnimeInfo } from "@/global/AnimeInfo.types"

const PlanToWatch = ({ animeStatus }: { animeStatus: string }) => {
  const { myUserInfo, postData } = useContext(PostContext)
  const router = useRouter()

  const [newAnimeStatus, setNewAnimeStatus] = useState(animeStatus)
  const [effect, setEffect] = useState(false);

  const onPlanToWatch = async () => {
    setEffect(true)
    setNewAnimeStatus('plan_to_watch')

    const animeInformation = await fetch(getProductionBaseUrl() + "/api/anime/" + postData?.post_anime_data?.anime_id).then((res) => res.json())
    const animeData = {
      list_status: {
        num_episodes_watched: 0,
        score: 0,
        status: 'plan_to_watch',
        updated_at: new Date().toISOString().slice(0, -5) + "+00:00",
        is_rewatching: false,
      },
      node: {
        id: postData?.post_anime_data?.anime_id,
        main_picture: animeInformation.main_picture,
        title: animeInformation.title,
        num_episodes: animeInformation.num_episodes,
      },
    }

    await updateDoc(doc(db, "myAnimeList", myUserInfo?.username), {
      animeList: arrayUnion(animeData)
    })
  }

  const onRemovePlanToWatch = async () => {
    const animeData = await getDoc(doc(db, "myAnimeList", myUserInfo?.username)).then((res) => res.data()?.animeList.find((anime: AnimeInfo) => anime.node.id === postData?.post_anime_data?.anime_id))

    if (!animeData) {
      alert("too fast")
      setTimeout(() => {
        router.refresh()
      }, 1000)
      return
    }

    setEffect(true)
    setNewAnimeStatus('')
    await updateDoc(doc(db, "myAnimeList", myUserInfo?.username), {
      animeList: arrayRemove(animeData)
    })
  }

  return !postData?.post_anime_data?.anime_id ? (
    <button title="can't find this anime" className={`flex items-center space-x-1 text-gray-600 hover:cursor-default`}>
      <RiAddCircleLine className="w-5 h-5" />
      <span>Plan to Watch</span>
    </button>
  ) : newAnimeStatus === 'completed' ? (
    <button title="you've finished this anime" className={`flex items-center space-x-1 text-blue-500 hover:cursor-default`}>
      <RiCheckboxCircleLine className="w-5 h-5" />
      <span>Completed</span>
    </button>
  ) : newAnimeStatus === 'watching' ? (
    <button title="you're watching this anime" className={`flex items-center space-x-1 text-green-500 hover:cursor-default`}>
      <RiCheckboxCircleLine className="w-5 h-5" />
      <span>Watching</span>
    </button>
  ) : newAnimeStatus === 'plan_to_watch' ? (
    <button
      onClick={onRemovePlanToWatch}
      title="remove anime from plan to watch list"
      className={`flex items-center space-x-1 text-[#E5DE3D] ${effect && "animate-wiggle"}`}
      onAnimationEnd={() => setEffect(false)}
    >
      <RiCheckboxCircleLine className="w-5 h-5" />
      <span>Plan to Watch</span>
    </button>
  ) : (
    <button
      onClick={onPlanToWatch}
      title="add anime to plan to watch list"
      className={`flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D] ${effect && "animate-wiggle"}`}
      onAnimationEnd={() => setEffect(false)}
    >
      <RiAddCircleLine className="w-5 h-5" />
      <span>Plan to Watch</span>
    </button>
  )
}

export default PlanToWatch