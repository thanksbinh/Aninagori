'use client'

import { RiAddCircleLine } from "react-icons/ri"

export function AnimeComponent({ animeDetails }: { animeDetails: any }) {
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

  return (
    <div className='flex my-2'>
      <div className="flex-none">
        <a href={`https://myanimelist.net/anime/${animeDetails.id}`}>
          <img src={animeDetails.main_picture?.medium} alt="anime_picture" className='w-[100px] rounded-md mx-4' />
        </a>
      </div>

      <div>
        <h2 className="flex-auto text-ani-text-main hover:underline text-sm font-bold">
          <a href={`https://myanimelist.net/anime/${animeDetails.id}`}>
            {animeDetails.title}
          </a>
        </h2>

        <p className="text-sm">
          {formatMediaType(animeDetails.media_type)} ({animeDetails.num_episodes} eps)
        </p>

        <p className="text-sm">
          Members: {formatNumber(animeDetails.num_list_users)}
        </p>

        <p className="text-sm">
          Score: {animeDetails.mean || "N/A"}
        </p>

        <button
          title="plan to watch"
          className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D] text-sm"
        >
          <RiAddCircleLine className="w-3 h-3" />
          <span>Plan to Watch</span>
        </button>

      </div>
    </div>
  )
}