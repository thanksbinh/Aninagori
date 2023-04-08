'use client'

import { collection, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FC, useState, useRef } from "react";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { setLastRead } from "./setLastRead";

interface Props {
  messageId?: string;
  conversationId: string;
  myUserInfo: UserInfo;
  friend: string;
};

const MessageForm: FC<Props> = ({
  messageId,
  conversationId,
  myUserInfo,
  friend
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [myMessage, setMyMessage] = useState("");

  // send message to conversation
  const sendMessage = async (message: any) => {
    const conversationRef = doc(collection(db, 'conversation'), conversationId);
    await updateDoc(conversationRef, {
      messages: arrayUnion(message)
    });
    console.log("Message sent:" + message);
  }

  const onMessage = async (e: any) => {
    e.preventDefault();

    if (!myMessage.trim()) return;

    const content = {
      senderUsername: myUserInfo.username,
      content: myMessage,
      timestamp: new Date(),
      likes: 0
    }

    await sendMessage(content);

    setMyMessage("");
  }

  const onFormClick = () => {
    setLastRead(myUserInfo, conversationId)
  }

  return (
    <div className="flex items-center my-4 pr-4 pl-2">
      <form onClick={onFormClick} onSubmit={onMessage} className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#212833] caret-white" >
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