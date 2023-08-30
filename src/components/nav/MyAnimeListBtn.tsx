import Image from "next/image";
import Link from "next/link";

export default function MyAnimeListBtn({ myAnimeList_username }: { myAnimeList_username?: string }) {
  if (!myAnimeList_username) return null

  return (
    <Link href={`https://myanimelist.net/animelist/${myAnimeList_username}`} target="_blank">
      <Image
        width={40}
        height={40}
        src={'/MyAnimeList_Logo.png'}
        title="MyAnimeList's list"
        alt="MyAnimeList's list"
        className={`rounded-full w-10 h-10 object-cover flex-shrink-0`}
      />
    </Link>
  )
} 