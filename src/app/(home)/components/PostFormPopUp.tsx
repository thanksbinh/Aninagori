import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { HiPhoto, HiVideoCamera } from "react-icons/hi2"
import { useRouter } from "next/navigation"
import { FC, useRef, useState } from "react"
import { db, storage } from "@/firebase/firebase-app"
import { v4 } from "uuid"
import classNames from "classnames/bind"
import styles from "./PostForm.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons"

import Avatar from "@/components/avatar/Avatar"
import AnimeWatchStatus from "./animePostComponent/AnimeWatchStatus"
import AnimeSearch from "./animePostComponent/AnimeSearch"
import AnimeEpisodes from "./animePostComponent/AnimeEpisodes"
import AnimeTag from "./animePostComponent/AnimeTag"

const cx = classNames.bind(styles)

type PostFormProps = {
  username: string
  avatarUrl: string
  setOpen?: any
  open?: any
}

const PostFormPopUp: FC<PostFormProps> = ({ username, avatarUrl, setOpen, open }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [mediaUrl, setMediaUrl] = useState<any>(null)
  const [mediaType, setMediaType] = useState<string>("")
  const router = useRouter()
  const animeStatus = useRef()
  const animeSearch = useRef()
  const animeEpisodes = useRef()
  const animeTag = useRef()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    const statusData = (animeStatus?.current as any).getAnimeStatus()
    const searchData = (animeSearch?.current as any).getAnimeName()
    const episodesData = (animeEpisodes?.current as any).getAnimeEpisodes()
    const totalEps = (animeEpisodes?.current as any).getAnimeTotal()
    const tagData = (animeTag?.current as any).getAnimeTag()

    e.preventDefault()
    if ((!inputRef.current?.value && !mediaUrl) || (animeSearch?.current as any).getAnimeName().animeID === "") {
      console.log("erroer")
      return
    }
    const postAnimeData = handleAnimeInformationPosting(statusData, searchData, episodesData, tagData, totalEps)

    const downloadMediaUrl = await uploadMedia()
    await addDoc(collection(db, "posts"), {
      authorName: username,
      avatarUrl: avatarUrl,
      timestamp: serverTimestamp(),
      content: inputRef.current?.value || "",
      imageUrl: mediaType === "image" ? downloadMediaUrl : "",
      videoUrl: mediaType === "video" ? downloadMediaUrl : "",
      post_anime_data: postAnimeData,
    })

    inputRef.current!.value = ""
    setMediaUrl(null)
    location.reload()
    setOpen(false)
  }

  const uploadMedia = async () => {
    if (mediaUrl == null) return ""

    const mediaRef = ref(storage, `posts/${mediaUrl.name + v4()}`)
    const snapshot = await uploadBytes(mediaRef, mediaUrl)
    const downloadMediaUrl = await getDownloadURL(snapshot.ref)

    return downloadMediaUrl
  }

  const handleDeleteMedia = () => {
    URL.revokeObjectURL(mediaUrl)
    setMediaUrl("")
  }

  const handleMediaChange = (e: any, mediaType: string) => {
    // Todo: multi media file
    const file = e.target.files[0]
    if (!file) return

    setMediaType(mediaType)
    setMediaUrl(file)
  }

  return (
    <div
      onClick={() => {
        setTimeout(() => {
          setOpen(false)
        }, 90)
      }}
      className={cx("modal")}
      style={open ? { display: "flex" } : { display: "none" }}
    >
      <div className={cx("modal_overlay")}></div>
      <form
        onClick={(e) => {
          e.stopPropagation()
        }}
        onSubmit={(e) => handleSubmit(e)}
        className="relative"
      >
        <FontAwesomeIcon
          onClick={() => {
            setOpen(false)
          }}
          icon={faCircleXmark as any}
          className={cx("close-post")}
        />
        <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl px-4 my-4">
          <div className="flex justify-start mt-4 px-2 mb-4 items-start">
            <Avatar imageUrl={avatarUrl} altText={username} size={10} />
            <h4 className="text-base font-bold ml-4">{username}</h4>
          </div>
          <div className={cx("status-wrapper")}>
            <AnimeWatchStatus ref={animeStatus} />
            <AnimeSearch ref={animeSearch} animeEpsRef={animeEpisodes} />
            <AnimeEpisodes ref={animeEpisodes} />
          </div>
          <input
            type="text"
            ref={inputRef}
            placeholder="Share your favourite Animemory now!"
            className="flex rounded-3xl py-3 px-4 w-full focus:outline-none bg-[#212833] caret-white"
          />

          <div className="mt-4 w-full flex items-center justify-center">
            {mediaUrl &&
              (mediaUrl.name.endsWith(".mp4") ? (
                <div className={cx("media-wrapper") + " w-2/3 h-2/5 flex items-center justify-center relative"}>
                  <video src={URL.createObjectURL(mediaUrl)} className="w-full object-contain rounded-xl" controls />
                  <FontAwesomeIcon
                    onClick={handleDeleteMedia}
                    icon={faCircleXmark as any}
                    className={cx("delete-icon")}
                  />
                </div>
              ) : (
                <div className={cx("media-wrapper") + " w-2/3 h-64 flex items-center justify-center relative"}>
                  <img
                    src={URL.createObjectURL(mediaUrl)}
                    className="w-full h-full object-cover object-center rounded-xl"
                  />
                  <FontAwesomeIcon
                    onClick={handleDeleteMedia}
                    icon={faCircleXmark as any}
                    className={cx("delete-icon")}
                  />
                </div>
              ))}
          </div>

          <AnimeTag tagArr={["Spoiler", "GoodStory", "BestWaifu"]} ref={animeTag} />

          <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
            <label
              htmlFor="image-input"
              className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
            >
              <HiPhoto className="w-5 h-5 fill-[#3BC361]" />
              <span>Photo/Gif</span>
            </label>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              onChange={(e) => handleMediaChange(e, "image")}
              className="hidden"
            />

            <label
              htmlFor="video-input"
              className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
            >
              <HiVideoCamera className="w-5 h-5 fill-[#FF1D43]" />
              <span>Video</span>
            </label>
            <input
              type="file"
              id="video-input"
              accept="video/*"
              onChange={(e) => handleMediaChange(e, "video")}
              className="hidden"
            />

            <button
              type="submit"
              className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1"
            >
              <span>Share</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PostFormPopUp

function handleAnimeInformationPosting(status: any, animeInformation: any, episodes: any, tag: any, totalEps: any) {
  const postAnimeData = {
    watching_progress: status,
    anime_name: animeInformation.animeName,
    anime_id: animeInformation.animeID,
    episodes_seen: episodes,
    total_episodes: parseInt(totalEps) === 0 ? "1" : totalEps + "",
    tag: tag,
  }
  console.log(status)

  if (status === "Watching" && episodes === "0") {
    postAnimeData.watching_progress = "is watching"
    postAnimeData.episodes_seen = "1"
  } else if (status === "Watching") {
    postAnimeData.watching_progress = "is watching"
  } else if (status === "Plan to watch") {
    postAnimeData.watching_progress = "plan to watch"
    postAnimeData.episodes_seen = "0"
  } else if (status === "Finished") {
    postAnimeData.watching_progress = "have finished"
    postAnimeData.episodes_seen = postAnimeData.total_episodes
  } else if (status === "Drop") {
    postAnimeData.watching_progress = "have dropped"
  }
  if (postAnimeData.episodes_seen === postAnimeData.total_episodes) {
    postAnimeData.watching_progress = "have finished"
  }
  console.log(postAnimeData)

  return postAnimeData
}
