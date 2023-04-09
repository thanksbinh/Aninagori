"use client"

import { HiPhotograph } from "@react-icons/all-files/hi/HiPhotograph"
import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill"
import { FC, useState, useEffect } from "react"
import Avatar from "@/components/avatar/Avatar"
import PostFormPopUp from "../postFormPopup/PostFormPopUp"
import PostFormShortcut from "./PostFormShortcut"
import { HomeContext } from "../../HomeContext"
import { useContext } from "react"
import { PostFormContext } from "./PostFormContext"

type PostFormProps = {
  myAnimeList?: any
}

const PostForm: FC<PostFormProps> = ({ myAnimeList }) => {
  const { myUserInfo } = useContext(HomeContext)

  const [open, setOpen] = useState(false)
  const [recentAnimeList, setRecentAnimeList] = useState<any>([])

  useEffect(() => {
    if (!myAnimeList) return;

    const watchingList = [] as any
    const p2wList = [] as any

    myAnimeList.forEach((anime: any) => {
      if (anime.list_status.status === "watching") watchingList.push(anime)
      else if (anime.list_status.status === "plan_to_watch" && anime.node.num_episodes) p2wList.push(anime)
    })

    setRecentAnimeList([...watchingList, ...p2wList])
  }, [])

  function openForm() {
    setTimeout(() => {
      setOpen(true)
    }, 90)
  }

  if (!!myUserInfo.is_banned) return <BannedPostForm avatarUrl={myUserInfo.image} />

  return (
    <PostFormContext.Provider value={{ recentAnimeList, setRecentAnimeList }} >
      <div className={`flex ${open ? "visible" : "invisible"}`}>
        <PostFormPopUp setOpen={setOpen} />
      </div>
      <div className="flex flex-col flex-shrink-0 bg-ani-gray rounded-2xl px-4 my-4">
        <div className="flex justify-between items-center mt-4">
          <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={8} />
          <div
            onClick={openForm}
            className="cursor-default flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-ani-light-gray hover:bg-[#4e5d78] hover:cursor-pointer caret-white"
          >
            Share your favourite Animemory now!
          </div>
        </div>

        <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-ani-light-gray">
          <label
            onClick={openForm}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
          >
            <HiPhotograph className="w-5 h-5 fill-[#3BC361]" />
            <span>Photo/Gif</span>
          </label>

          <label
            onClick={openForm}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
          >
            <BsCameraVideoFill className="w-5 h-5 fill-[#FF1D43]" />
            <span>Video</span>
          </label>

          <button
            onClick={openForm}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1"
          >
            <span>Share</span>
          </button>
        </div>
      </div>

      {!!myAnimeList &&
        <PostFormShortcut openFormPopup={openForm} />
      }
    </PostFormContext.Provider>
  )
}

function BannedPostForm({ avatarUrl }: { avatarUrl: string }) {
  return (
    <div className="flex flex-col item flex-1 bg-ani-gray rounded-2xl px-4 my-4">
      <div className="flex justify-between items-center mt-4">
        <Avatar imageUrl={avatarUrl} altText={""} size={8} />
        <input
          type="text"
          disabled
          className="flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-ani-black caret-white"
        />
      </div>

      <div className="flex w-full mt-4">
        <img src="/banned.gif" className="w-2/3 object-contain" />
        <div>you&apos;ve been banned</div>
      </div>

      <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
        <label
          htmlFor="image-input"
          className="flex flex-1 items-center justify-center space-x-1 text-[#fff] py-2 px-4 rounded-lg mt-1 mx-1"
        >
          <HiPhotograph className="w-5 h-5" />
          <span>Photo/Gif</span>
        </label>

        <label
          htmlFor="video-input"
          className="flex flex-1 items-center justify-center space-x-1 text-[#fff] py-2 px-4 rounded-lg mt-1 mx-1"
        >
          <BsCameraVideoFill className="w-5 h-5" />
          <span>Video</span>
        </label>

        <button
          type="submit"
          disabled
          className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#798597] py-2 px-4 rounded-lg mt-1 mx-1"
        >
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}

export default PostForm
