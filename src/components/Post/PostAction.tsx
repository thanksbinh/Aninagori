'use client';

import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FC, useEffect, useRef, useState } from "react";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { AiOutlineComment } from "react-icons/ai";
import { RiAddCircleLine } from "react-icons/ri";

import Avatar from "../Avatar/Avatar";
import { UserInfo } from "../nav/NavBar";
import { db } from "@/firebase/firebase-app";
import Comments from "./comment/Comments";
import PostPopup from "./PostPopup";
import { PostContext } from "./context/PostContex";
import { CommentProps } from "./comment/Comment";

interface PostDynamicProps {
  myUserInfo: UserInfo;
  reactions0: Object[];
  commentCount: number;
  comments: CommentProps[];
  id: string;
};

const PostAction: FC<PostDynamicProps> = ({ myUserInfo, reactions0, commentCount, comments, id }) => {
  const [reactionToggle, setReactionToggle] = useState(false)
  const [reactions, setReactions] = useState(reactions0 || [])
  const [commentNum, setCommentNum] = useState(0)
  const [postExpand, setPostExpand] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update post's reaction realtime
  useEffect(() => {
    const postRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(postRef, docSnap => {
      setReactions(docSnap?.data()?.reactions || [])
    })

    return () => {
      unsubscribe && unsubscribe()
    };
  }, [])

  useEffect(() => {
    setReactionToggle(reactions0?.some((e: any) => e.username === myUserInfo.username))
  }, [reactions0])

  useEffect(() => {
    setCommentNum(commentCount)
  }, [commentCount])

  const onReaction = () => {
    const postRef = doc(db, "posts", id)
    const myReaction = {
      username: myUserInfo.username,
      image: myUserInfo.image,
      type: "heart"
    }

    if (!reactionToggle) {
      updateDoc(postRef, {
        reactions: arrayUnion(myReaction)
      });
    } else {
      updateDoc(postRef, {
        reactions: arrayRemove(myReaction)
      });
    }

    setReactionToggle(!reactionToggle)
  }

  const onComment = () => {
    inputRef.current && inputRef.current.focus()
  }

  const onPlanToWatch = () => {
    console.log("Add to Plan to Watch")
  }

  return (
    <PostContext.Provider value={{ myUserInfo, postId: id }}>
      <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-4 pt-0 rounded-t-none">
        {/* Recent reactions */}
        <div className="flex my-4 mx-2">
          {(reactions.length > 2 ? reactions.slice(reactions.length - 3) : reactions.slice(0)).reverse().map((user: any) =>
            <Avatar className='liked-avatar' imageUrl={user.image} altText={user.username} size={5} key={user.username} />
          )}
        </div>

        {/* 3 post actions */}
        <div className="flex items-center justify-between border-t border-b border-[#212833] py-2 mx-2">
          <div className="flex">
            <button title="react" onClick={onReaction} className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]">
              {reactionToggle ? <HiHeart className="w-5 h-5 fill-[#F14141]" /> : <HiOutlineHeart className="w-5 h-5" />}
            </button>
            <span className="text-gray-400 ml-2">{reactions.length}</span>
          </div>

          <div className="flex">
            <button title="comment" onClick={onComment} className="flex items-center space-x-1 text-gray-400 hover:text-[#3BC361]">
              <AiOutlineComment className="w-5 h-5" />
            </button>
            <span className="text-gray-400 ml-2">{commentNum}</span>
          </div>

          <button title="plan to watch" onClick={onPlanToWatch} className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D]">
            <RiAddCircleLine className="w-5 h-5" />
            <span>Plan to Watch</span>
          </button>
        </div>

        {/* Expand post if comments > 1 */}
        {(commentCount > 1 && commentCount > comments.length) &&
          <div>
            <div onClick={() => setPostExpand(true)} className="mt-4 ml-2 text-sm font-bold text-gray-400 hover:cursor-pointer hover:underline">View more comments</div>
            {postExpand &&
              <PostPopup isOpen={postExpand} onClose={() => setPostExpand(false)} />
            }
          </div>
        }

        {/* Comments and comment's form */}
        <Comments
          comments={comments}
          incCommentCount={() => setCommentNum(commentNum + 1)}
          inputRef={inputRef}
        />
      </div>
    </PostContext.Provider >
  );
};

export default PostAction;