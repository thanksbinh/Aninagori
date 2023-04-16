'use client'

import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import Message, { MessageProps } from "./Message";

const Messages = ({ myUserInfo, friend, avatarUrl }: { myUserInfo: UserInfo, friend: string, avatarUrl: string }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [seenStatus, setSeenStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

        const fieldName = docSnap.data()?.username1 === myUserInfo.username ? "user1LastRead" : "user2LastRead";
        if ((fieldName === "user1LastRead" && docSnap.data()?.user2LastRead > docSnap.data()?.user1LastRead) ||
          (fieldName === "user2LastRead" && docSnap.data()?.user1LastRead > docSnap.data()?.user2LastRead)) {
          setSeenStatus(true);
        } else {
          setSeenStatus(false)
        }

        setMessages(fetchedMessages);
      } else {
        setMessages([]);
      }
      console.log("Messages fetched");
    })

    return () => {
      unsubscribe && unsubscribe()
    };
  }

  useEffect(() => {
    // scroll to bottom when component mounts
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  useEffect(() => {
    fetchData();
  }, [friend]);

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
      <div className={`flex flex-row-reverse text-white text-xs ${seenStatus ? "" : "hidden"} ${(messages[messages.length - 1]?.senderUsername === myUserInfo?.username) ? "" : "hidden"}`}>
        <p className="flex mr-4">seen ✓</p>
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  )
}

export default Messages