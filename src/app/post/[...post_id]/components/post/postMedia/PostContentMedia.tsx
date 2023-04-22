"use client"

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react"
import { VideoComponent } from "../Video"
import classNames from "classnames/bind"
import styles from "../PostContent.module.scss"
import MediaSlider from "./MediaSlider"
import MediaFullView from "./MediaFullView"
const cx = classNames.bind(styles)

function PostContentMedia({
  tag,
  imageUrl,
  videoUrl,
  postId,
}: {
  tag: any
  imageUrl: any
  videoUrl: any
  postId: any
}) {
  const [spoiler, setSpoiler] = useState(tag.some((a: string) => a === "Spoiler" || a === "NSFW"))
  const [index, setIndex] = useState(1)
  const [isFullView, setFullView] = useState(false);

  const onFullView = () => {
    !spoiler && setFullView(true);
  }

  useEffect(() => {
    if (spoiler) {
      const parentPostElement = document.querySelector(`[id="${postId}"]`)
      if (!!parentPostElement) {
        parentPostElement.querySelector('[aria-roledescription="carousel"]')?.classList.add("blur-2xl")
      }
    }
  }, [])

  return (
    <>
      {spoiler && (
        <>
          <div
            className={cx("spoiler-button")}
            onClick={() => {
              setSpoiler(false)
              const parentPostElement = document.querySelector(`[id="${postId}"]`)
              if (!!parentPostElement) {
                parentPostElement.querySelector('[aria-roledescription="carousel"]')?.classList.remove("blur-2xl")
                const navElements = parentPostElement.querySelectorAll(".nav.default-nav")
                navElements.forEach((navElement: any) => {
                  navElement.style = "z-index: 1 !important;"
                })
              }
            }}
          >
            {tag.some((a: string) => a === "NSFW") ? "NSFW" : "Spoiler"}
          </div>
          <div className={cx("spoiler-overlay")}></div>
        </>
      )}
      <div className="mt-4 mx-2 relative px-4">
        {typeof imageUrl === "object" ? (
          (imageUrl as any).length > 1 ? (
            <>
              <div onClick={onFullView}>
                <MediaSlider images={(imageUrl as any).map((data: string) => data)} setIndex={setIndex} index={index} />
              </div>
              <div
                style={spoiler ? { zIndex: "-1" } : {}}
                className="absolute m-auto leading-6 text-center opacity-40 rounded-tr-2xl top-0 right-4 w-12 h-6 bg-slate-700 text-white"
              >
                {index}/{(imageUrl as any).length}
              </div>
            </>
          ) : (
            <img
              draggable="false"
              src={imageUrl[0]}
              alt={""}
              onClick={onFullView}
              className={`cursor-pointer object-cover object-center rounded-2xl ${cx({
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
              onClick={onFullView}
              className={`cursor-pointe rounded-2xl ${cx({ "blur-2xl": spoiler })}`}
            />
          </>
        )}
        {videoUrl && <VideoComponent videoUrl={videoUrl} className={cx({ "blur-2xl": spoiler })} />}
        {isFullView &&
          <MediaFullView
            isOpen={isFullView}
            onClose={() => {
              setFullView(false)
            }}
            index={index}
            setIndex={setIndex}
            imageUrl={imageUrl}
          />
        }
      </div>
    </>
  )
}

export default PostContentMedia
