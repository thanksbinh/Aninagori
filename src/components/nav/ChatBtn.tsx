'use client'

import React, { useEffect, useRef, useState } from "react";
import { UserInfo } from "@/global/UserInfo.types";
import { BsChatDotsFill } from "@react-icons/all-files/bs/BsChatDotsFill";
import ChatNotiContainer from "../chat/ChatNotiContainer";
import ChatPopup from "../chat/ChatPopup";
import { setLastReadInbox } from "../chat/setLastRead";

const ChatBtn = ({ myUserInfo }: { myUserInfo: UserInfo | undefined }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showChatBtn, setShowChatBtn] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  const [currentChat, setCurrentChat] = useState({
    username: "",
    image: ""
  });
  const [showChat, setShowChat] = useState(false)

  const openChat = () => {
    setShowChat(true);
  };

  // click outside to close popup
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
    if (myUserInfo !== undefined) {
      setLastReadInbox(myUserInfo);
    }
  };

  return (
    <div ref={ref} className="relative inline-block h-full">
      <button title="notification" onClick={toggleChatBtn} className="p-3 text-[#fff] bg-[#798597] hover:bg-[#94B0DD] rounded-full font-medium focus:outline-none">
        <BsChatDotsFill className="w-4 h-4" />
        {unreadChats > 0 && (
          <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadChats}
          </span>
        )}
      </button>
      {myUserInfo?.username &&
        <>
          <div className={showChatBtn ? "" : "hidden"}>
            <ChatNotiContainer
              myUserInfo={myUserInfo}
              showChatBtn={showChatBtn}
              toggleChatBtn={toggleChatBtn}
              setUnreadChats={setUnreadChats}
              setCurrentChat={setCurrentChat}
              openChat={openChat}
            />
          </div>
          {showChat && (
            <ChatPopup myUserInfo={myUserInfo} setShowChat={setShowChat} recipient={currentChat.username} image={currentChat.image} />
          )}
        </>
      }
    </div>
  );
};

export default ChatBtn;
