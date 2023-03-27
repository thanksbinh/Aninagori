'use client'

import { FC, useState } from "react";
import Avatar from "../avatar/Avatar";
import { UserInfo } from "../nav/NavBar";

type MessageProps = {
  senderUsername: string;
  receiverUsername: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  likes: number;
  id?: string;
  myUserInfo: UserInfo;
  isFirstMessage: boolean;
};

const Message: FC<MessageProps> = ({
  senderUsername,
  receiverUsername,
  avatarUrl,
  timestamp,
  content,
  likes,
  id,
  myUserInfo,
  isFirstMessage
}) => {
  const [likeToggle, setLikeToggle] = useState(false);

  return (
      <>
      {(senderUsername === myUserInfo.username)
      ? (
          <div className="flex flex-row-reverse items-start mt-4 px-4">
            {isFirstMessage 
            ? (<Avatar imageUrl={avatarUrl} altText={senderUsername} size={8} />)
            : (<div className="w-8"></div>)
            }
            <div className="word-break: break-all max-w-[60%] flex flex-row-reverse rounded-2xl py-1 px-3 mr-2 bg-[#377dff] focus:outline-none text-white basis-auto shrink grow-0">
              {content}
            </div>
            <div className="flex flex-auto max-w-none"></div>
          </div>
        )
      : (
          <div className="flex flex-row items-start mt-4 px-4">
            {isFirstMessage 
            ? (<Avatar imageUrl={avatarUrl} altText={senderUsername} size={8} />)
            : (<div className="w-8"></div>)
            }          
            <div className="word-break: break-all max-w-[60%] flex flex-row rounded-2xl py-1 px-3 ml-2 bg-[#fff] focus:outline-none text-black basis-auto shrink grow-0">
              {content}
            </div>
            <div className="flex flex-auto max-w-none"></div>
          </div>
        )
      }
      </>
  );
};

export default Message;
export type { MessageProps };