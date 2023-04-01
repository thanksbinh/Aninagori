"use client"
/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { FC, useEffect, useRef, useState } from "react"
import classNames from "classnames/bind"
import styles from "./PostContent.module.scss"
import "tippy.js/dist/tippy.css"
import AnimeName from "../../../../(home)/components/animePostComponent/AnimeName/AnimeName"
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
  watchingProgress?: string
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
  watchingProgress = "is sharing",
  episodesSeen = 0,
  episodesTotal = 13,
  tag = [],
  postId,
  score,
}) => {
  const [spoiler, setSpoiler] = useState(tag.some((a: string) => a === "Spoiler" || a === "NSFW"))
  const [index, setIndex] = useState(1)
  const ref = useRef()

  useEffect(() => {
    if (spoiler) {
      ; (ref.current as any).querySelector('[aria-roledescription="carousel"]')?.classList.add("blur-2xl")
    }
  }, [])

  return (
    <div className="flex flex-col flex-1 bg-ani-black relative rounded-2xl p-4 pb-0 rounded-b-none" ref={ref as any}>
      {spoiler && (
        <>
          <div
            className={cx("spoiler-button")}
            onClick={() => {
              setSpoiler(false)
                ; (ref.current as any).querySelector('[aria-roledescription="carousel"]')?.classList.remove("blur-2xl")
              const navElements = (ref.current as any).querySelectorAll(".nav.default-nav")
              navElements.forEach((navElement: any) => {
                navElement.style = "z-index: 1 !important;"
              })
            }}
          >
            {tag.some((a: string) => a === "NSFW") ? "NSFW" : "Spoiler"}
          </div>
          <div className={cx("spoiler-overlay")}></div>
        </>
      )}
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
          (imageUrl as any).length > 1 ? (
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
                      className={`cursor-pointer object-cover object-center rounded-2xl ${cx("post-image", {
                        "blur-2xl": spoiler,
                      })}`}
                    />
                  )
                })}
              </Slide>
              <div
                style={spoiler ? { zIndex: "-1" } : {}}
                className="absolute m-auto leading-6 text-center opacity-40 rounded-tr-2xl top-0 right-0 w-12 h-6 bg-slate-700 text-white"
              >
                {index}/{(imageUrl as any).length}
              </div>
            </>
          ) : (
            <img
              draggable="false"
              src={imageUrl[0]}
              alt={""}
              onClick={() => {
                //TODO: handle view image in full screen
              }}
              className={`cursor-pointer object-cover object-center rounded-2xl ${cx("post-image", {
                "blur-2xl": spoiler,
              })}`}
            />
          )
        ) : (
          <>
            <img
              draggable="false"
              src={imageUrl}
              alt={""}
              className={`cursor-pointe rounded-2xl ${cx({ "blur-2xl": spoiler })}`}
            />
          </>
        )}
        {videoUrl && <VideoComponent videoUrl={videoUrl} className={cx({ "blur-2xl": spoiler })} />}
      </div>
    </div>
  )
}

function PostTag({ children }: { children: any }) {
  return <div className={cx("tag")}>{children}</div>
}

export default PostContent
