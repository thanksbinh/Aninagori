/* eslint-disable @next/next/no-img-element */
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { FC, useContext, useRef, useState } from "react"
import { storage } from "@/firebase/firebase-app"
import { v4 } from "uuid"
import classNames from "classnames/bind"
import styles from "./PostForm.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import Avatar from "@/components/avatar/Avatar"
import { AnimeEpisodes, AnimeScore, AnimeSearch, AnimeTag, AnimeWatchStatus } from './animePostComponent'
import { HomeContext } from "../HomeContext"
import { handleSubmitForm } from "@/components/utils/postingUtils"
import PostFormMediaDisplay from "./postMediaComponent/PostFormMediaDisplay"
import PostButtonArea from "./postButtonArea/PostButtonArea"

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
      onClick={
        loadPosting
          ? () => { }
          : () => {
            setTimeout(() => {
              setOpen(false)
            }, 90)
          }
      }
      className={cx("modal")}
      style={open ? { display: "flex" } : { display: "none" }}
    >
      <div className={cx("modal_overlay")}></div>
      <form
        onClick={(e) => {
          e.stopPropagation()
        }}
        onSubmit={loadPosting ? () => { } : (e) => handleSubmitForm(e, animeStatus, animeSearch, animeEpisodes, animeTag, animeScore, inputRef, mediaUrl, setLoadPosting, uploadMedia, username, avatarUrl, mediaType, malAuthCode, myUserInfo,)}
        className="relative"
      >
        <FontAwesomeIcon
          onClick={
            loadPosting
              ? () => { }
              : () => {
                setOpen(false)
              }
          }
          icon={faCircleXmark as any}
          className={cx("close-post")}
        />
        <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl px-4 my-4">
          <div className="flex justify-start mt-4 px-2 mb-4 items-start">
            <Avatar imageUrl={avatarUrl} altText={username} size={10} />
            <h4 className="text-base font-bold ml-4">{username}</h4>
          </div>
          <div className={cx("status-wrapper")}>
            <AnimeWatchStatus ref={animeStatus} setShowScore={setShowScore} />
            <AnimeSearch ref={animeSearch} animeEpsRef={animeEpisodes} />
            <AnimeScore ref={animeScore} style={showScore ? { display: "flex" } : { display: "none" }} />
            <AnimeEpisodes ref={animeEpisodes} style={!showScore ? { display: "flex" } : { display: "none" }} />
          </div>
          <input
            type="text"
            ref={inputRef}
            onPaste={handlePaste}
            placeholder="Share your favourite Animemory now!"
            className="flex rounded-3xl py-3 px-4 w-full focus:outline-none bg-[#212833] caret-white"
          />

          <PostFormMediaDisplay mediaUrl={mediaUrl} mediaType={mediaType} handleDeleteMedia={handleDeleteMedia} handleMediaChange={handleMediaChange} />

          <AnimeTag tagArr={["Spoiler", "GoodStory", "BestWaifu", "NSFW"]} ref={animeTag} />

          <PostButtonArea loadPosting={loadPosting} handleMediaChange={handleMediaChange} />
        </div>
      </form>
    </div>
  )
}

export default PostFormPopUp
