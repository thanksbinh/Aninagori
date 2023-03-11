'use client';

import { FC, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { AiOutlineComment } from "react-icons/ai";
import { RiAddCircleLine } from "react-icons/ri";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";

type PostProps = {
  authorName: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  imageUrl: string | null;
  likes: number;
  comments: number;
  id: string;
};

const Post: FC<PostProps> = ({
  authorName,
  avatarUrl,
  timestamp,
  content,
  imageUrl,
  likes,
  comments,
}) => {
  const [likeToggle, setLikeToggle] = useState(false);

  return (
    <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-4 mb-4">
      <div className="flex items-center space-x-4 mx-2">
        <Avatar imageUrl={avatarUrl} altText={authorName} size={10} />
        <div>
          <p className="font-bold text-[#dddede]">{authorName}</p>
          <p className="text-gray-500 text-sm">{timestamp}</p>
        </div>
      </div>

      <p className="text-lg mt-4 mb-2 text-[#dddede] mx-2">{content}</p>
      {imageUrl && (
        <div className="mt-4 mx-2">
          <img src={imageUrl} alt={""} className="rounded-2xl" />
        </div>
      )}

      <div className="flex item-center justify-between my-4"></div>

      <div className="flex items-center justify-between border-t border-b border-[#212833] py-2 mt-4 mx-2">
        <div className="flex">
          <button className="flex items-center space-x-1 text-gray-400 hover:text-[#F14141]">
            {likeToggle
              ? <HiHeart className="w-5 h-5 fill-[#F14141]" onClick={() => setLikeToggle(false)} />
              : <HiOutlineHeart className="w-5 h-5" onClick={() => setLikeToggle(true)} />
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
        <Avatar imageUrl={avatarUrl} altText={authorName} size={8} />
        <input
          type="text"
          className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#212833] focus:outline-none caret-white"
          placeholder="Write a comment..."
        />
      </div>
    </div>
  );
};

export default Post;
export type { PostProps };