'use client'

import { shortenString } from "@/components/utils/format"
import { FC } from "react"

type Props = {
  recentAnimeList?: any
}

const PostFormShortcut: FC<Props> = ({ recentAnimeList }) => {
  return (
    <div className="mb-8">
      {recentAnimeList.map((anime: any, index: number) => (
        <button key={index} className={`inline-block rounded-full px-3 py-1 text-sm font-semibold border-2 mr-2 ${(anime.list_status.status === "watching") ? "text-green-500 border-green-500" : "text-white border-white"}`}>
          + {shortenString(anime.node.title, 12)}
        </button>
      ))}
    </div>
  )
}

export default PostFormShortcut
