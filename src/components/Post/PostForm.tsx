import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import Image from "next/image";
import { HiOutlinePhoto, HiOutlineVideoCamera } from "react-icons/hi2";

type PostFormProps = {
  authorName: string;
  avatarUrl: string;
  time: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
};

const PostForm: FC<PostFormProps> = ({
  authorName,
  avatarUrl,
  time,
  content,
  imageUrl,
  likes,
  comments,
}) => {
  return (
    <div className="flex flex-col flex-1 bg-[#191c21] border rounded-2xl p-4 my-4">
      <div className="flex justify-between items-center mt-4">
        <Avatar imageUrl={avatarUrl} altText={authorName} size={8} />
        <input
          type="text"
          className="flex border rounded-lg py-2 px-4 mx-2 w-full"
          placeholder="Share your favourite Animemory now!"
        />
      </div>

      <div className="flex items-center justify-between py-2 mt-4 mx-2">
        <button className="flex items-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg">
          <HiOutlinePhoto className="w-5 h-5" />
          <span>Photo/Gif</span>
        </button>
        <button className="flex items-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg">
          <HiOutlineVideoCamera className="w-5 h-5" />
          <span>Video</span>
        </button>
        <div className="flex bg-[#377dff] rounded-lg hover:bg-[#2963cd]">
          <button className="flex items-center space-x-1 text-white py-2 px-4">
            <span>Share</span>
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default PostForm;