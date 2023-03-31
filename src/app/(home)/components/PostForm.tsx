/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client"

import { HiPhoto, HiVideoCamera } from "react-icons/hi2"
import { FC, useState, useEffect } from "react"
import Avatar from "@/components/avatar/Avatar"
import PostFormPopUp from "./PostFormPopUp"

type PostFormProps = {
  username: string
  avatarUrl: string
  isBanned: boolean
  setOpen?: any
  open?: any
  malAuthCode?: string
  className?: any
}

const PostForm: FC<PostFormProps> = ({ username, avatarUrl, className = "", isBanned, malAuthCode }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }, [])

  // async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
  //   e.preventDefault()
  //   if (!inputRef.current?.value && !mediaUrl) return;

  //   const downloadMediaUrl = await uploadMedia();
  //   await addDoc(collection(db, 'posts'), {
  //     authorName: username,
  //     avatarUrl: avatarUrl,
  //     timestamp: serverTimestamp(),
  //     content: inputRef.current?.value || "",
  //     imageUrl: (mediaType === "image") ? downloadMediaUrl : "",
  //     videoUrl: (mediaType === "video") ? downloadMediaUrl : "",
  //   });

  //   inputRef.current!.value = "";
  //   setMediaUrl(null)

  //   router.refresh();
  // }

  function openForm() {
    setTimeout(() => {
      setOpen(true)
    }, 90)
  }

  if (isBanned)
    return (
      <form>
        <div className="flex flex-col item flex-1 bg-ani-black rounded-2xl px-4 my-4">
          <div className="flex justify-between items-center mt-4">
            <Avatar imageUrl={avatarUrl} altText={username} size={8} />
            <input
              type="text"
              disabled
              className="flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-ani-gray caret-white"
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
              <HiPhoto className="w-5 h-5" />
              <span>Photo/Gif</span>
            </label>

            <label
              htmlFor="video-input"
              className="flex flex-1 items-center justify-center space-x-1 text-[#fff] py-2 px-4 rounded-lg mt-1 mx-1"
            >
              <HiVideoCamera className="w-5 h-5" />
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
      </form>
    )

  return (
    <div className={className}>
      <PostFormPopUp
        malAuthCode={malAuthCode}
        username={username}
        avatarUrl={avatarUrl}
        setOpen={setOpen}
        open={open}
      />
      <div className="flex flex-col flex-1 bg-ani-black rounded-2xl px-4 my-4">
        <div className="flex justify-between items-center mt-4">
          <Avatar imageUrl={avatarUrl} altText={username} size={8} />
          {/* <input
            type="text"
            ref={inputRef}
            placeholder="Share your favourite Animemory now!"
            className="flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-ani-gray caret-white"
          />
        </div>


        <div className="mt-4 w-2/3">
          {mediaUrl && (
            mediaUrl.name.endsWith(".mp4") ? (
              <video src={URL.createObjectURL(mediaUrl)} controls />
            ) : (
              <img src={URL.createObjectURL(mediaUrl)} className="w-full object-contain" />
            )
          )}
        </div>

        <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-ani-light-gray">
          <label htmlFor="image-input" className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"> */}
          <div
            onClick={() => {
              openForm()
            }}
            className="cursor-default flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-ani-light-gray hover:bg-[#4e5d78] hover:cursor-pointer caret-white"
          >
            Share your favourite Animemory now!
          </div>
        </div>

        <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-ani-light-gray">
          <label
            onClick={() => {
              openForm()
            }}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
          >
            <HiPhoto className="w-5 h-5 fill-[#3BC361]" />
            <span>Photo/Gif</span>
          </label>

          <label
            onClick={() => {
              openForm()
            }}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
          >
            <HiVideoCamera className="w-5 h-5 fill-[#FF1D43]" />
            <span>Video</span>
          </label>

          {/* <button type="submit" className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#00b4d8] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1"> */}
          <button
            onClick={() => {
              setOpen(true)
            }}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1"
          >
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostForm
