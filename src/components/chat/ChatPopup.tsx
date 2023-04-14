'use client'

import Avatar from "../avatar/Avatar";
import Messages from "./Messages";
import MessageForm from "./MessageForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";

interface ChatPopupProps {
    myUserInfo: UserInfo;
    showChat: boolean,
    setShowChat: Dispatch<SetStateAction<boolean>>,
    recipient: string,
    image: string
}

const ChatPopup: React.FC<ChatPopupProps> = ({ myUserInfo, showChat, setShowChat, recipient, image }) => {
    const [conversationId, setConversationId] = useState("");

    useEffect(() => {
        async function checkInbox(username: string) {
            const inboxRef = doc(collection(db, "inbox"), username);
            const inboxDoc = await getDoc(inboxRef);
            if (!inboxDoc.exists()) {
                await setDoc(inboxRef, {
                    lastRead: new Date()
                }, { merge: true });
            }
        }

        async function getConversationId() {
            const conversationRef = collection(db, 'conversation');
            const messagesQuery = query(
                conversationRef,
                where('username1', 'in', [myUserInfo.username, recipient]),
                where('username2', 'in', [myUserInfo.username, recipient])
            );
            const querySnapshot = await getDocs(messagesQuery);

            if (querySnapshot.empty) {
                addDoc(collection(db, "conversation"), {
                    username1: myUserInfo.username,
                    username2: recipient
                });
            }

            const messageId = (await getDocs(messagesQuery)).docs[0].id;
            setConversationId(messageId);
            checkInbox(myUserInfo.username);
            checkInbox(recipient);
        }

        getConversationId();
    }, [recipient]);

    const closeChat = () => {
        setShowChat(false);
    }

    return (
        <>
            {showChat && (
                <div className="fixed right-80 bottom-0 w-96 h-2/3 flex flex-col bg-[#191c21] mt-8 rounded-t-2xl cursor-default">
                    <div className="flex p-2 bg-[#4e5d78] rounded-t-2xl">
                        <div className="flex justify-center items-center">
                            <Avatar imageUrl={image} altText={myUserInfo.username} size={10} />
                        </div>
                        <div className="flex flex-1 flex-col pl-3">
                            <p>{recipient}</p>
                            <p>Active now</p>
                        </div>
                        <div className="flex justify-center items-start">
                            <div className="p-2 rounded-full hover:bg-[#212833]">
                                <MdClose onClick={closeChat} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 overflow-y-auto">
                        <Messages myUserInfo={myUserInfo} friend={recipient} avatarUrl={image} />
                    </div>
                    <MessageForm conversationId={conversationId} myUserInfo={myUserInfo} friend={recipient} image={image} />
                </div>
            )}
        </>
    );
};

export default ChatPopup;