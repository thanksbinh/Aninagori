import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useEffect, useContext, useState } from "react";
import { db } from "@/firebase/firebase-app";
import Avatar from "../../Avatar/Avatar";
import { PostContext } from "../context/PostContex";

export interface CommentProps {
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  reactions?: any[];
  id: string;
}

const Comment = ({ comment }: { comment: CommentProps }) => {
  const { myUserInfo, postId } = useContext(PostContext)

  const [reactionToggle, setReactionToggle] = useState(false)
  const [reactions, setReactions] = useState(comment.reactions || [])

  useEffect(() => {
    if (!comment.reactions) return

    setReactionToggle(comment.reactions.some((e: any) => e.username === myUserInfo.username))
    setReactions(comment.reactions)
  }, [comment.reactions])

  const onReaction = () => {
    const postRef = doc(db, "posts", postId, "comments", comment.id);
    const myReaction = {
      username: myUserInfo.username,
      type: "heart"
    }

    if (!reactionToggle) {
      setReactions([...reactions, myReaction])
      updateDoc(postRef, {
        reactions: arrayUnion(myReaction)
      });
    } else {
      setReactions(reactions.filter(reaction => reaction.username !== myUserInfo.username))
      updateDoc(postRef, {
        reactions: arrayRemove(myReaction)
      });
    }

    setReactionToggle(!reactionToggle)
  }

  return (
    <div>
      <div className="flex">
        <Avatar imageUrl={comment!.avatarUrl} altText={comment!.username} size={8} />
        <div className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#212833] focus:outline-none caret-white">
          <div className="text-sm font-bold"> {comment!.username} </div>
          {comment!.content}
        </div>
      </div>
      <div className="flex gap-2 ml-14 mt-1 text-xs font-bold text-gray-400">
        <div>
          <span onClick={onReaction} className={`hover:cursor-pointer hover:underline ${reactionToggle && "text-[#F14141]"}`}>Like</span>
          <span> +{reactions.length}</span>
        </div>

        <div className="font-bold text-gray-400 hover:cursor-pointer hover:underline">Reply</div>

        <div className="text-gray-400 hover:cursor-pointer hover:underline">{comment!.timestamp}</div>
      </div>
    </div>
  )
}

export default Comment;