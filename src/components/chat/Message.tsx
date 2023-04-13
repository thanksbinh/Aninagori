'use client'

import { FC } from "react";
import Avatar from "../avatar/Avatar";
import { UserInfo } from "@/global/UserInfo.types";

type MessageProps = {
  senderUsername: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  likes: number;
  id?: string;
  myUserInfo: UserInfo;
  isFirstMessage: boolean;
  isLastMessage: boolean;
};

const Message: FC<MessageProps> = ({
  senderUsername,
  avatarUrl,
  timestamp,
  content,
  likes,
  id,
  myUserInfo,
  isFirstMessage,
  isLastMessage,
}) => {

  return (
    <div className={`flex items-start mt-1 px-4 ${senderUsername === myUserInfo.username ? "flex-row-reverse" : "flex-row"}`}>
      {(senderUsername !== myUserInfo.username) &&
        <>
          {(isLastMessage)
            ? (
              <div className={`flex flex-col-reverse item-start ${isFirstMessage && "mt-4"}`}>
                <Avatar imageUrl={avatarUrl} altText={senderUsername} size={8} />
              </div>
            )
            : (<div className="w-8"></div>)
          }
        </>
      }
      {(isFirstMessage && !isLastMessage) ? (
        <div className={`${senderUsername === myUserInfo.username ? "flex-row-reverse bg-[#377dff] rounded-t-2xl rounded-bl-2xl rounded-br text-white" : "flex-row bg-[#fff] rounded-t-2xl rounded-br-2xl rounded-bl text-black ml-2"} mt-4 max-w-[60%] flex item-start py-1 px-3 focus:outline-none basis-auto shrink grow-0`}>
          <div className="max-w-[100%] break-words">
            {content}
          </div>
        </div>
      ) : (
        <>
          {(isLastMessage && !isFirstMessage) ? (
            <>
              <div className={`${senderUsername === myUserInfo.username ? "flex-row-reverse bg-[#377dff] rounded-b-2xl rounded-tl-2xl rounded-tr text-white" : "flex-row bg-[#fff] rounded-b-2xl rounded-tr-2xl rounded-tl text-black ml-2"} max-w-[60%] flex py-1 px-3 focus:outline-none basis-auto shrink grow-0`}>
                <div className="max-w-[100%] break-words">
                  {content}
                </div>
              </div>
            </>
          ) : (
            <>
              {(isLastMessage && isFirstMessage) ? (
                <div className={`${senderUsername === myUserInfo.username ? "flex-row-reverse items-end bg-[#377dff] text-white" : "flex-row bg-[#fff] text-black ml-2"} max-w-[60%] flex py-1 px-3 mt-4 focus:outline-none basis-auto shrink grow-0 rounded-2xl`}>
                  <div className="max-w-[100%] break-words">
                    {content}
                  </div>
                </div>
              ) : (
                <div className={`${senderUsername === myUserInfo.username ? "flex-row-reverse items-end bg-[#377dff] rounded-l-2xl rounded-r text-white" : "flex-row bg-[#fff] rounded-r-2xl rounded-l text-black ml-2"} max-w-[60%] flex py-1 px-3 focus:outline-none basis-auto shrink grow-0`}>
                  <div className="max-w-[100%] break-words">
                    {content}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      <div className="flex flex-auto max-w-none"></div>
    </div>
  );
};

export default Message;
export type { MessageProps };