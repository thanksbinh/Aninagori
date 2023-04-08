"use client"

import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters"
import { AiOutlineComment } from "@react-icons/all-files/ai/AiOutlineComment"
import { RiAddCircleLine } from "@react-icons/all-files/ri/RiAddCircleLine"
import { RiCheckboxCircleLine } from "@react-icons/all-files/ri/RiCheckboxCircleLine"
import Avatar from "@/components/avatar/Avatar"
import { db } from "@/firebase/firebase-app"
import { useRouter } from "next/navigation"
import { CommentProps } from "../comment/Comment.types"
import CommentForm from "../comment/CommentForm"
import Comments from "../comment/Comments"
import { PostContext } from "../../PostContext"
import Reaction from "../reaction/Reaction"
import PostPopup from "./PostPopup"
import { adjustAnimeListArray, getDateNow } from "@/components/utils/postingUtils"
import { useSession } from "next-auth/react"
import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"
interface PostDynamicProps {
  reactions?: Object[]
  commentCountPromise?: Promise<number> | number
  comments?: CommentProps[]
  focusedComment?: string
  animeID?: any
  malAuthCode?: any
  myUserInfo?: any
}

const PostAction: FC<PostDynamicProps> = ({
  reactions: reactions0 = [],
  commentCountPromise = 0,
  comments: comments0 = [],
  focusedComment,
  animeID,
  malAuthCode,
  myUserInfo,
}) => {
  const { postId } = useContext(PostContext)
  const [reactions, setReactions] = useState(reactions0)
  const [commentCount, setCommentCount] = useState(0)
  const [comments, setComments] = useState<CommentProps[]>([])
  const [lastComment, setLastComment] = useState<CommentProps>()
  const [postExpand, setPostExpand] = useState(false)
  const [loadingPlanToWatch, setLoadingPlanTowatch] = useState(false)
  const [planTowatch, setPlanTowatch] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Update post's reaction realtime
  useEffect(() => {
    if (!postId) return

    const postRef = doc(db, "posts", postId)
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      setReactions(docSnap?.data()?.reactions || [])
    })

    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      const newCount = await commentCountPromise
      newCount && setCommentCount(newCount)
    }
    fetchData()
  }, [commentCountPromise])

  useEffect(() => {
    comments0.length != comments.length && setComments(comments0)
  }, [comments0])

  useEffect(() => {
    if (!lastComment) return

    setCommentCount(commentCount + 1)
    setComments([...comments, lastComment])
  }, [lastComment])

  const onComment = () => {
    inputRef.current && inputRef.current.focus()
  }

  return (
    <div className="flex flex-col flex-1 bg-ani-gray rounded-2xl p-4 pt-0 rounded-t-none">
      {/* Recent reactions */}
      <div className="flex my-4 mx-2">
        {(reactions.length > 2 ? reactions.slice(reactions.length - 3) : reactions.slice(0))
          .reverse()
          .map((user: any) => (
            <Avatar
              className="liked-avatar"
              imageUrl={user.image}
              altText={user.username}
              size={5}
              key={user.username}
            />
          ))}
      </div>

      {/* 3 post actions */}
      <div className="flex items-center justify-between border-t border-b border-ani-light-gray mx-2">
        <Reaction reactions={reactions} setReactions={setReactions} />

        <div className="flex">
          <button
            title="comment"
            onClick={onComment}
            className="flex items-center space-x-1 text-gray-400 hover:text-[#3BC361]"
          >
            <AiOutlineComment className="w-5 h-5" />
          </button>
          <span className="text-gray-400 ml-2">{commentCount}</span>
        </div>

        {planTowatch && (
          <button title="plan to watch" className="flex items-center space-x-1 text-[#3BC361]">
            <RiCheckboxCircleLine className="w-5 h-5" />
            <span>Plan to Watch</span>
          </button>
        )}
        {!planTowatch && !loadingPlanToWatch && (
          <button
            title="plan to watch"

            className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D]"
          >
            <RiAddCircleLine className="w-5 h-5" />
            <span>Plan to Watch</span>
          </button>
        )}
        {loadingPlanToWatch && (
          <button
            title="set plan to watch this anime..."
            className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D]"
          >
            <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
            <span>Set plan to watch this anime</span>
          </button>
        )}
      </div>

      {/* Expand post */}
      {commentCount > comments.length && (
        <div>
          <div
            onClick={() => setPostExpand(true)}
            className="mt-4 ml-2 text-sm font-bold text-gray-400 hover:cursor-pointer hover:underline"
          >
            View more comments
          </div>
        </div>
      )}
      {postExpand && (
        <PostPopup
          isOpen={postExpand}
          onClose={() => {
            setPostExpand(false)
            router.refresh()
          }}
        />
      )}

      {/* Comments and comment's form */}
      <div className="mx-2">
        <Comments comments={comments} focusedComment={focusedComment} />
        <CommentForm setLastComment={setLastComment} inputRef={inputRef} />
      </div>
    </div>
  )
}

const onPlanToWatch = async () => {
  // if (!!!animeID) {
  //   alert("You can't plan to watch anime without name 😥")
  //   return
  // }
  // // user have connect to MAL
  // setLoadingPlanTowatch(true)
  // if (!!malAuthCode) {
  //   fetch(getProductionBaseUrl() + "/api/updatestatus/" + animeID, {
  //     headers: {
  //       status: "plan_to_watch",
  //       episode: "0",
  //       score: "0",
  //       auth_code: malAuthCode,
  //     } as any,
  //   }).then((res) => res.json()).then((data) => {
  //     setLoadingPlanTowatch(false)
  //     setPlanTowatch(true)
  //   })
  //   return
  // }
  // // user not connect to MAL
  // const dateNow = getDateNow()
  // const myAnimeListRef = doc(db, "myAnimeList", myUserInfo?.username)
  // const animeInformation = await fetch(getProductionBaseUrl() + "/api/anime/" + animeID).then((res) => res.json())
  // const animeData = {
  //   list_status: {
  //     is_rewatching: false,
  //     num_episodes_watched: 0,
  //     score: 0,
  //     status: "plan_to_watch",
  //     updated_at: dateNow,
  //   },
  //   node: {
  //     id: animeID,
  //     main_picture: animeInformation.main_picture,
  //     title: animeInformation.title,
  //   },
  // }
  // const animeDataAfterCheck = await adjustAnimeListArray(myUserInfo?.username, animeData)
  // const myAnimeListPromise = await setDoc(myAnimeListRef, {
  //   last_updated: dateNow,
  //   animeList: animeDataAfterCheck,
  // })
  // setLoadingPlanTowatch(false)
  // setPlanTowatch(true)
}

export default PostAction
