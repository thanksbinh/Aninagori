
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

// set last message of conversation
const findOldLastMessage = async (username: string, conversationId: string) => {
    const inboxRef = doc(collection(db, 'inbox'), username);
    const inboxDoc = await getDoc(inboxRef);

    if (inboxDoc.exists() && inboxDoc.data()?.hasOwnProperty("recentChats")) {
        const message = inboxDoc.data()?.recentChats.find((e: any) => e.id === conversationId);
        if (message) { return message }
    }
    else return null;
}

const setLastMessage = async (lastMessage: any, username: string, conversationId: string) => {
    const inboxRef = doc(collection(db, 'inbox'), username);
    const oldLastMessage = await findOldLastMessage(username, conversationId);
    if (oldLastMessage) {
        await updateDoc(inboxRef, {
            recentChats: arrayRemove(oldLastMessage)
        });
    }

    await updateDoc(inboxRef, {
        recentChats: arrayUnion(lastMessage)
    });
}

// update message read status
const updateStatus = async (e: any, username: string, conversationId: string) => {
    await setLastMessage(
        e, username, conversationId
    );
}

const ChatNoti: React.FC<Props> = (
    { myUserInfo, conversationId, name, image, lastMessage,
        timestamp, friend, read, openChat, setCurrentChat, toggleChatBtn }
) => {
    const myInbox = {
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

    const onClick = () => {
        updateStatus(myInbox, myUserInfo.username, conversationId);
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
                        {name + ": " + (lastMessage.length > 20 ? lastMessage.substring(0, 25) + "..." : lastMessage)}
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
export { findOldLastMessage, setLastMessage, updateStatus };