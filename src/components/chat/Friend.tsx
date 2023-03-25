'use client'

import { FC, useState } from "react";
import ChatPopup from "./ChatPopup";
import { UserInfo } from '@/components/nav/NavBar';

export type FriendProps = {
    username: string;
    image: string;
    myUserInfo: UserInfo;
};

const Friend: FC<FriendProps> = ({
    username,
    image,
    myUserInfo
}) => {
    const [showChat, setShowChat] = useState(false);

    const openChat = () => {
      setShowChat(true);
    };

    return (
      <div className="relative w-full">
        <div className="flex items-center w-full px-4 py-3 hover:bg-[#4e5d78]" onClick={openChat}>
          <img
            className="rounded-full w-8 h-8 object-cover"
            src={image || '/bocchi.jpg'}
            alt={username}
          />
          <span className="ml-2 font-medium">{username}</span>
        </div>
        {showChat && (
            <ChatPopup myUserInfo={myUserInfo} showChat={showChat} setShowChat={setShowChat} recipient={username} />
            //TODO: close chat with X button inside chat popup
        )}
      </div>
    );
};

export default Friend;