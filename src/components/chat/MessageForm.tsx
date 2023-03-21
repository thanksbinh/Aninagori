'use client'

import { collection, serverTimestamp, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { FC, useContext, useState, useRef } from "react";
import { db } from "@/firebase/firebase-app";
import { useRouter } from "next/navigation";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

interface Props {
  messageId?: string;
  messages: Object[];
  conversationId: string;
};

const MessageForm: FC<Props> = ({
  messageId,
  conversationId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [myMessage, setMyMessage] = useState("")
  const router = useRouter()

  // send message to conversation
  const sendMessage = async (message: any) => {
    const conversationRef = doc(collection(db, 'conversation'), conversationId);
    await updateDoc(conversationRef, {
      messages: arrayUnion(message)
    });
    console.log("Message sent:" + message);
  }

  const onMessage = (e: any) => {
    e.preventDefault()

    if (!myMessage.trim()) return;

    const content = {
      senderUsername: 'niichan1403',
      receiverUsername: 'niichan',
      avatarUrl: '',
      content: myMessage,
      timestamp: '',
      likes: 0
    }

    sendMessage(content)

    router.refresh()

    setMyMessage("")
  }

  return (
    <div className="flex items-center my-4 pr-4 pl-2">
      <form onSubmit={onMessage} className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#212833] caret-white" >
        <input
          type="text"
          placeholder="Say something..."
          value={myMessage}
          onChange={(e) => setMyMessage(e.target.value)}
          ref={inputRef}
          className="w-full bg-[#212833] focus:outline-none caret-white"
        />
      </form>
    </div>
  );
};

export default MessageForm;