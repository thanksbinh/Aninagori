'use client'

import { db } from "@/firebase/firebase-app";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import Message, { MessageProps } from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const conversationID = 'Qtp6I39m8uWhiNfcvQHR';

  useEffect(() => {
    async function fetchData() {        
      const q = query(collection(db, "conversation", conversationID, "messages"), orderBy("timestamp", "asc"));
      const fetchedMessages: MessageProps[] = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const message = {
          senderUsername: doc.data().senderUsername,
          receiverUsername: doc.data().receiverUsername,
          avatarUrl: doc.data().avatarUrl,
          timestamp: doc.data().timestamp.toDate().toString(),
          content: doc.data().content,
          likes: doc.data().likes,
        } as MessageProps;
        fetchedMessages.push(message);
      });
      setMessages(fetchedMessages);
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