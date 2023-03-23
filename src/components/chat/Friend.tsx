'use client'

import { FC, useState } from "react";
import ChatPopup from "./ChatPopup";
import { UserInfo } from '@/components/nav/NavBar';

type FriendProps = {
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

    const closeChat = () => {
      setShowChat(false);
    };


    return (
      <div key={username} className="relative w-full md:w-1/3 lg:w-1/4 mb-4">
        <div className="flex items-center w-full px-4" onClick={openChat}>
          <img
            className="rounded-full w-8 h-8 object-cover"
            src={image || '/bocchi.jpg'}
            alt={username}
          />
          <span className="ml-2 font-medium">{username}</span>
        </div>
        <button className="flex flex-1 justify-center items-center p-4 bg-blue-500" onClick={closeChat}>X</button>
        {showChat && (
            <ChatPopup myUserInfo={myUserInfo} onClose={!showChat}/>
            //TODO: close chat with X button inside chat popup
        )}
      </div>
    );
};

export default Friend;