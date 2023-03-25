'use client'

import Avatar from "../avatar/Avatar";
import Messages from "./Messages";
import MessageForm from "./MessageForm";
import { UserInfo } from "../nav/NavBar";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";

interface ChatPopupProps {
    myUserInfo: UserInfo
    showChat: boolean
    setShowChat: Dispatch<SetStateAction<boolean>>
    recipient: string
}

const ChatPopup: React.FC<ChatPopupProps> = ({myUserInfo, showChat, setShowChat, recipient}) => {
    const [conversationId, setConversationId] = useState("");

    useEffect(() => {
        async function getConversationId() {
            const conversationRef = collection(db, 'conversation');
            const messagesQuery = query(
              conversationRef,
              where('username1', 'in', [myUserInfo.username, recipient]),
              where('username2', 'in', [myUserInfo.username, recipient])
            );
            const messageId = (await getDocs(messagesQuery)).docs[0].id;
            setConversationId(messageId);
        }    

        getConversationId();
    }, []);


    const closeChat = () => {
        setShowChat(false);
    }

    return (
        <>
        {showChat && (
            <div className="fixed right-80 bottom-0 w-96 h-2/3 flex flex-col bg-[#191c21] mt-8 rounded-t-2xl">
                <div className="flex p-2 bg-[#4e5d78] rounded-t-2xl">
                    <Avatar imageUrl={myUserInfo.image} altText={myUserInfo.username} size={10} />
                    <div className="flex flex-1 flex-col pl-6">
                        <p>Conversation name</p>
                        <p>Active now</p>   
                    </div>
                    <div className="flex justify-center items-start">
                        <div className="p-2 rounded-full hover:bg-[#212833]">
                            <IoCloseOutline onClick={closeChat}/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 overflow-y-auto">
                    <Messages myUserInfo={myUserInfo} friend={recipient}/>
                </div>
                <MessageForm conversationId={conversationId} myUserInfo={myUserInfo} />
            </div> 
        )}
        </>
    );
}

export default ChatPopup;