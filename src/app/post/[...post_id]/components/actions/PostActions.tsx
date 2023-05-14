"use client"

import Avatar from "@/components/avatar/Avatar"
import { CommentInfo, ReactionInfo } from "@/global/Post.types"
import { useRouter } from "next/navigation"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { PostContext } from "../../PostContext"
import CommentForm from "../comment/CommentForm"
import Comments from "../comment/Comments"
import PostPopup from "../post/PostPopup"
import Comment from "./CommentBtn"
import PlanToWatch from "./PlanToWatchBtn"
import Reaction from "./ReactionBtn"

interface PostDynamicProps {
  commentCountPromise?: Promise<number> | number
  comments?: CommentInfo[]
  focusedComment?: string
  showTopReaction?: boolean
  animeStatus?: string
}

const PostActions: FC<PostDynamicProps> = ({
  commentCountPromise = 0,
  comments: comments0 = [],
  focusedComment,
  showTopReaction,
  animeStatus
}) => {
  const { postData } = useContext(PostContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [reactions, setReactions] = useState(postData?.reactions || [])
  const [commentCount, setCommentCount] = useState(0)
  const [comments, setComments] = useState<CommentInfo[]>([])
  const [lastComment, setLastComment] = useState<CommentInfo>()
  const [postExpand, setPostExpand] = useState(false)

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

  return (
    <div className="flex flex-col flex-1 bg-ani-gray rounded-2xl p-4 pt-0 rounded-t-none">
      {/* Recent reactions */}
      <div className="flex my-4 mx-2">
        {(reactions.length > 2 ? reactions.slice(reactions.length - 3) : reactions.slice(0))
          .reverse()
          .map((user: ReactionInfo) => (
            <Avatar
              imageUrl={user.image || ""}
              altText={user.username}
              size={5}
              key={user.username}
              className="liked-avatar"
            />
          ))}
      </div>

      <div className="flex items-center justify-between border-t border-b border-ani-light-gray mx-2">
        <Reaction reactions={reactions} setReactions={setReactions} showTopReaction={!!showTopReaction} />
        <Comment inputRef={inputRef} commentCount={commentCount} />
        <PlanToWatch animeStatus={animeStatus || ""} />
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
        // Todo: Very outdated and buggy, need to fix
        <PostPopup
          isOpen={postExpand}
          onClose={() => {
            setPostExpand(false)
            // router.refresh()
          }}
        />
      )}

      <div className="mx-2">
        <Comments comments={comments} focusedComment={focusedComment} />
        <CommentForm setLastComment={setLastComment} inputRef={inputRef} />
      </div>
    </div>
  )
}

export default PostActions
