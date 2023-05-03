'use client'

import { db } from "@/firebase/firebase-app"
import { AiFillCloseCircle } from "@react-icons/all-files/ai/AiFillCloseCircle"
import { arrayRemove, arrayUnion, doc, updateDoc, writeBatch } from "firebase/firestore"
import { useContext, useState } from "react"
import { HomeContext } from "../../HomeContext"
import { RiAddCircleLine } from "@react-icons/all-files/ri/RiAddCircleLine"
import { RiCheckboxCircleLine } from "@react-icons/all-files/ri/RiCheckboxCircleLine"
import { getDateNow, getOldAnimeData } from "../../functions/postingUtils"

export function AnimeOptions({ anime, children }: { anime: any, children: React.ReactNode }) {
  const { myUserInfo } = useContext(HomeContext)

  const [hidden, setHidden] = useState(false)
  const [donePlanToWatch, setDonePLanToWatch] = useState(false)
  const [showX, setShowX] = useState(false)

  async function handlePlanToWatch() {
    if (donePlanToWatch) return;
    setDonePLanToWatch(true)

    const dateNow = getDateNow()
    const myAnimeListRef = doc(db, "myAnimeList", myUserInfo?.username)
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

    setTimeout(() => {
      setDonePLanToWatch(false)
      setHidden(true)
    }, 1000)
  }

  const onResetAnime = async () => {
    if (!myUserInfo?.username) return;

    await updateDoc(doc(db, "postPreferences", myUserInfo.username), {
      animeList: arrayRemove({
        id: anime.id,
        potential: anime.potential
      })
    })

    setHidden(true)
  }

  return !hidden ? (
    <div onMouseLeave={() => setShowX(false)} onMouseEnter={() => setShowX(true)} className='flex relative my-4 justify-between'>
      {children}
      <button onClick={onResetAnime} className="flex">
        <AiFillCloseCircle className={`w-5 h-5 text-gray-400 hover:text-gray-200 ${!showX && "invisible"}`} />
      </button>

      <button
        title="plan to watch"
        onClick={handlePlanToWatch}
        className={`absolute left-[7.25rem] top-[5.1rem] flex items-center space-x-1 ${donePlanToWatch ? 'text-[#E5DE3D]' : 'text-gray-400 hover:text-[#E5DE3D]'}`}
      >
        {donePlanToWatch ? (
          <RiCheckboxCircleLine className="w-4 h-4" />
        ) : (
          <RiAddCircleLine className="w-4 h-4" />
        )}
        <span>Plan to Watch</span>
      </button>
    </div>
  ) : (
    <></>
  )
}