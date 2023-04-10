'use client'

import { useEffect, useState } from "react";
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import { UserInfo } from "../../global/UserInfo.types";
import ChatNoti from "./ChatNoti";
import { Friend } from "@/app/(home)/rightsidebar/Friend";
import { db } from "@/firebase/firebase-app";
import { Timestamp, doc, getDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Props {
    myUserInfo: UserInfo
    showChatBtn: boolean
}

interface Conversation {
    name: string;
    image: string;
    lastMessage: string;
    timestamp: Timestamp;
    friend: string;
}

async function getFriendList(myUserInfo: UserInfo): Promise<Friend[]> {
    const userDoc = doc(db, "users", myUserInfo.id)
    const snapshot = await getDoc(userDoc)
    console.log(snapshot.data()?.friend_list?.reverse());
    return snapshot.data()?.friend_list?.reverse() || []
}

const ChatNotiContainer: React.FC<Props> = ({ myUserInfo, showChatBtn }) => {
    const [conversations, setConversations] = useState<Conversation[]>([])

    // fetch conversations data
    useEffect(() => {
        async function getConversations() {
            const myFriendList: Friend[] = await getFriendList(myUserInfo);
            const conversationRef = collection(db, "conversation");

            myFriendList.forEach(async (friend: Friend) => {
                const conversationQuery = query(
                    conversationRef,
                    where('username1', 'in', [myUserInfo.username, friend.username]),
                    where('username2', 'in', [myUserInfo.username, friend.username])
                )
                const querySnapshot = await getDocs(conversationQuery);
                if (querySnapshot.empty) {
                    return;
                }

                const messageRef = (querySnapshot).docs[0].ref;

                const unsubscribe = onSnapshot(messageRef, (docSnap) => {
                    if (docSnap.exists() && docSnap.data()?.hasOwnProperty("messages")) {
                        const lastMessage = docSnap.data()?.messages?.slice(-1)[0];
                        console.log(lastMessage);
                        const conversation: Conversation = {
                            name: lastMessage.senderUsername === myUserInfo?.username ? "You" : lastMessage.senderUsername,
                            image: friend.image,
                            lastMessage: lastMessage.content,
                            timestamp: lastMessage.timestamp,
                            friend: friend.username
                        }
                        // Check if the conversation already exists in the array
                        const conversationIndex = conversations.findIndex(c => c.friend === friend.username);
                        if (conversationIndex === -1) {
                            // If the conversation doesn't exist, add it to the array
                            setConversations(prevConversations => [...prevConversations, conversation]);
                        } else {
                            // If the conversation already exists, update it with the new message
                            const updatedConversations = [...conversations];
                            updatedConversations[conversationIndex] = conversation;
                            setConversations(updatedConversations);
                        }
                    }
                })

                return () => {
                    unsubscribe && unsubscribe()
                };
            });
        }
        getConversations();
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
                            {conversations.map((conversation, index) => (
                                <ChatNoti
                                    key={index}
                                    myUserInfo={myUserInfo}
                                    name={conversation.name}
                                    image={conversation.image}
                                    lastMessage={conversation.lastMessage}
                                    timestamp={conversation.timestamp}
                                    friend={conversation.friend}
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