'use client'

import { findOldLastMessage, updateStatus } from "@/components/chat/ChatNoti";
import { formatDuration } from "@/components/utils/formatData";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { collection, doc, getDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export interface FriendInfo {
  username: string
  image: string
  anime_status?: {
    status: string
    updated_at: Date
    title: string
  }
}

const statusTextColor = new Map([
  ['completed', 'text-blue-400'],
  ['watching', 'text-green-400'],
  ['on_hold', 'text-yellow-400'],
  ['dropped', 'text-red-400']
]);

const FriendComponent = ({ friendInfo, openChat, setCurrentChat, myUserInfo }:
  {
    friendInfo: FriendInfo,
    openChat: () => void,
    setCurrentChat: Dispatch<SetStateAction<{
      username: string;
      image: string;
    }>>
    myUserInfo: UserInfo | undefined
  }) => {

  async function getInbox() {
    if (myUserInfo?.username) {
      const inboxRef = doc(collection(db, "inbox"), myUserInfo.username);
      const inboxDoc = await getDoc(inboxRef);
      if (!inboxDoc.exists()) return;

      const inbox = inboxDoc?.data()?.recentChats.find((obj: any) => (obj.sender.username === friendInfo.username));
      if (inbox) return inbox.id;
    }
  }

  const onClick = async () => {
    if (myUserInfo?.username) {
      const conversationId = await getInbox();
      const oldLastMessage = await findOldLastMessage(myUserInfo.username, conversationId);
      if (oldLastMessage) {
        updateStatus(
          {
            id: conversationId,
            lastMessage: {
              content: oldLastMessage.lastMessage.content,
              read: true,
              senderUsername: oldLastMessage.lastMessage.senderUsername,
              timestamp: oldLastMessage.lastMessage.timestamp
            },
            sender: {
              username: oldLastMessage.sender.username,
              image: oldLastMessage.sender.image
            }
          },
          myUserInfo.username, conversationId
        );
      }
    }

    openChat();
    setCurrentChat({
      username: friendInfo.username,
      image: friendInfo.image
    });
  }

  return (
    <div className="relative w-full hover:cursor-pointer">
      <div className="flex items-center w-full px-4 py-3 hover:bg-[#4e5d78]" onClick={onClick}>
        <img
          className="rounded-full w-8 h-8 object-cover"
          src={friendInfo.image || '/bocchi.jpg'}
          alt={friendInfo.username}
        />
        <div className="ml-2">
          <p className="font-medium">{friendInfo.username}</p>
          {!!friendInfo.anime_status &&
            <p className={`flex gap-1 text-sm ${statusTextColor.get(friendInfo.anime_status.status)}`}>
              <span className="max-w-[180px] truncate block"> {friendInfo.anime_status.title} </span>
              <span className="text-gray-400 flex-shrink-0"> — {formatDuration(new Date().getTime() - friendInfo.anime_status.updated_at.getTime(), true)} </span>
            </p>
          }
        </div>
      </div>
    </div>
  );
};

export default FriendComponent;