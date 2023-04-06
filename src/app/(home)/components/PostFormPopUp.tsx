/* eslint-disable @next/next/no-img-element */
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { FC, useContext, useRef, useState } from "react"
import { storage } from "@/firebase/firebase-app"
import { v4 } from "uuid"
import classNames from "classnames/bind"
import styles from "./PostForm.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { HomeContext } from "../HomeContext"
import { handleSubmitForm } from "@/components/utils/postingUtils"
import PostButtonArea from "./postButtonArea/PostButtonArea"
import PostAdditional from "./postAdditional/PostAdditional"
import PostBasic from "./postBasic/PostBasic"
import { AnimeWatchStatus, AnimeSearch, AnimeScore, AnimeEpisodes } from "./animePostComponent"

const cx = classNames.bind(styles)

type PostFormProps = {
  username: string
  avatarUrl: string
  setOpen?: any
  open?: any
  malAuthCode?: string
}

const PostFormPopUp: FC<PostFormProps> = ({ username, avatarUrl, setOpen, open, malAuthCode }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [mediaUrl, setMediaUrl] = useState<any>([])
  const [mediaType, setMediaType] = useState<string>("")
  const [showScore, setShowScore] = useState<boolean>(false)
  const [loadPosting, setLoadPosting] = useState<boolean>(false)
  const [basicPostingInfo, setBasicPostingInfo] = useState<boolean>(true)
  const animeStatus = useRef()
  const animeSearch = useRef()
  const animeEpisodes = useRef()
  const animeTag = useRef()
  const animeScore = useRef()
  const { myUserInfo } = useContext(HomeContext)

  const handlePaste = (e: any) => {
    const file = e.clipboardData.files[0]
    var clipboardData = e.clipboardData
    var types = clipboardData.types
    if (types.includes("text/plain")) {
      return
    }
    if (file?.type?.indexOf("image") !== -1) {
      const blob = file.slice(0, file.size, "image/png")
      const fileUrl = new File([blob], "image.png", { type: "image/png" })
      setMediaUrl([...mediaUrl, fileUrl])
      setMediaType("image")
    }
  }

  const uploadMedia = async () => {
    if (mediaUrl.length === 0) return ""
    const promise: any[] = []
    mediaUrl.map((file: any, index: any) => {
      const fileRef = ref(storage, `posts/${v4()}`)
      const uploadTask = uploadBytes(fileRef, file)
      promise.push(uploadTask)
    })

    const downloadMediaUrl: any = await Promise.all(promise).then(async (snapshot) => {
      const downloadUrl = ["link"]
      downloadUrl.pop()
      for (var i = 0; i < snapshot.length; i++) {
        const dowloadUrlChild = await getDownloadURL(snapshot[i].ref)
        downloadUrl.push(dowloadUrlChild)
      }
      return downloadUrl
    })
    return downloadMediaUrl
  }

  const handleDeleteMedia = (index: any) => {
    URL.revokeObjectURL(mediaUrl[index])
    setMediaUrl(mediaUrl.filter((_: any, i: any) => i !== index))
  }

  const handleMediaChange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const fileType = file.type.split("/")[0]
    if (mediaUrl.length !== 0 && mediaUrl[0].type.split("/")[0] !== fileType) {
      setMediaType(fileType)
      setMediaUrl([file])
      alert("You can only upload image or video")
      return
    }
    if (mediaUrl.length >= 10) {
      alert("You can only upload 10 media files")
      return
    }
    //TODO: -handle post a video after a video
    setMediaType(fileType)
    setMediaUrl([...mediaUrl, file])
  }

  return (
    <div
      onClick={loadPosting ? () => { } : () => { setTimeout(() => { setOpen(false) }, 90) }}
      className={cx("modal")}
      style={open ? { display: "flex" } : { display: "none" }}
    >
      <div className={cx("modal_overlay")}></div>
      <form
        onClick={(e) => { e.stopPropagation() }}
        onSubmit={
          loadPosting ? () => { } : (e) => handleSubmitForm(e, animeStatus, animeSearch, animeEpisodes, animeTag, animeScore,
            inputRef, mediaUrl, setLoadPosting, uploadMedia, username, avatarUrl,
            mediaType, malAuthCode, myUserInfo,
          )
        }
        className="relative"
      >
        <FontAwesomeIcon
          onClick={loadPosting ? () => { } : () => { setOpen(false) }}
          icon={faCircleXmark as any}
          className={`${cx("close-post")} z-20`}
        />
        <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl px-4 my-4 transition ease-in-out duration-200">
          <div className="flex justify-between my-2 relative">
            <div
              className="hover:bg-[#212833] cursor-pointer w-1/2 py-5 text-lg font-bold text-center border-b-2 border-[#212833]"
              onClick={() => { setBasicPostingInfo(true) }}
            >
              Basic
            </div>
            <div
              className="hover:bg-[#212833] cursor-pointer w-1/2 py-5 text-lg font-bold text-center border-b-2 border-[#212833]"
              onClick={() => { setBasicPostingInfo(false) }}
            >
              Advanced
            </div>
            <div className="absolute right-1/2 top-1/2 -translate-y-1/2 h-5/6 border border-[#212833]"></div>
            <div
              className="absolute transition-all ease-linear duration-200 bottom-0 w-1/2 h-1 bg-[#3BC361] opacity-70"
              style={basicPostingInfo ? { left: "0" } : { left: "50%" }}
            ></div>
          </div>
          <div className={cx("status-wrapper")}>
            <AnimeWatchStatus ref={animeStatus} setShowScore={setShowScore} />
            <AnimeSearch ref={animeSearch} animeEpsRef={animeEpisodes} />
            <AnimeScore ref={animeScore} style={showScore ? { display: "flex" } : { display: "none" }} />
            <AnimeEpisodes ref={animeEpisodes} style={!showScore ? { display: "flex" } : { display: "none" }} />
          </div>
          <PostBasic
            basicPostingInfo={basicPostingInfo}
            animeTag={animeTag}
            inputRef={inputRef}
            handlePaste={handlePaste}
            mediaUrl={mediaUrl}
            mediaType={mediaType}
            handleDeleteMedia={handleDeleteMedia}
            handleMediaChange={handleMediaChange}
          />
          <PostAdditional className={basicPostingInfo ? "hidden" : "flex"} />
          <PostButtonArea
            setBasicPostingInfo={setBasicPostingInfo}
            loadPosting={loadPosting}
            handleMediaChange={handleMediaChange}
          />
        </div>
      </form>
    </div>
  )
}

export default PostFormPopUp
