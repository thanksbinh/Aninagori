'use client'

import { shortenString } from "@/components/utils/formatData"
import { useContext, FC } from "react"
import { PostFormContext } from "./PostFormContext"

type Props = {
  openFormPopup: () => void
}

const PostFormShortcut: FC<Props> = ({ openFormPopup }) => {
  const { recentAnimeList, setRecentAnimeList } = useContext(PostFormContext)

  const onClick = (index: number) => {
    setRecentAnimeList([
      recentAnimeList[index],
      ...recentAnimeList.slice(0, index),
      ...recentAnimeList.slice(index + 1)
    ])

    openFormPopup()
  }

  return (
    <div className="mb-8">
      {recentAnimeList.slice(0, 4).map((anime: any, index: number) => (
        <button onClick={() => onClick(index)} key={index} className={`inline-block rounded-full px-3 py-1 text-sm font-semibold border-2 mr-2 ${(anime?.list_status?.status === "watching") ? "text-green-500 border-green-500" : "text-white border-white"}`}>
          + {shortenString(anime.node.title, 12)}
        </button>
      ))}
    </div>
  )
}

export default PostFormShortcut
