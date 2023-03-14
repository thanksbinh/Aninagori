'use client';

import { FC, useEffect, useRef, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { AiOutlineComment } from "react-icons/ai";
import { RiAddCircleLine } from "react-icons/ri";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { UserInfo } from "../nav/NavBar";
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import Comment from "./Comment";
import Modal from "../utils/Modal";
import PostPopup from "./PostPopup";

interface CommentProps {
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
}

interface Props {
  myUserInfo: UserInfo;
  reactions0: Object[];
  commentCount: number;
  comments: CommentProps[];
  id: string;
};

const PostAction: FC<Props> = ({ myUserInfo, reactions0, commentCount, comments, id }) => {
  const [likeToggle, setLikeToggle] = useState(false)
  const [reactions, setReactions] = useState(reactions0 || [])
  const [commentNum, setCommentNum] = useState(0)
  const [postExpend, setPostExpend] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
    setLikeToggle(reactions0?.some((e: any) => e.username === myUserInfo.username))
  }, [reactions0])

  useEffect(() => {
    setCommentNum(commentCount)
  }, [commentCount])

  const onReaction = () => {
    const postRef = doc(db, "posts", id);
    if (!likeToggle) {
      updateDoc(postRef, {
        reactions: arrayUnion({
          username: myUserInfo.username,
          image: myUserInfo.image,
          type: "heart"
        })
      });
    } else {
      updateDoc(postRef, {
        reactions: arrayRemove({
          username: myUserInfo.username,
          image: myUserInfo.image,
          type: "heart"
        })
      });
    }

    setLikeToggle(!likeToggle)
  }

  const onCommentBtnClick = () => {
    inputRef.current && inputRef.current.focus()
  }

  const onComment = () => {
    setCommentNum(commentNum + 1)
  }

  const onPlanToWatch = () => {
    console.log("Add to Plan to Watch")
  }

  return (
    <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-4 pt-0 rounded-t-none">
      <div className="flex my-4 mx-2">
        {(reactions.length > 2 ? reactions.slice(reactions.length - 3) : reactions.slice(0)).reverse().map((user: any) =>
          <Avatar className='liked-avatar' imageUrl={user.image} altText={user.username} size={5} key={user.username} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-b border-[#212833] py-2 mx-2">
        <div className="flex">
          <button title="react" onClick={onReaction} className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]">
            {likeToggle ? <HiHeart className="w-5 h-5 fill-[#F14141]" /> : <HiOutlineHeart className="w-5 h-5" />}
          </button>
          <span className="text-gray-400 ml-2">{reactions.length}</span>
        </div>

        <div className="flex">
          <button title="comment" onClick={onCommentBtnClick} className="flex items-center space-x-1 text-gray-400 hover:text-[#3BC361]">
            <AiOutlineComment className="w-5 h-5" />
          </button>
          <span className="text-gray-400 ml-2">{commentNum}</span>
        </div>

        <button title="plan to watch" onClick={onPlanToWatch} className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D]">
          <RiAddCircleLine className="w-5 h-5" />
          <span>Plan to Watch</span>
        </button>
      </div>

      {(commentCount > 1 && commentCount > comments.length) &&
        <div>
          <div onClick={() => setPostExpend(true)} className="mt-4 ml-2 text-sm font-bold text-gray-400 hover:cursor-pointer hover:underline">View more comments</div>
          {postExpend &&
            <PostPopup isOpen={postExpend} onClose={() => setPostExpend(false)} myUserInfo={myUserInfo} id={id} />
          }
        </div>
      }

      <Comment
        myUserInfo={myUserInfo}
        comments={comments}
        incCommentCount={onComment}
        inputRef={inputRef}
        id={id}
      />
    </div>
  );
};

export default PostAction;