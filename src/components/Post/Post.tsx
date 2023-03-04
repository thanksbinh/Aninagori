import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import Image from "next/image";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import { RiAddCircleLine } from "react-icons/ri";
import { HiOutlineHeart } from "react-icons/hi2"

type PostProps = {
  authorName: string;
  avatarUrl: string;
  time: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
};

const Post: FC<PostProps> = ({
  authorName,
  avatarUrl,
  time,
  content,
  imageUrl,
  likes,
  comments,
}) => {
  return (
    <div className="flex flex-col flex-1 bg-[#191c21] border rounded-2xl p-4 mb-4">
      <div className="flex items-center space-x-4 mx-2">
        <Avatar imageUrl={avatarUrl} altText={authorName} size={12} />
        <div>
          <p className="font-bold text-[#dddede]">{authorName}</p>
          <p className="text-gray-500 text-sm">{time}</p>
        </div>
      </div>

      <p className="text-lg mt-4 mb-2 text-[#dddede] mx-2">{content}</p>
      {imageUrl && (
        <div className="mt-4 mx-2">
          <Image src={imageUrl} width={640} height={360} alt={""} className="rounded-2xl"/>
        </div>
      )}

      <div className="flex item-center justify-between my-4"></div>

      <div className="flex items-center justify-between border-t border-b border-[#212833] py-2 mt-4 mx-2">
        <div className="flex">
          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-600">
            <HiOutlineHeart className="w-5 h-5" />
            <span>{likes}</span>
          </button>
        </div>
        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-600">
          <AiOutlineComment className="w-5 h-5" />
          <span>{comments}</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-600">
          <RiAddCircleLine className="w-5 h-5" />
          <span>Plan to Watch</span>
        </button>
      </div>
      
      <div className="flex items-center mt-4 mx-2">
        <Avatar imageUrl={avatarUrl} altText={authorName} size={8} />
        <input
          type="text"
          className="border rounded-2xl py-2 px-4 ml-2 w-full"
          placeholder="Write a comment..."
        />
      </div>
    </div>
  );
};

export default Post;