'use client';

import { FC, useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { AiOutlineComment } from "react-icons/ai";
import { RiAddCircleLine } from "react-icons/ri";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { UserInfo } from "../nav/NavBar";
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";

interface Props {
  myUserInfo: UserInfo
  comments: number;
  reactions0: Object[];
  id: string;
};

const PostAction: FC<Props> = ({ myUserInfo, reactions0, comments, id }) => {
  const [likeToggle, setLikeToggle] = useState(false)
  const [reactions, setReactions] = useState(reactions0 || [])

  useEffect(() => {
    const postRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(postRef, docSnap => {
      setReactions(docSnap?.data()?.reactions || [])
    })

    if (reactions?.some((e: any) => e.username === myUserInfo.username))
      setLikeToggle(true)

    return () => {
      unsubscribe && unsubscribe()
    };
  }, [])

  const onLikeClick = () => {
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

  return (
    <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-4 pt-0 mb-4 rounded-t-none">
      <div className="flex my-4 mx-2">
        {(reactions.length > 2 ? reactions.slice(reactions.length - 3) : reactions.slice(0)).reverse().map((user: any) =>
          <Avatar className = 'liked-avatar' imageUrl={user.image} altText={user.username} size={5} key={user.username} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-b border-[#212833] pb-2 mx-2">
        <div className="flex">
          <button title="react" onClick={onLikeClick} className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]">
            {likeToggle
              ? <HiHeart className="w-5 h-5 fill-[#F14141]" />
              : <HiOutlineHeart className="w-5 h-5" />
            }
          </button>
          <span className="text-gray-400 ml-2">{reactions.length}</span>
        </div>

        <div className="flex">
          <button title="comment" className="flex items-center space-x-1 text-gray-400 hover:text-[#3BC361]">
            <AiOutlineComment className="w-5 h-5" />
          </button>
          <span className="text-gray-400 ml-2">{comments}</span>
        </div>

        <button title="plan to watch" className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D]">
          <RiAddCircleLine className="w-5 h-5" />
          <span>Plan to Watch</span>
        </button>
      </div>

      <div className="flex items-center mt-4 mx-2">
        <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={8} />
        <input
          type="text"
          className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#212833] focus:outline-none caret-white"
          placeholder="Write a comment..."
        />
      </div>
    </div>
  );
};

export default PostAction;