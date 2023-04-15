"use client"

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react"
import { Slide } from "react-slideshow-image"
import { VideoComponent } from "../Video"
import classNames from "classnames/bind"
import styles from "../PostContent.module.scss"
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
              onClick={() => {
                //TODO: handle view image in full screen
              }}
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
              className={`cursor-pointe rounded-2xl ${cx({ "blur-2xl": spoiler })}`}
            />
          </>
        )}
        {videoUrl && <VideoComponent videoUrl={videoUrl} className={cx({ "blur-2xl": spoiler })} />}
      </div>
    </>
  )
}

export default PostContentMedia
