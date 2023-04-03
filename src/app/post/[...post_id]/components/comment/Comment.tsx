import Avatar from "@/components/avatar/Avatar";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { PostContext } from "../../PostContext";
import { sentReaction, sentReactionReply } from "../reaction/doReaction";
import { CommentProps } from "./Comment.types";
import CommentForm from "./CommentForm";

const Comment = ({ comment, focused, onParentReply }: { comment: CommentProps, focused?: string, onParentReply?: any }) => {
  const { myUserInfo, postId } = useContext(PostContext)

  const [reactionToggle, setReactionToggle] = useState(false)
  const [reactions, setReactions] = useState(comment.reactions || [])

  const [replies, setReplies] = useState<CommentProps[]>([])
  const [lastReply, setLastReply] = useState<CommentProps>()

  const [openReplyForm, setOpenReplyForm] = useState(false)
  const [taggedUser, setTaggedUser] = useState("")

  const ref = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [focusingType, setFocusingType] = useState(focused || "none")

  useEffect(() => {
    if (focusingType != "none" && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const timeoutId = setTimeout(() => {
        setFocusingType("none")
      }, 2000)

      return () => clearTimeout(timeoutId);
    }
  }, [ref.current, focusingType])

  useEffect(() => {
    if (!comment.reactions) return;

    setReactionToggle(comment.reactions.some((e: any) => e.username === myUserInfo.username))
    setReactions(comment.reactions)
  }, [comment.reactions])

  useEffect(() => {
    comment.replies && setReplies(comment.replies)
  }, [comment.replies])

  useEffect(() => {
    if (!lastReply) return;

    setReplies([
      ...replies,
      lastReply
    ])
  }, [lastReply])

  const onCommentReaction = () => {
    const myReaction = {
      username: myUserInfo.username,
      type: "heart"
    }

    if (!reactionToggle) {
      setReactions([...reactions, myReaction])
    } else {
      setReactions(reactions.filter(reaction => reaction.username !== myUserInfo.username))
    }

    sentReaction(myUserInfo, myReaction, reactionToggle, comment.username, comment.content, postId, comment.id!)
    setReactionToggle(!reactionToggle)
  }

  const onReplyReaction = async () => {
    const myReaction = {
      username: myUserInfo.username,
      type: "heart"
    }

    let replyReactions = []

    if (!reactionToggle) {
      replyReactions = [...reactions, myReaction]
      setReactions(replyReactions)
    } else {
      replyReactions = reactions.filter(reaction => reaction.username !== myUserInfo.username)
      setReactions(replyReactions)
    }

    sentReactionReply(myUserInfo, replyReactions, reactionToggle, comment, postId)
    setReactionToggle(!reactionToggle)
  }

  const onReplyClick = (username: string) => {
    onParentReply && onParentReply(username)

    setOpenReplyForm(true)
    setTaggedUser(username)

    inputRef.current && (inputRef.current.value = "@" + taggedUser + " ")
    inputRef.current?.focus()
  }

  useEffect(() => {
    inputRef.current && (inputRef.current.value = "@" + taggedUser + " ")
    inputRef.current?.focus()
  }, [inputRef.current, taggedUser])

  return (
    <div ref={ref} className="flex flex-col mt-4">
      {/* Comment content */}
      <div className="flex justify-between text-ani-text-main">
        <Link href={"/user/" + comment!.username} className="min-w-fit"><Avatar imageUrl={comment!.avatarUrl} altText={comment!.username} size={8} /></Link>
        <div className={`rounded-2xl py-2 px-4 ml-2 w-full focus:outline-none caret-white transition-colors duration-300 ease-out ${focusingType === "comment" ? "bg-gray-600" : "bg-ani-light-gray"}`}>
          <Link href={"/user/" + comment!.username} className="text-sm font-bold">{comment!.username}</Link>
          <br />
          {comment!.content}
        </div>
      </div>

      {/* 3 comment/reply actions */}
      <div className="flex gap-2 ml-14 mt-1 text-xs font-bold text-gray-400">
        <div>
          <span onClick={comment.id ? onCommentReaction : onReplyReaction} className={`hover:cursor-pointer hover:underline ${reactionToggle && "text-[#F14141]"}`}>Like</span>
          {(reactions.length > 0) && (<span> +{reactions.length}</span>)}
        </div>

        <div onClick={() => onReplyClick(comment.username)} className="font-bold text-gray-400 hover:cursor-pointer hover:underline">Reply</div>

        <Link href={"/post/" + postId + "/comment/" + (comment.id || comment.parentId + "&replies")} className="text-gray-400 hover:cursor-pointer hover:underline">{comment!.timestamp}</Link>
      </div>

      {/* Replies and reply's form */}
      <div className="ml-10 border-l-2 border-gray-400 pl-4">
        {replies?.map((reply, index) => {
          return (
            <div key={index}>
              <Comment comment={reply} focused={(focusingType === "replies") ? "comment" : "none"} onParentReply={onReplyClick} />
            </div>
          )
        })}
        {openReplyForm && !comment.parentId && (
          <CommentForm setLastComment={setLastReply} inputRef={inputRef} commentId={comment.id} />
        )}
      </div>
    </div>
  )
}

export default Comment;