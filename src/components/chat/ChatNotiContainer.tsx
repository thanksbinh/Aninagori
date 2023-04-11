'use client'

import { useEffect, useState } from "react";
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import { UserInfo } from "../../global/UserInfo.types";
import ChatNoti from "./ChatNoti";
import { db } from "@/firebase/firebase-app";
import { Timestamp, doc, collection, onSnapshot } from "firebase/firestore";

interface Props {
    myUserInfo: UserInfo
    showChatBtn: boolean
}

interface recentChat {
    id: string;
    lastMessage: {
        content: string;
        read: boolean;
        senderUsername: string;
        timestamp: Timestamp;
    }
    sender: {
        username: string;
        image: string;
    }
}

const ChatNotiContainer: React.FC<Props> = ({ myUserInfo, showChatBtn }) => {
    const [recentChats, setRecentChats] = useState<recentChat[]>([])

    // fetch conversations data
    useEffect(() => {
        async function getInbox() {
            const inboxRef = doc(collection(db, "inbox"), myUserInfo.username);

            const unsubscribe = onSnapshot(inboxRef, (docSnap) => {
                if (docSnap.exists() && docSnap.data()?.hasOwnProperty("recentChats")) {
                    const fetchedChat: recentChat[] = docSnap?.data()?.recentChats.map((obj: recentChat) => ({
                        id: obj.id,
                        lastMessage: obj.lastMessage,
                        sender: obj.sender
                    }));

                    setRecentChats(fetchedChat);
                }
            })

            return () => {
                unsubscribe && unsubscribe()
            };
        }
        getInbox();
    }, [])

    return (
        <>
            {showChatBtn && (
                <div className="absolute right-0 h-[23rem] w-80 top-12 z-40 bg-[#212733] rounded-md shadow-lg">
                    <div className="flex justify-between items-center px-4 py-2">
                        <h2 className="text-white font-semibold text-xl pt-4">Messages</h2>
                        <div className="hover:cursor-pointer rounded-full p-2"><BsThreeDots className="h-5 w-5" aria-hidden="true" /></div>
                    </div>
                    <div className="h-full bg-[#212733] rounded-md pb-2">
                        <div className="h-full overflow-y-auto bg-[#212733] rounded-md">
                            {recentChats.map((recentChat) => (
                                <ChatNoti
                                    key={recentChat.id}
                                    myUserInfo={myUserInfo}
                                    conversationId={recentChat.id}
                                    name={recentChat.lastMessage.senderUsername}
                                    image={recentChat.sender.image}
                                    lastMessage={recentChat.lastMessage.content}
                                    timestamp={recentChat.lastMessage.timestamp}
                                    friend={recentChat.sender.username}
                                    read={recentChat.lastMessage.read}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatNotiContainer