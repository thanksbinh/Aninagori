'use client'

import { db } from "@/firebase/firebase-app"
import { AiFillCloseCircle } from "@react-icons/all-files/ai/AiFillCloseCircle"
import { arrayRemove, doc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { HomeContext } from "../../HomeContext"

export function AnimeOptions({ anime, children }: { anime: any, children: React.ReactNode }) {
  const { myUserInfo } = useContext(HomeContext)
  const [showX, setShowX] = useState(false)
  const router = useRouter()

  const onResetAnime = async () => {
    if (!myUserInfo?.username) return;

    await updateDoc(doc(db, "postPreferences", myUserInfo.username), {
      animeList: arrayRemove({
        id: anime.id,
        potential: anime.potential
      })
    })

    router.refresh()
  }

  return (
    <div onMouseLeave={() => setShowX(false)} onMouseEnter={() => setShowX(true)} className='flex my-4 justify-between'>
      {children}
      <button onClick={onResetAnime} className="flex">
        <AiFillCloseCircle className={`w-5 h-5 text-gray-400 hover:text-gray-200 ${!showX && "invisible"}`} />
      </button>
    </div>
  )
}