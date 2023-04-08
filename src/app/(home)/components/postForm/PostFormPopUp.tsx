/* eslint-disable @next/next/no-img-element */
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames/bind"
import { FC, useContext, useRef, useState } from "react"
import styles from "./PostForm.module.scss"

import Avatar from "@/components/avatar/Avatar"
import { handleDeleteMedia, handleMediaChange, handlePaste, handleSubmitForm } from "@/components/utils/postingUtils"
import { useRouter } from "next/navigation"
import { HomeContext } from "../../HomeContext"
import AnimeEpisodes from "./animePostComponent/AnimeEpisodes/AnimeEpisodes"
import AnimeScore from "./animePostComponent/AnimeScore/AnimeScore"
import AnimeSearch from "./animePostComponent/AnimeSearch/AnimeSearch"
import AnimeWatchStatus from "./animePostComponent/AnimeWatchStatus/AnimeWatchStatus"
import PostFormDetails from "./postFormDetails/PostFormDetails"
import PostFormActions from "./PostFormActions"
import PostFormMediaDisplay from "./PostFormMediaDisplay"
import AnimeTag from "./animePostComponent/AnimeTag/AnimeTag"

const cx = classNames.bind(styles)

type PostFormProps = {
  setOpen?: any
  recentAnimeList: any
}

const PostFormPopUp: FC<PostFormProps> = ({ setOpen, recentAnimeList }) => {
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
  const postAdditional = useRef()
  const { myUserInfo } = useContext(HomeContext)
  const router = useRouter();

  function clearForm() {
    (animeTag?.current as any).resetAnimeTag();
    (postAdditional?.current as any).resetAdditionalPost();
    (animeSearch?.current as any).resetAnimeSearch();
    (animeEpisodes?.current as any).setAnimeEpisodes("0");
    inputRef.current!.value = ""
    setLoadPosting(false)
    setMediaUrl([])
    setOpen(false)
    router.refresh()
  }

  async function handleSubmit(e: any) {
    e.preventDefault()

    await handleSubmitForm(
      animeStatus, animeSearch, animeEpisodes, animeTag,
      animeScore, inputRef, mediaUrl, setLoadPosting,
      mediaType, myUserInfo, postAdditional
    )

    clearForm()
  }

  return (
    <div
      onClick={() => {
        !loadPosting && setTimeout(() => {
          setOpen(false)
        }, 90)
      }}
      className={cx("modal")}
    >
      <div className={cx("modal_overlay")}></div>
      <form
        onClick={(e) => {
          e.stopPropagation()
        }}
        onSubmit={(e) => {
          !loadPosting && handleSubmit(e)
        }}
        className="relative"
      >
        <FontAwesomeIcon
          onClick={() => {
            !loadPosting && setOpen(false)
          }}
          icon={faCircleXmark as any}
          fill="white"
          stroke="white"
          className={`${cx("close-post")} z-20`}
        />
        <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl my-4 transition ease-in-out duration-200">
          <div className="flex justify-start mt-4 px-4 mb-4 items-start">
            <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={10} />
            <h4 className="text-base font-bold ml-4">{myUserInfo.username}</h4>
          </div>
          <div className={`flex flex-col px-4 max-h-[78vh] overflow-y-auto ${cx("scroll-custom")}`}>
            <div className={cx("status-wrapper")}>
              <AnimeWatchStatus ref={animeStatus} setShowScore={setShowScore} />
              <AnimeSearch ref={animeSearch} animeEpsRef={animeEpisodes} recentAnimeList={recentAnimeList} />
              {showScore ?
                <AnimeScore ref={animeScore} /> :
                <AnimeEpisodes ref={animeEpisodes} />}
            </div>

            <div className="flex flex-col">
              <input
                type="text"
                ref={inputRef}
                onPaste={(e: any) => {
                  handlePaste(e, setMediaUrl, setMediaType, mediaUrl)
                }}
                placeholder="Share your favourite Animemory now!"
                className="flex rounded-3xl mt-4 mb-5 py-3 px-4 w-full focus:outline-none bg-[#212833] caret-white"
              />
              <PostFormMediaDisplay mediaUrl={mediaUrl} mediaType={mediaType} handleDeleteMedia={handleDeleteMedia} handleMediaChange={handleMediaChange} />
              <AnimeTag ref={animeTag} />
              <p onClick={() => { setBasicPostingInfo(!basicPostingInfo) }} className="whitespace-nowrap ml-2 my-3 text-ani-text-main cursor-pointer font-bold underline text-sm opacity-80 hover:opacity-100">
                {basicPostingInfo ? "More details..." : "Fewer details..."}
              </p>
            </div>

            <PostFormDetails
              ref={postAdditional}
              basicPostingInfo={basicPostingInfo}
              className={basicPostingInfo ? "hidden" : "flex"}
            />

            <PostFormActions
              setBasicPostingInfo={setBasicPostingInfo}
              loadPosting={loadPosting}
              handleMediaChange={(e: any) => {
                handleMediaChange(e, mediaUrl, setMediaType, setMediaUrl)
              }}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default PostFormPopUp
