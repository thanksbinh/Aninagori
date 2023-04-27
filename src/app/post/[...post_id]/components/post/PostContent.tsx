/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { FC } from "react"
import classNames from "classnames/bind"
import styles from "./PostContent.module.scss"
import "tippy.js/dist/tippy.css"
import Avatar from "@/components/avatar/Avatar"
import PostOptions from "../options/PostOptionsPopup"
import "react-slideshow-image/dist/styles.css"
import AnimeName from "../animeName/AnimeName"
import PostContentMedia from "../media/PostContentMedia"
const cx = classNames.bind(styles)

type PostStaticProps = {
  authorName?: string
  avatarUrl?: string
  timestamp?: string
  content?: string
  imageUrl?: string
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
    <div className="flex flex-col flex-1 bg-ani-gray relative rounded-2xl p-4 pb-0 rounded-b-none" id={postId}>
      <div className="flex items-center space-x-4 mx-2">
        <Link href={"/user/" + authorName} className="flex-shrink-0">
          <Avatar imageUrl={avatarUrl} altText={authorName} size={10} />
        </Link>
        <div style={{ width: "430px" }}>
          <div className="flex item-center font-bold text-[#dddede]">
            <div className={cx("info-wrapper")}>
              <Link href={"/user/" + authorName} className={`${cx("user-name")}`}>
                {authorName}
              </Link>
              <p className={cx("watch-status")}>{watchingProgress}</p>
              <AnimeName animeName={animeName} animeID={animeID as any} seen={episodesSeen} total={episodesTotal} />
              <div className={cx("post-option")}>
                <PostOptions editPostID={postId} />
              </div>
            </div>
          </div>
          <div className="flex">
            <Link href={"/post/" + postId} className="text-gray-500 text-sm hover:underline mr-2">
              {timestamp}
            </Link>
            {score && (
              <div className="text-gray-500 text-sm">
                {" "}
                - score: <span className="text-green-500">{score} / 10</span>
              </div>
            )}
          </div>
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

function PostTag({ children }: { children: any }) {
  return <div className={cx("tag")}>{children}</div>
}

export default PostContent
