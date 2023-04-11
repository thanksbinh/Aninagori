'use client'

import { formatDuration } from "@/components/utils/format";
import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, collection, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { UserInfo } from "../../global/UserInfo.types";
import ChatPopup from "./ChatPopup";

interface Props {
    myUserInfo: UserInfo;
    conversationId: string;
    name: string;
    image: string;
    lastMessage: string;
    timestamp: Timestamp;
    friend: string;
    read: boolean;
}

const ChatNoti: React.FC<Props> = ({ myUserInfo, conversationId, name, image, lastMessage, timestamp, friend, read }) => {
    const [showChat, setShowChat] = useState(false)

    const findOldLastMessage = async () => {
        const inboxRef = doc(collection(db, 'inbox'), myUserInfo.username);
        const inboxDoc = await getDoc(inboxRef);

        if (inboxDoc.exists() && inboxDoc.data()?.hasOwnProperty("recentChats")) {
            const message = inboxDoc.data()?.recentChats.find((e: any) => e.id === conversationId);
            if (message) { return message }
        }
        else return null;
    }

    const setLastMessage = async (lastMessage: any) => {
        const inboxRef = doc(collection(db, 'inbox'), myUserInfo.username);
        const oldLastMessage = await findOldLastMessage();
        if (oldLastMessage) {
            await updateDoc(inboxRef, {
                recentChats: arrayRemove(oldLastMessage)
            });
        }

        await updateDoc(inboxRef, {
            recentChats: arrayUnion(lastMessage)
        });
    }

    const updateStatus = async () => {
        await setLastMessage(
            {
                id: conversationId,
                lastMessage: {
                    content: lastMessage,
                    read: true,
                    senderUsername: myUserInfo.username,
                    timestamp: timestamp
                },
                sender: {
                    username: friend,
                    image: image
                }
            }
        );
    }

    const onClick = () => {
        updateStatus();
    }

    const openChat = () => {
        setShowChat(true);
    };

    return (
        <>
            <div className="flex items-center bg-ani-gray rounded-lg mx-2 px-3 py-4 hover:cursor-pointer hover:bg-slate-50/25" onClick={onClick}>
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