'use client'

import { db } from "@/firebase/firebase-app";
import { UserInfo } from "../nav/NavBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Message, { MessageProps } from "./Message";

const Messages = ({ myUserInfo }: { myUserInfo: UserInfo }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchData() {    
      const messagesRef = collection(db, 'conversation');
      const messagesQuery = query(
        messagesRef, 
        where('username1', 'in', [myUserInfo.username, 'niichan1403']),
        where('username2', 'in', [myUserInfo.username, 'niichan1403'])
      );
      const querySnapshot = await getDocs(messagesQuery);
      
      // Fetch messages from conversation  
      const doc = querySnapshot.docs[0].data().messages || [];
      const fetchedMessages: MessageProps[] = doc.map((obj : MessageProps) => ({
        senderUsername: obj.senderUsername,
        receiverUsername: obj.receiverUsername,
        avatarUrl: obj.avatarUrl,
        timestamp: obj.timestamp,
        content: obj.content,
        likes: obj.likes,
      }));
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