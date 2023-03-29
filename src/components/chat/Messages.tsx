'use client'

import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Message, { MessageProps } from "./Message";

const Messages = ({ myUserInfo, friend }: { myUserInfo: UserInfo, friend: string }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const messagesList = messages.map((message, index) => {
    const isFirstMessage = index === 0 || message.senderUsername !== messages[index - 1].senderUsername;
    const isLastMessage = index === messages.length - 1 || message.senderUsername !== messages[index + 1].senderUsername;

    return (
      <Message
          key={index}
          receiverUsername={message.receiverUsername}
          senderUsername={message.senderUsername}
          avatarUrl={message.avatarUrl}
          timestamp={message.timestamp}
          content={message.content}
          likes={message.likes}
          myUserInfo={myUserInfo}
          isFirstMessage={isFirstMessage}
          isLastMessage={isLastMessage}
      />
    );
  })

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
          const fetchedMessages: MessageProps[] = docSnap?.data()?.messages.map((obj : MessageProps) => ({
            senderUsername: obj.senderUsername,
            receiverUsername: obj.receiverUsername,
            avatarUrl: obj.avatarUrl,
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
          {messagesList}
      </div>
  )
}

export default Messages