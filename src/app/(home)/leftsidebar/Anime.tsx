"use client"

import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"
import { getDateNow, adjustAnimeListArray } from "@/components/utils/postingUtils"
import { db } from "@/firebase/firebase-app"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters"
import { RiAddCircleLine } from "@react-icons/all-files/ri/RiAddCircleLine"
import { RiCheckboxCircleLine } from "@react-icons/all-files/ri/RiCheckboxCircleLine"
import { useRouter } from "next/navigation"

export function AnimeComponent({ anime, myUserInfo }: { anime: any; myUserInfo: any }) {
  const [loading, setLoading] = useState(false)
  const [donePlanToWatch, setDonePLanToWatch] = useState(false)
  const [hide, setHide] = useState(false)
  const router = useRouter()

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
    // user have connected to MAL
    if (!!myUserInfo?.mal_connect?.accessToken) {
      fetch(getProductionBaseUrl() + "/api/updatestatus/" + anime.id, {
        headers: {
          status: "plan_to_watch",
          episode: "0",
          score: "0",
          auth_code: myUserInfo?.mal_connect?.accessToken,
        } as any,
      }).then((res) => {
        setLoading(false)
        setDonePLanToWatch(true)
        setTimeout(() => {
          setHide(true)
          setDonePLanToWatch(false)
        }, 3000)
        return
      })
      return
    }
    // user not connect to MAL
    const dateNow = getDateNow()
    const myAnimeListRef = doc(db, "myAnimeList", myUserInfo?.username as any)
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
    const animeDataAfterCheck = await adjustAnimeListArray(myUserInfo?.username, animeData)
    const myAnimeListPromise = await setDoc(myAnimeListRef, {
      last_updated: dateNow,
      animeList: animeDataAfterCheck,
    })
    setLoading(false)
    setDonePLanToWatch(true)
    setTimeout(() => {
      setDonePLanToWatch(false)
      setHide(true)
    }, 3000)
  }

  return !hide ? (
    <div className="flex">
      <div className="flex-none">
        <a href={`https://myanimelist.net/anime/${anime?.id}`} target="_blank">
          <img src={anime?.main_picture?.medium} alt="anime_picture" className="w-[85px] rounded-md mx-4" />
        </a>
      </div>

      <div>
        <h2 className="flex-auto text-ani-text-main hover:underline text-sm font-bold">
          <a href={`https://myanimelist.net/anime/${anime?.id}`} target="_blank">
            {anime?.title}
          </a>
        </h2>

        <p className="text-sm text-gray-400">
          {formatMediaType(anime?.media_type)} ({anime.num_episodes} eps)
        </p>

        <p className="text-sm text-gray-400">Members: {formatNumber(anime?.num_list_users)}</p>

        <p className="text-sm text-gray-400">Score: {anime?.mean || "N/A"}</p>

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
  ) : (
    <></>
  )
}
