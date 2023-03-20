'use client'

import { ChatContext } from "./context/ChatContext";
import { useContext } from 'react';
import Avatar from "../avatar/Avatar";
import Messages from "./Messages";
import MessageForm from "./MessageForm";

export default function ChatPopup(){
    const { myUserInfo, conversationId } = useContext(ChatContext);

    return (
        <div className="flex flex-col flex-1 bg-[#191c21] mt-8 rounded-2xl">
            <div className="flex flex-start p-2 bg-[#4e5d78] rounded-t-2xl">
                <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={10} />
                <div className="flex flex-col pl-6">
                    <p>Conversation name</p>
                    <p>Active now</p>   
                </div>
            </div>
            <Messages />
            <MessageForm inputRef={undefined} />
        </div> 
    );
}