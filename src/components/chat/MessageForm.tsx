'use client'

import { collection, serverTimestamp, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { FC, useState, useRef } from "react";
import { db } from "@/firebase/firebase-app";
import { useRouter } from "next/navigation";
import { UserInfo } from "../nav/NavBar";

interface Props {
  messageId?: string;
  messages: Object[];
  conversationId: string;
  myUserInfo: UserInfo;
};

const MessageForm: FC<Props> = ({
  messageId,
  messages,
  conversationId,
  myUserInfo,
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
      senderUsername: myUserInfo.username,
      receiverUsername: 'niichan',
      avatarUrl: myUserInfo.image,
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