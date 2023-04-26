"use client"

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react"
import { VideoComponent } from "../Video"
import classNames from "classnames/bind"
import styles from "../PostContent.module.scss"
import MediaFullView from "./MediaFullView"
import { Slide, SlideshowRef } from "react-slideshow-image"
import { TiArrowLeft } from "@react-icons/all-files/ti/TiArrowLeft"
import { TiArrowRight } from "@react-icons/all-files/ti/TiArrowRight"
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
  const [showButton, setShowButton] = useState(false);
  const slideRef = useRef<SlideshowRef>(null)

  const onFullView = () => {
    !spoiler && setFullView(true);
  }

  const properties = {
    prevArrow: <button className={`${showButton ? "" : "hidden"} bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center ml-2`}><TiArrowLeft className="h-5 w-5" /></button>,
    nextArrow: <button className={`${showButton ? "" : "hidden"} bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2`}><TiArrowRight className="h-5 w-5" /></button>
  }

  useEffect(() => {
    if (spoiler) {
      const parentPostElement = document.querySelector(`[id="${postId}"]`)
      if (!!parentPostElement) {
        parentPostElement.querySelector('[aria-roledescription="carousel"]')?.classList.add("blur-2xl")
      }
    }
  }, [])

  const removeSpoiler = () => {
    setSpoiler(false)
    const parentPostElement = document.querySelector(`[id="${postId}"]`)
    if (!!parentPostElement) {
      parentPostElement.querySelector('[aria-roledescription="carousel"]')?.classList.remove("blur-2xl")
      const navElements = parentPostElement.querySelectorAll(".nav.default-nav")
      navElements.forEach((navElement: any) => {
        navElement.style = "z-index: 1 !important;"
      })
    }
  }

  return (
    <>
      {spoiler && (
        <>
          <div className="bg-transparent absolute top-[9px] left-0 w-full h-full z-50" onClick={removeSpoiler}>
            <div
              className={cx("spoiler-button")}
              onClick={removeSpoiler}
            >
              {tag.some((a: string) => a === "NSFW") ? "NSFW" : "Spoiler"}
            </div>
          </div>
          <div className={cx("spoiler-overlay")}> </div>
        </>
      )}
      <div className="mt-4 mx-2 relative px-4">
        {typeof imageUrl === "object" ? (
          (imageUrl as any).length > 1 ? (
            <>
              <div onMouseEnter={() => setShowButton(true)} onMouseLeave={() => setShowButton(false)}>
                <Slide {...properties}
                  ref={slideRef}
                  onStartChange={(from: number, to: number) => {
                    setIndex(to + 1)
                  }}
                  canSwipe={true}
                  autoplay={false}
                  transitionDuration={0}
                >
                  {(imageUrl as any).map((data: string, index: number) => {
                    return (
                      <img
                        key={index}
                        draggable="false"
                        src={data}
                        alt={""}
                        onClick={onFullView}
                        className={`cursor-pointer object-cover object-center rounded-2xl ${cx("post-image", {
                          "blur-2xl": spoiler,
                        })}`}
                      />
                    )
                  })}
                </Slide>
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
          <img
            draggable="false"
            src={imageUrl}
            alt={""}
            onClick={onFullView}
            className={`cursor-pointer rounded-2xl ${cx({ "blur-2xl": spoiler })}`}
          />
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
            slideRef={slideRef}
          />
        }
      </div>
    </>
  )
}

export default PostContentMedia
