"use client"
/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { FC } from "react"
import classNames from "classnames/bind"
import styles from "./PostContent.module.scss"
import "tippy.js/dist/tippy.css"
import AnimeName from "../../../../(home)/components/animePostComponent/AnimeName"
import { useState } from "react"
import Avatar from "@/components/avatar/Avatar"
import PostOptions from "../option/PostOptionsPopup"
import { VideoComponent } from "../post/Video"
import { Slide } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"
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
  watchingProgess?: string
  episodesSeen?: number
  episodesTotal?: number
  tag?: string[]
  score?: string
  postId?: string
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
  watchingProgess = "is sharing",
  episodesSeen = 0,
  episodesTotal = 13,
  tag = [],
  postId,
  score,
}) => {
  const [spoiler, setSpoiler] = useState(tag.some((a: string) => a === "Spoiler"))
  const [index, setIndex] = useState(1)

  return (
    <div className="flex flex-col flex-1 bg-ani-black relative rounded-2xl p-4 pb-0 rounded-b-none">
      {spoiler && (
        <>
          <div
            className={cx("spoiler-button")}
            onClick={() => {
              setSpoiler(false)
            }}
          >
            SPOILER
          </div>
          <div className={cx("spoiler-overlay")}></div>
        </>
      )}
      <div className="flex items-center space-x-4 mx-2">
        <Link href={"/user/" + authorName}>
          <Avatar imageUrl={avatarUrl} altText={authorName} size={10} />
        </Link>
        <div style={{ width: "430px" }}>
          <div className="flex item-center font-bold text-[#dddede]">
            <div className={cx("info-wrapper")}>
              <Link href={"/user/" + authorName} className={`${cx("user-name")}`}>
                {authorName}
              </Link>
              <p className={cx("watch-status")}>{watchingProgess}</p>
              <AnimeName animeName={animeName} animeID={animeID as any} seen={episodesSeen} total={episodesTotal} />
              <div className={cx("post-option")}>
                <PostOptions />
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
        {tag.map((data: any, index: any) => {
          return <PostTag key={index}>#{data}</PostTag>
        })}
      </div>
      <p className="text-lg mx-2 mt-3 mb-2 text-[#dddede] mx-2)}">{content}</p>
      <div className="mt-4 mx-2 relative">
        {typeof imageUrl === "object" ? (
          <>
            <Slide
              onStartChange={(from: number, to: number) => {
                setIndex(to + 1)
              }}
              canSwipe={true}
              autoplay={false}
              transitionDuration={400}
            >
              {(imageUrl as any).map((data: string, index: number) => {
                return (
                  <img
                    key={index}
                    draggable="false"
                    src={data}
                    alt={""}
                    onClick={() => {
                      //TODO: handle view image in full screen
                    }}
                    className={`cursor-pointer rounded-2xl ${cx({ "blur-2xl": spoiler })}`}
                  />
                )
              })}
            </Slide>
            <div className="absolute m-auto leading-8 text-center opacity-70 rounded-tr-2xl top-0 right-0 w-16 h-8 bg-slate-700 text-white">
              {index}/{(imageUrl as any).length}
            </div>
          </>
        ) : (
          <>
            <img
              draggable="false"
              src={imageUrl}
              alt={""}
              className={`cursor-pointer rounded-2xl ${cx({ "blur-2xl": spoiler })}`}
            />
          </>
        )}
        {videoUrl && <VideoComponent videoUrl={videoUrl} className={cx("")} />}
      </div>
    </div>
  )
}

function PostTag({ children }: { children: any }) {
  return <div className={cx("tag")}>{children}</div>
}

export default PostContent
