'use client'

import { FC, useState } from "react";
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
  const [likeToggle, setLikeToggle] = useState(false);

  return (
    <div className={`flex items-start mt-1 px-4 ${senderUsername === myUserInfo.username ? "flex-row-reverse" : "flex-row"}`}>
      {(isFirstMessage && !isLastMessage) ? (
        <div className={`${senderUsername === myUserInfo.username ? "flex-row-reverse bg-[#377dff] rounded-t-2xl rounded-bl-2xl rounded-br text-white mr-2" : "flex-row bg-[#fff] rounded-t-2xl rounded-br-2xl rounded-bl text-black ml-2"} mt-4 break-words max-w-[60%] flex item-start py-1 px-3 focus:outline-none basis-auto shrink grow-0`}>
          {content}
        </div>
      ) : (
        <>
          {(isLastMessage && !isFirstMessage) ? (
            <div className={`${senderUsername === myUserInfo.username ? "flex-row-reverse bg-[#377dff] rounded-b-2xl rounded-tl-2xl rounded-tr text-white mr-2" : "flex-row bg-[#fff] rounded-b-2xl rounded-tr-2xl rounded-tl text-black ml-2"} break-words max-w-[60%] flex py-1 px-3 focus:outline-none basis-auto shrink grow-0`}>
              {content}
            </div>
          ) : (
            <>
              {(isLastMessage && isFirstMessage) ? (
                <div className={`${senderUsername === myUserInfo.username ? "flex-row-reverse items-end bg-[#377dff] text-white mr-2" : "flex-row bg-[#fff] text-black ml-2"} break-words max-w-[60%] flex py-1 px-3 focus:outline-none basis-auto shrink grow-0 rounded-2xl`}>
                  {content}
                </div>
              ) : (
                <div className={`${senderUsername === myUserInfo.username ? "flex-row-reverse items-end bg-[#377dff] rounded-l-2xl rounded-r text-white mr-2" : "flex-row bg-[#fff] rounded-r-2xl rounded-l text-black ml-2"} break-words max-w-[60%] flex py-1 px-3 focus:outline-none basis-auto shrink grow-0`}>
                  {content}
                </div>
              )}
            </>
          )}
        </>
      )}
      <div className="flex flex-auto max-w-none"></div>
    </div>


    // <>
    //   {(senderUsername === myUserInfo.username)
    //     ? (
    //       <div className="flex flex-row-reverse items-start mt-1 px-4">
    //         {(isFirstMessage) ? (
    //           <div className="mt-4 word-break: break-all max-w-[60%] flex flex-row-reverse rounded-t-2xl rounded-bl-2xl rounded-br py-1 px-3 mr-2 bg-[#377dff] focus:outline-none text-white basis-auto shrink grow-0">
    //             {content}
    //           </div>
    //         ) : (
    //           <>
    //             {isLastMessage ? (
    //               <div className="word-break: break-all max-w-[60%] flex flex-row-reverse rounded-b-2xl rounded-tl-2xl rounded-tr py-1 px-3 mr-2 bg-[#377dff] focus:outline-none text-white basis-auto shrink grow-0">
    //                 {content}
    //               </div>
    //             ) : (
    //               <div className="word-break: break-all max-w-[60%] flex flex-row-reverse rounded-l-2xl rounded-r py-1 px-3 mr-2 bg-[#377dff] focus:outline-none text-white basis-auto shrink grow-0">
    //                 {content}
    //               </div>
    //             )}
    //           </>
    //         )}
    //         <div className="flex flex-auto max-w-none"></div>
    //       </div>
    //     )
    //     : (
    //       <div className="flex flex-row items-start mt-1 px-4">
    //         {isLastMessage
    //           ? (<Avatar imageUrl={avatarUrl} altText={senderUsername} size={8} />)
    //           : (<div className="w-8"></div>)
    //         }
    //         {isFirstMessage ? (
    //           <div className="ml-2 mt-4 word-break: break-all max-w-[60%] flex flex-row rounded-t-2xl rounded-br-2xl rounded-bl py-1 px-3 mr-2 bg-[#fff] focus:outline-none text-black basis-auto shrink grow-0">
    //             {content}
    //           </div>
    //         ) : (
    //           <>
    //             {isLastMessage ? (
    //               <div className="ml-2 word-break: break-all max-w-[60%] flex flex-row rounded-b-2xl rounded-tr-2xl rounded-tl py-1 px-3 mr-2 bg-[#fff] focus:outline-none text-black basis-auto shrink grow-0">
    //                 {content}
    //               </div>
    //             ) : (
    //               <div className="ml-2 word-break: break-all max-w-[60%] flex flex-row rounded-r-2xl rounded-l py-1 px-3 mr-2 bg-[#fff] focus:outline-none text-black basis-auto shrink grow-0">
    //                 {content}
    //               </div>
    //             )}
    //           </>
    //         )}
    //         <div className="flex flex-auto max-w-none"></div>
    //       </div>
    //     )
    //   }
    // </>
  );
};

export default Message;
export type { MessageProps };