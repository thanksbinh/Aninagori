/* eslint-disable @next/next/no-img-element */
import Avatar from "@/components/avatar/Avatar"
import classNames from "classnames/bind"
import Link from "next/link"
import { FC } from "react"
import "react-slideshow-image/dist/styles.css"
import "tippy.js/dist/tippy.css"
import AnimeName from "../animeName/AnimeName"
import PostContentMedia from "../media/PostContentMedia"
import PostOptions from "../options/PostOptionsMenu"
import styles from "./PostContent.module.scss"
const cx = classNames.bind(styles)

type PostStaticProps = {
  authorName?: string
  avatarUrl?: string
  timestamp?: string
  content?: string
  imageUrl?: string | string[]
  videoUrl?: string
  animeID?: number
  animeName?: string
  watchingProgress?: string
  episodesSeen?: number
  episodesTotal?: number
  tag?: string[]
  score?: string
  postId?: string
  editPostRef?: any
}

const PostContent: FC<PostStaticProps> = ({
  authorName = "",
  avatarUrl = "",
  timestamp,
  content,
  imageUrl,
  videoUrl,
  animeID = "12403",
  animeName = "Unknowned Anime",
  watchingProgress = "is sharing",
  episodesSeen = 0,
  episodesTotal = 13,
  tag = [],
  postId,
  score,
}) => {
  return (
    <div id={postId} className="flex flex-col flex-1 bg-ani-gray relative rounded-2xl p-4 pb-0 rounded-b-none">
      <div className="flex justify-between items-center gap-4 mx-2">
        <Link href={"/user/" + authorName} className="flex-shrink-0">
          <Avatar imageUrl={avatarUrl} altText={authorName} size={10} />
        </Link>

        <div className="flex-1 flex flex-col w-3/4">
          <div className="flex gap-2 items-center font-bold text-[#dddede]">
            <Link href={"/user/" + authorName}>{authorName}</Link>
            <div className="hidden sm:block font-bold text-sm text-[#ada9a9] my-0 flex-shrink-0">{watchingProgress}</div>
            <AnimeName animeName={animeName} animeID={animeID as string} seen={episodesSeen} total={episodesTotal} />
          </div>

          <div className="flex">
            <Link href={"/post/" + postId} className="flex-shrink-0 text-gray-500 text-sm hover:underline mr-2">
              {timestamp}
            </Link>
            {score && (
              <div className="flex-shrink-0 text-gray-500 text-sm">
                {" "}
                - score: <span className="text-green-500">{score} / 10</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-[#dddede] font-bold">
          <PostOptions editPostID={postId} />
        </div>
      </div>

      <div className={cx("tag-wrapper")}>
        {tag.map((data: any, indexTag: any) => {
          return <PostTag key={indexTag}>#{data}</PostTag>
        })}
      </div>

      <div className="relative flex flex-col -mx-4">
        {!!content && <p className="text-lg mx-2 mt-3 mb-2 text-[#dddede] px-4">{content}</p>}
        {(!!imageUrl || !!videoUrl) && <PostContentMedia postId={postId} tag={tag} imageUrl={imageUrl} videoUrl={videoUrl} />}
      </div>
    </div>
  )
}

function PostTag({ children }: { children: React.ReactNode }) {
  return <div className={cx("tag")}>{children}</div>
}

export default PostContent
