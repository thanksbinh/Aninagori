'use client'

import { db } from "@/firebase/firebase-app";
import { UserInfo } from "../nav/NavBar";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Message, { MessageProps } from "./Message";

const Messages = ({ myUserInfo, friend }: { myUserInfo: UserInfo, friend: string }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchData() {    
      const conversationRef = collection(db, 'conversation');
      const messagesQuery = query(
        conversationRef,
        where('username1', 'in', [myUserInfo.username, friend]),
        where('username2', 'in', [myUserInfo.username, friend])
      );
      const messageRef = (await getDocs(messagesQuery)).docs[0].ref;

      const unsubscribe = onSnapshot(messageRef, (docSnap) => {
        console.log(docSnap?.data())
        const fetchedMessages: MessageProps[] = docSnap?.data()?.messages.map((obj : MessageProps) => ({
          senderUsername: obj.senderUsername,
          receiverUsername: obj.receiverUsername,
          avatarUrl: obj.avatarUrl,
          timestamp: obj.timestamp,
          content: obj.content,
          likes: obj.likes,
        }));
        setMessages(fetchedMessages);
      })

      return () => {
        unsubscribe && unsubscribe()
      };  
    }

    fetchData();
  }, []);

  return (
      <div>
          {messages.map((message) => (
              <Message
                  receiverUsername={message.receiverUsername}
                  senderUsername={message.senderUsername}
                  avatarUrl={message.avatarUrl}
                  timestamp={message.timestamp}
                  content={message.content}
                  likes={message.likes}
              />
          ))}
      </div>
  )
}

export default Messages