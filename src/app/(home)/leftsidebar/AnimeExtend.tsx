'use client'

import { AnimeComponent } from "./Anime"
import { useState } from "react"

export function AnimeExtend({ animeDetails }: { animeDetails: any }) {
  const [extend, setExtend] = useState(false)

  return (
    <div className="w-full ml-2">
      {!extend && animeDetails.length && (
        <button onClick={() => setExtend(true)} className="text-sm text-gray-400 hover:underline">
          See more ...
        </button>
      )}

      {extend && animeDetails.map((anime: any) =>
        anime.id && (
          <div key={anime.id}>
            <AnimeComponent anime={anime} />
          </div>
        )
      )}
    </div>
  )
}