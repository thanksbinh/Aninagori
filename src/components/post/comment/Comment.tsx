import { arrayRemove, arrayUnion, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useContext, useState, useRef } from "react";
import { db } from "@/firebase/firebase-app";
import Avatar from "../../avatar/Avatar";
import { PostContext } from "../context/PostContext";
import CommentForm from "./CommentForm";
import Link from "next/link";

export interface CommentProps {
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  reactions?: any[];
  replies?: any[];
  // A comment has an id
  id?: string;
  // A reply has these
  parentId?: string;
  realTimestamp?: Timestamp;
}

const Comment = ({ comment, onParentReply }: { comment: CommentProps, onParentReply?: any }) => {
  const { myUserInfo, postId } = useContext(PostContext)

  const [reactionToggle, setReactionToggle] = useState(false)
  const [reactions, setReactions] = useState(comment.reactions || [])

  const [replies, setReplies] = useState<CommentProps[]>([])
  const [lastReply, setLastReply] = useState<CommentProps>()

  const [openReplyForm, setOpenReplyForm] = useState(false)
  const [taggedUser, setTaggedUser] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

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
    const commentRef = doc(db, "posts", postId, "comments", comment.id!);
    const myReaction = {
      username: myUserInfo.username,
      type: "heart"
    }

    if (!reactionToggle) {
      setReactions([...reactions, myReaction])
      updateDoc(commentRef, {
        reactions: arrayUnion(myReaction)
      });
    } else {
      setReactions(reactions.filter(reaction => reaction.username !== myUserInfo.username))
      updateDoc(commentRef, {
        reactions: arrayRemove(myReaction)
      });
    }

    setReactionToggle(!reactionToggle)
  }

  const onReplyReaction = async () => {
    let thisReply = {
      avatarUrl: comment.avatarUrl,
      content: comment.content,
      timestamp: new Timestamp(comment.realTimestamp!.seconds, comment.realTimestamp!.nanoseconds),
      username: comment.username,
    } as any

    if (comment.reactions)
      thisReply = { ...thisReply, reactions: comment.reactions }

    const commentRef = doc(db, "posts", postId, "comments", comment.parentId!);
    const myReaction = {
      username: myUserInfo.username,
      type: "heart"
    }

    if (!reactionToggle) {
      const newReactions = [...reactions, myReaction]
      updateDoc(commentRef, {
        replies: arrayRemove(thisReply)
      });
      updateDoc(commentRef, {
        replies: arrayUnion({ ...thisReply, reactions: newReactions })
      });
      setReactions(newReactions)
    } else {
      const newReactions = reactions.filter(reaction => reaction.username !== myUserInfo.username)
      updateDoc(commentRef, {
        replies: arrayRemove(thisReply)
      });
      updateDoc(commentRef, {
        replies: arrayUnion({ ...thisReply, reactions: newReactions })
      });
      setReactions(newReactions)
    }

    setReactionToggle(!reactionToggle)
  }

  const onReply = (username: string) => {
    onParentReply && onParentReply(username)

    setOpenReplyForm(true)
    setTaggedUser(username)

    inputRef.current?.focus()
  }

  useEffect(() => {
    inputRef.current && (inputRef.current.value = "@" + taggedUser + " ")
    inputRef.current?.focus()
  }, [inputRef.current, taggedUser])

  return (
    <div className="flex flex-col mt-4">
      {/* Comment content */}
      <div className="flex justify-between text-ani-text-gray">
        <Link href={"/user/" + comment!.username} className="min-w-fit"><Avatar imageUrl={comment!.avatarUrl} altText={comment!.username} size={8} /></Link>
        <div className="rounded-2xl py-2 px-4 ml-2 w-full bg-ani-gray focus:outline-none caret-white">
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

        <div onClick={() => onReply(comment.username)} className="font-bold text-gray-400 hover:cursor-pointer hover:underline">Reply</div>

        <div className="text-gray-400 hover:cursor-pointer hover:underline">{comment!.timestamp}</div>
      </div>

      {/* Replies and reply's form */}
      <div className="ml-10 border-l-2 border-gray-400 pl-4">
        {replies?.map((reply, index) => {
          return (
            <div key={index}>
              <Comment comment={reply} onParentReply={onReply} />
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