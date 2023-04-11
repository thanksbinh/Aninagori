'use client'

import { formatDuration } from "@/components/utils/format";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { UserInfo } from "../../global/UserInfo.types";
import ChatPopup from "./ChatPopup";

interface Props {
    myUserInfo: UserInfo;
    name: string;
    image: string;
    lastMessage: string;
    timestamp: Timestamp;
    friend: string;
    read: boolean;
}

const ChatNoti: React.FC<Props> = ({ myUserInfo, name, image, lastMessage, timestamp, friend, read }) => {
    const [showChat, setShowChat] = useState(false)

    const openChat = () => {
        setShowChat(true);
    };

    return (
        <>
            <div className="flex items-center bg-ani-gray rounded-lg mx-2 px-3 py-4 hover:cursor-pointer hover:bg-slate-50/25" onClick={openChat}>
                <img
                    src={image || '/bocchi.jpg'}
                    alt={'avatar'}
                    className="h-10 w-10 rounded-full mr-4"
                />
                <div>
                    <p className={`text-sm font-medium ${read ? "text-[#a5a5a5]" : "text-white"}`}>
                        {name + ": " + lastMessage}
                    </p>
                    <p className={`text-xs ${read ? "text-[#a5a5a5]" : "text-[#377dff]"}`}>
                        {formatDuration(new Date().getTime() - timestamp.toDate().getTime())}
                    </p>
                </div>
            </div>
            {/* {showChat && (
                <ChatPopup showChat={showChat} setShowChat={setShowChat} recipient={friend} image={image} />
            )} */}
        </>
    );
};

export default ChatNoti;