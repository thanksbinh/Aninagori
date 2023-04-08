/* eslint-disable @next/next/no-img-element */
import { FC, useContext, useRef, useState } from "react"
import classNames from "classnames/bind"
import styles from "./PostForm.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { HomeContext } from "../HomeContext"
import { handleDeleteMedia, handleMediaChange, handlePaste, handleSubmitForm } from "@/components/utils/postingUtils"
import PostButtonArea from "./postButtonArea/PostButtonArea"
import PostAdditional from "./postAdditional/PostAdditional"
import PostBasic from "./postBasic/PostBasic"
import { AnimeWatchStatus, AnimeSearch, AnimeScore, AnimeEpisodes } from "./animePostComponent"
import Avatar from "@/components/avatar/Avatar"

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
  const postAdditional = useRef()
  const { myUserInfo } = useContext(HomeContext)

  return (
    <div
      onClick={
        loadPosting
          ? () => {}
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
        onSubmit={
          loadPosting
            ? () => {}
            : (e) =>
                handleSubmitForm(
                  e,
                  animeStatus,
                  animeSearch,
                  animeEpisodes,
                  animeTag,
                  animeScore,
                  inputRef,
                  mediaUrl,
                  setLoadPosting,
                  username,
                  avatarUrl,
                  mediaType,
                  malAuthCode,
                  myUserInfo,
                  postAdditional,
                )
        }
        className="relative"
      >
        <FontAwesomeIcon
          onClick={
            loadPosting
              ? () => {}
              : () => {
                  setOpen(false)
                }
          }
          icon={faCircleXmark as any}
          className={`${cx("close-post")} z-20`}
          fill="white"
          stroke="white"
        />
        <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl my-4 transition ease-in-out duration-200">
          <div className="flex justify-start mt-4 px-4 mb-4 items-start">
            <Avatar imageUrl={avatarUrl} altText={username} size={10} />
            <h4 className="text-base font-bold ml-4">{username}</h4>
          </div>
          <div className={`flex flex-col px-4 max-h-[78vh] overflow-y-auto ${cx("scroll-custom")}`}>
            <div className={cx("status-wrapper")}>
              <AnimeWatchStatus ref={animeStatus} setShowScore={setShowScore} />
              <AnimeSearch ref={animeSearch} animeEpsRef={animeEpisodes} />
              <AnimeScore ref={animeScore} style={showScore ? { display: "flex" } : { display: "none" }} />
              <AnimeEpisodes ref={animeEpisodes} style={!showScore ? { display: "flex" } : { display: "none" }} />
            </div>
            <PostBasic
              setBasicPosting={setBasicPostingInfo}
              basicPosting={basicPostingInfo}
              animeTag={animeTag}
              inputRef={inputRef}
              handlePaste={(e: any) => {
                handlePaste(e, setMediaUrl, setMediaType, mediaUrl)
              }}
              mediaUrl={mediaUrl}
              mediaType={mediaType}
              handleDeleteMedia={(e: any) => {
                handleDeleteMedia(e, mediaUrl, setMediaUrl)
              }}
              handleMediaChange={(e: any) => {
                handleMediaChange(e, mediaUrl, setMediaType, setMediaUrl)
              }}
            />
            <PostAdditional
              ref={postAdditional}
              basicPostingInfo={basicPostingInfo}
              className={basicPostingInfo ? "hidden" : "flex"}
            />
            <PostButtonArea
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
