'use client';

import { FC, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { AiOutlineComment } from "react-icons/ai";
import { RiAddCircleLine } from "react-icons/ri";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { UserInfo } from "../nav/NavBar";

interface Props {
  myUserInfo: UserInfo
  likes: number;
  comments: number;
};

const PostAction: FC<Props> = ({ myUserInfo, likes, comments }) => {
  const [likeToggle, setLikeToggle] = useState(false);

  const onLikeClick = () => {
    setLikeToggle(!likeToggle)
  }

  return (
    <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-4 pt-0 mb-4 rounded-t-none">
      <div className="flex items-center justify-between border-t border-b border-[#212833] py-2 mt-4 mx-2">
        <div className="flex">
          <button onClick={onLikeClick} className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]">
            {likeToggle
              ? <HiHeart className="w-5 h-5 fill-[#F14141]" />
              : <HiOutlineHeart className="w-5 h-5" />
            }
          </button>
          <span className="text-gray-400 ml-2">{likes}</span>
        </div>

        <div className="flex">
          <button className="flex items-center space-x-1 text-gray-400 hover:text-[#3BC361]">
            <AiOutlineComment className="w-5 h-5" />
          </button>
          <span className="text-gray-400 ml-2">{comments}</span>
        </div>

        <button className="flex items-center space-x-1 text-gray-400 hover:text-[#E5DE3D]">
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