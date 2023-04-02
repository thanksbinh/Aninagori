"use client"

import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"
import { getDateNow, adjustAnimeListArray, handleAnimeInformationPosting } from "@/components/utils/postingUtils"
import { db } from "@/firebase/firebase-app"
import { doc, setDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { AiOutlineCheckCircle, AiOutlineLoading3Quarters } from "react-icons/ai"
import { RiAddCircleLine, RiCheckboxCircleLine } from "react-icons/ri"

export function AnimeComponent({ anime }: { anime: any }) {
  const [loading, setLoading] = useState(false)
  const [donePlanToWatch, setDonePLanToWatch] = useState(false)
  const { data: session } = useSession()

  function formatMediaType(media_type: string) {
    if (media_type === "tv") return "TV"
    if (media_type === "movie") return "Movie"
    if (media_type === "special") return "Special"
    if (media_type === "ova") return "OVA"
    if (media_type === "ona") return "ONA"
    if (media_type === "music") return "Music"
    return "unknown"
  }

  function formatNumber(num_list_users: number) {
    if (!num_list_users) return "N/A"
    return num_list_users.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  async function handlePlanToWatch() {
    setLoading(true)
    console.log("watchingg")
    const dateNow = getDateNow()
    const myAnimeListRef = doc(db, "myAnimeList", session?.user?.name as any)
    const animeData = {
      list_status: {
        is_rewatching: false,
        num_episodes_watched: 0,
        score: 0,
        status: "plan_to_watch",
        updated_at: dateNow,
      },
      node: {
        id: anime.id,
        main_picture: anime.main_picture,
        title: anime.title,
      },
    }
    const animeDataAfterCheck = await adjustAnimeListArray(session?.user?.name, animeData)
    const myAnimeListPromise = await setDoc(myAnimeListRef, {
      last_updated: dateNow,
      animeList: animeDataAfterCheck,
    })
    setLoading(false)
    setDonePLanToWatch(true)
  }

  return (
    <div className="flex my-4">
      <div className="flex-none">
        <a href={`https://myanimelist.net/anime/${anime.id}`} target="_blank">
          <img src={anime.main_picture?.medium} alt="anime_picture" className="w-[85px] rounded-md mx-4" />
        </a>
      </div>

      <div>
        <h2 className="flex-auto text-ani-text-main hover:underline text-sm font-bold">
          <a href={`https://myanimelist.net/anime/${anime.id}`} target="_blank">
            {anime.title}
          </a>
        </h2>

        <p className="text-sm text-gray-400">
          {formatMediaType(anime.media_type)} ({anime.num_episodes} eps)
        </p>

        <p className="text-sm text-gray-400">Members: {formatNumber(anime.num_list_users)}</p>

        <p className="text-sm text-gray-400">Score: {anime.mean || "N/A"}</p>

        {!donePlanToWatch && !loading && (
          <button
            title="plan to watch"
            onClick={handlePlanToWatch}
            className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D] text-sm"
          >
            <RiAddCircleLine className="w-4 h-4" />
            <span>Plan to Watch</span>
          </button>
        )}
        {donePlanToWatch && (
          <button title="plan to watch" className="flex items-center space-x-1 text-[#3BC361]">
            <RiCheckboxCircleLine className="w-4 h-4" />
            <span>Plan to Watch</span>
          </button>
        )}
        {loading && (
          <button
            title="set plan to watch this anime..."
            className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D]"
          >
            <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
            <span>Set plan to watch</span>
          </button>
        )}
      </div>
    </div>
  )
}
