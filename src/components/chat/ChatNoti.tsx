
import { formatDuration } from "@/components/utils/format";
import { db } from "@/firebase/firebase-app";
import { arrayRemove, arrayUnion, collection, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { UserInfo } from "../../global/UserInfo.types";

interface Props {
    myUserInfo: UserInfo;
    conversationId: string;
    name: string;
    image: string;
    lastMessage: string;
    timestamp: Timestamp;
    friend: string;
    read: boolean;
    openChat: () => void;
    setCurrentChat: Dispatch<SetStateAction<{
        username: string;
        image: string;
    }>>
    toggleChatBtn: () => void;
}

const ChatNoti: React.FC<Props> = (
    { myUserInfo, conversationId, name, image, lastMessage,
        timestamp, friend, read, openChat, setCurrentChat, toggleChatBtn }
) => {
    const findOldLastMessage = async (username: string) => {
        const inboxRef = doc(collection(db, 'inbox'), username);
        const inboxDoc = await getDoc(inboxRef);

        if (inboxDoc.exists() && inboxDoc.data()?.hasOwnProperty("recentChats")) {
            const message = inboxDoc.data()?.recentChats.find((e: any) => e.id === conversationId);
            if (message) { return message }
        }
        else return null;
    }

    const setLastMessage = async (lastMessage: any, username: string) => {
        const inboxRef = doc(collection(db, 'inbox'), username);
        const oldLastMessage = await findOldLastMessage(username);
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
            },
            myUserInfo.username
        );

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
                    username: myUserInfo.username,
                    image: image
                }
            },
            friend
        );
    }

    const onClick = () => {
        updateStatus();
        openChat();
        setCurrentChat({
            username: friend,
            image: image
        });
        toggleChatBtn();
    }

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
        </>
    );
};

export default ChatNoti;