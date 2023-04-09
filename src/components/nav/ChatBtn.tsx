'use client'

import React, { useEffect, useRef, useState } from "react";
import { UserInfo } from "@/global/UserInfo.types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { BsChatDotsFill } from "@react-icons/all-files/bs/BsChatDotsFill";
import { getFriendList } from "@/app/(home)/components/functions/fetchData";
import ChatNotiContainer from "../chat/ChatNotiContainer";

export const NotiContext = React.createContext<any>({});

const ChatBtn = ({ myUserInfo }: { myUserInfo: UserInfo }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showChatBtn, setShowChatBtn] = useState(false);
  const [unreadMessage, setUnreadMessage] = useState(8);
  // const myFriendList = await getFriendList(myUserInfo);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowChatBtn(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleChatBtn = () => {
    setShowChatBtn(!showChatBtn);
  };

  //   useEffect(() => {
  //     async function getConversations() {
  //         const conversationRef = collection(db, "conversation");
  //         if (myUserInfo?.username !== undefined) {
  //             const conversationQuery = query(
  //                 conversationRef, 
  //                 where(myUserInfo?.username, "in", ["username1", "username2"])
  //             )
  //             const querySnapshot = await getDocs(conversationQuery);

  //             const conversation = [];
  //             querySnapshot.forEach(doc => {
  //                 conversation.push(doc.data());
  //             })
  //         }
  //     }
  //   }, [])

  return (
    <div ref={ref} className="relative inline-block h-full">
      <button title="notification" onClick={toggleChatBtn} className="p-3 text-[#fff] bg-[#798597] hover:bg-[#94B0DD] rounded-full font-medium focus:outline-none">
        <BsChatDotsFill className="w-4 h-4" />
        {unreadMessage > 0 && (
          <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadMessage}
          </span>
        )}
      </button>
      <div className={showChatBtn ? "" : "hidden"}>
        <ChatNotiContainer myUserInfo={myUserInfo} showChatBtn={showChatBtn} />
      </div>
    </div>
  );
};

export default ChatBtn;
