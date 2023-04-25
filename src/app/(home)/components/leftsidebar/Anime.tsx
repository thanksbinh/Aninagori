"use client"

import { getDateNow, getOldAnimeData } from "@/app/(home)/functions/postingUtils"
import { db } from "@/firebase/firebase-app"
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters"
import { RiAddCircleLine } from "@react-icons/all-files/ri/RiAddCircleLine"
import { RiCheckboxCircleLine } from "@react-icons/all-files/ri/RiCheckboxCircleLine"
import { arrayRemove, arrayUnion, doc, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AnimeOptions } from "./AnimeOptions"

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

export function AnimeComponent({ anime, myUserInfo }: { anime: any; myUserInfo: any }) {
  const [loading, setLoading] = useState(false)
  const [donePlanToWatch, setDonePLanToWatch] = useState(false)
  const [hide, setHide] = useState(false)
  const router = useRouter()

  async function handlePlanToWatch() {
    setLoading(true)
    // user have connected to MAL
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
        num_episodes: anime.num_episodes,
      },
    }

    const batch = writeBatch(db)
    const oldAnimeData = await getOldAnimeData(myUserInfo?.username, animeData)
    if (oldAnimeData !== 'anime not exist') {
      batch.update(myAnimeListRef, {
        animeList: arrayRemove(oldAnimeData)
      })
    }
    batch.update(myAnimeListRef, {
      animeList: arrayUnion(animeData),
      last_updated: dateNow,
    })
    await batch.commit()
    setLoading(false)
    setDonePLanToWatch(true)
    setTimeout(() => {
      setDonePLanToWatch(false)
      setHide(true)
    }, 2000)
  }

  return !hide ? (
    <AnimeOptions anime={anime}>
      <div className="flex">
        <div className="flex-none">
          <a href={`https://myanimelist.net/anime/${anime?.id}`} target="_blank">
            <img src={anime?.main_picture?.medium} alt="anime_picture" className="w-[85px] rounded-md mx-4" />
          </a>
        </div>

        <div>
          <h2 className="flex-auto text-ani-text-white hover:underline text-sm font-bold">
            <a href={`https://myanimelist.net/anime/${anime?.id}`} target="_blank">
              {anime?.title}
            </a>
          </h2>

          <p className="text-sm text-gray-400">
            {formatMediaType(anime?.media_type)} ({anime?.num_episodes} eps)
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
    </AnimeOptions>
  ) : (
    <></>
  )
}
