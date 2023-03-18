'use client'

import { FC, useState } from "react";
import Avatar from "../avatar/Avatar";

type MessageProps = {
  senderUsername: string;
  receiverUsername: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  likes: number;
  id?: string;
};

const Message: FC<MessageProps> = ({
  senderUsername,
  receiverUsername,
  avatarUrl,
  timestamp,
  content,
  likes,
}) => {
  const [likeToggle, setLikeToggle] = useState(false);


  return (
    <div className="flex flex-col mt-4 w-2/5">
      <div className="flex gap-2 ml-12 my-2 text-xs font-bold text-gray-400"> {senderUsername} </div>
      {/* Message content */}
      <div className="flex flex-row items-center">
        <Avatar imageUrl={avatarUrl} altText={senderUsername} size={10} />
        <div className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#fff] focus:outline-none text-black">
          {content}
        </div>
      </div>

      {/* Message actions */}
      <div className="flex justify-between gap-2 ml-12 mt-2 text-xs font-bold text-gray-400">
        {/* <div className="text-gray-400 hover:cursor-pointer hover:underline">{timestamp}</div> */}
        <div className="">
          <span className=''>Like</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
export type { MessageProps };