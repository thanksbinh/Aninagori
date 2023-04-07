/* eslint-disable @next/next/no-img-element */
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { HiPhotograph } from "@react-icons/all-files/hi/HiPhotograph"
import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill"
import { useRouter } from "next/navigation"
import { FC, useContext, useRef, useState } from "react"
import { db, storage } from "@/firebase/firebase-app"
import { v4 } from "uuid"
import classNames from "classnames/bind"
import styles from "./PostForm.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons"

import Avatar from "@/components/avatar/Avatar"
import AnimeWatchStatus from "./animePostComponent/AnimeWatchStatus/AnimeWatchStatus"
import AnimeSearch from "./animePostComponent/AnimeSearch/AnimeSearch"
import AnimeEpisodes from "./animePostComponent/AnimeEpisodes/AnimeEpisodes"
import AnimeTag from "./animePostComponent/AnimeTag/AnimeTag"
import AnimeScore from "./animePostComponent/AnimeScore/AnimeScore"
import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"
import { HomeContext } from "../HomeContext"
import { updateStatusOnFriendLists } from "./functions/syncUpdates"

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
  const router = useRouter()
  const animeStatus = useRef()
  const animeSearch = useRef()
  const animeEpisodes = useRef()
  const animeTag = useRef()
  const animeScore = useRef()
  const { myUserInfo } = useContext(HomeContext)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    const statusData = (animeStatus?.current as any).getAnimeStatus()
    const searchData = (animeSearch?.current as any).getAnimeName()
    const episodesData = (animeEpisodes?.current as any).getAnimeEpisodes()
    const totalEps = (animeEpisodes?.current as any).getAnimeTotal()
    const tagData = (animeTag?.current as any).getAnimeTag()
    const scoreData = (animeScore?.current as any).getAnimeScore()
    const resetTag = (animeTag?.current as any).resetAnimeTag

    e.preventDefault()
    if (!inputRef.current?.value && mediaUrl.length === 0) {
      alert("Please write something or upload media 😭")
      return
    }
    setLoadPosting(true)
    const postAnimeData = handleAnimeInformationPosting(
      statusData,
      searchData,
      episodesData,
      tagData,
      totalEps,
      scoreData,
    )

    const downloadMediaUrl = await uploadMedia()
    //TODO: promise.all post + update MAL watch status
    const promisePost = [
      addDoc(collection(db, "posts"), {
        authorName: username,
        avatarUrl: avatarUrl,
        timestamp: serverTimestamp(),
        content: inputRef.current?.value || "",
        imageUrl: mediaType === "image" ? downloadMediaUrl : "",
        videoUrl: mediaType === "video" ? downloadMediaUrl[0] : "",
        post_anime_data:
          (animeSearch?.current as any).getAnimeName().animeID === "" ? { tag: postAnimeData.tag } : postAnimeData,
        comments: 0,
      }),
    ] as any

    try {
      // post have anime data
      if (!!postAnimeData.anime_id) {
        // user connect with MAL
        if (!!malAuthCode) {
          const promiseUpdateMAL = fetch(getProductionBaseUrl() + "/api/updatestatus/" + postAnimeData.anime_id, {
            headers: {
              status: convertWatchStatus(postAnimeData.watching_progress),
              episode: postAnimeData.episodes_seen,
              score: (postAnimeData as any).score,
              auth_code: malAuthCode,
            } as any,
          }).then((res) => res.json())
          promisePost.push(promiseUpdateMAL)
        } else {
          console.log("User havent connect to MAL")
        }
        // Update status on friend list
        promisePost.push(updateStatusOnFriendLists(myUserInfo, { ...postAnimeData, status: convertWatchStatus(postAnimeData.watching_progress) }))
      }
      const result = await Promise.all(promisePost)
      // location.reload()
    } catch (error) {
      console.log(error)
    } finally {
      inputRef.current!.value = ""
      setMediaUrl([])
      setOpen(false)
      setLoadPosting(false)
      resetTag()
      router.refresh()
    }
  }

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

  const handleMediaChange = (e: any, mediaType: string) => {
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
        onSubmit={loadPosting ? () => { } : (e) => handleSubmit(e)}
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

          <div className="mt-4 w-full flex items-center justify-center">
            <input
              type="file"
              id="multi-media-input"
              accept="video/*,image/*"
              onChange={(e) => handleMediaChange(e, "image")}
              className="hidden"
            />
            {mediaUrl.length > 0 ? (
              mediaType === "video" ? (
                <div className={cx("media-wrapper") + " w-2/3 h-2/5 flex items-center relative"}>
                  <video src={URL.createObjectURL(mediaUrl[0])} className="w-full object-contain rounded-xl" controls />
                  <FontAwesomeIcon
                    onClick={() => {
                      handleDeleteMedia(0)
                    }}
                    icon={faCircleXmark as any}
                    className={cx("delete-icon")}
                  />
                </div>
              ) : (
                <div
                  className={
                    cx("media-wrapper") +
                    " w-full h-64 flex items-center relative overflow-x-auto bg-[#212833] rounded-xl px-4 py-4"
                  }
                >
                  {mediaUrl.map((media: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className={cx("image-wrapper")}
                        style={{ backgroundImage: `url(${URL.createObjectURL(media)})` }}
                      >
                        <FontAwesomeIcon
                          onClick={() => {
                            handleDeleteMedia(index)
                          }}
                          icon={faCircleXmark as any}
                          className={cx("delete-icon")}
                        />
                      </div>
                    )
                  })}
                  <label htmlFor="multi-media-input" className={cx("add-media")}>
                    <FontAwesomeIcon
                      icon={faFileCirclePlus as any}
                      className="text-[#3BC361] text-4xl hover:text-green-400"
                    />
                  </label>
                </div>
              )
            ) : (
              <>
                <label
                  className={
                    cx("media-wrapper", { "no-media-wrapper": true }) +
                    " w-full h-64 flex items-center justify-center relative hover:opacity-75 rounded-xl border-2 border-[#3BC361] cursor-pointer"
                  }
                  htmlFor="multi-media-input"
                >
                  <FontAwesomeIcon
                    icon={faFileCirclePlus as any}
                    className="text-[#3BC361] text-4xl hover:text-green-400"
                  />
                </label>
              </>
            )}
          </div>

          <AnimeTag tagArr={["Spoiler", "GoodStory", "BestWaifu", "NSFW"]} ref={animeTag} />

          <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
            <label
              htmlFor="image-input"
              className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
            >
              <HiPhotograph className="w-5 h-5 fill-[#3BC361]" />
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
              <BsCameraVideoFill className="w-5 h-5 fill-[#FF1D43]" />
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
              {loadPosting && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>Share</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PostFormPopUp

function handleAnimeInformationPosting(
  status: any,
  animeInformation: any,
  episodes: any,
  tag: any,
  totalEps: any,
  score: any,
) {
  const postAnimeData = {
    watching_progress: status,
    anime_name: animeInformation.animeName,
    anime_id: animeInformation.animeID,
    episodes_seen: episodes,
    total_episodes: parseInt(totalEps) === 0 ? "1" : totalEps + "",
    tag: tag,
  }

  if (status === "Watching" && episodes === "0") {
    postAnimeData.watching_progress = "is watching"
    postAnimeData.episodes_seen = "1"
  } else if (status === "Watching") {
    postAnimeData.watching_progress = "is watching"
  } else if (status === "Plan to watch") {
    postAnimeData.watching_progress = "plan to watch"
    postAnimeData.episodes_seen = "0"
  } else if (status === "Finished") {
    ; (postAnimeData as any).score = score
    postAnimeData.watching_progress = "have finished"
    postAnimeData.episodes_seen = postAnimeData.total_episodes
  } else if (status === "Drop") {
    postAnimeData.watching_progress = "have dropped"
  }
  if (postAnimeData.episodes_seen === postAnimeData.total_episodes) {
    postAnimeData.watching_progress = "have finished"
  }

  return postAnimeData
}

function convertWatchStatus(watchStatus: string) {
  switch (watchStatus) {
    case "is watching":
      return "watching"
    case "have dropped":
      return "dropped"
    case "plan to watch":
      return "plan_to_watch"
    case "have finished":
      return "completed"
    default:
      break
  }
}
