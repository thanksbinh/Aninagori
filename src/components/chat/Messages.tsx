'use client'

import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Message, { MessageProps } from "./Message";

const Messages = ({ myUserInfo, friend, avatarUrl }: { myUserInfo: UserInfo, friend: string, avatarUrl: string }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchData() {
      const conversationRef = collection(db, 'conversation');
      const messagesQuery = query(
        conversationRef,
        where('username1', 'in', [myUserInfo.username, friend]),
        where('username2', 'in', [myUserInfo.username, friend])
      );
      const querySnapshot = await getDocs(messagesQuery);
      if (querySnapshot.empty) {
        return;
      }

      const messageRef = (querySnapshot).docs[0].ref;

      const unsubscribe = onSnapshot(messageRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data()?.hasOwnProperty("messages")) {
          const fetchedMessages: MessageProps[] = docSnap?.data()?.messages.map((obj: MessageProps) => ({
            senderUsername: obj.senderUsername,
            timestamp: obj.timestamp,
            content: obj.content,
            likes: obj.likes,
          }));
          setMessages(fetchedMessages);
        }
      })

      return () => {
        unsubscribe && unsubscribe()
      };
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      {messages?.map((message, index) => (
        <Message
          key={index}
          senderUsername={message.senderUsername}
          avatarUrl={avatarUrl}
          timestamp={message.timestamp}
          content={message.content}
          likes={message.likes}
          myUserInfo={myUserInfo}
          isFirstMessage={index === 0 || message.senderUsername !== messages[index - 1].senderUsername}
          isLastMessage={index === messages.length - 1 || message.senderUsername !== messages[index + 1].senderUsername}
        />
      ))}
    </div>
  )
}

export default Messages