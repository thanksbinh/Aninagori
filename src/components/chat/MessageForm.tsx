'use client'

import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { FC, useEffect, useRef, useState } from "react";
import { setLastRead } from "./setLastRead";
import { findOldLastMessage, setLastMessage, updateStatus } from "./ChatNoti";

interface Props {
  messageId?: string;
  conversationId: string;
  myUserInfo: UserInfo;
  friend: string;
  image: string;
};

const MessageForm: FC<Props> = ({
  messageId,
  conversationId,
  myUserInfo,
  friend,
  image
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [myMessage, setMyMessage] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversationId]);

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

    setMyMessage("");

    await Promise.all([
      setLastRead(myUserInfo, conversationId),
      sendMessage(content),

      setLastMessage(
        {
          id: conversationId,
          lastMessage: {
            content: myMessage,
            read: true,
            senderUsername: myUserInfo.username,
            timestamp: new Date()
          },
          sender: {
            username: friend,
            image: image
          }
        },
        myUserInfo.username, conversationId
      ),
      setLastMessage(
        {
          id: conversationId,
          lastMessage: {
            content: myMessage,
            read: false,
            senderUsername: myUserInfo.username,
            timestamp: new Date()
          },
          sender: {
            username: myUserInfo.username,
            image: myUserInfo.image
          }
        },
        friend, conversationId
      )
    ])
  }

  // set seen status and set last message read status on focus
  const onFormFocus = async () => {
    const conversationRef = doc(collection(db, 'conversation'), conversationId);
    const docSnap = await getDoc(conversationRef);
    if (docSnap.data()?.messages?.slice(-1)[0]?.senderUsername !== myUserInfo.username) {
      setLastRead(myUserInfo, conversationId)
    }

    const oldLastMessage = await findOldLastMessage(myUserInfo.username, conversationId);
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

  return (
    <div className="flex items-center my-4 pr-4 pl-2">
      <form onFocus={onFormFocus} onSubmit={onMessage} className="rounded-2xl py-2 px-4 ml-2 w-full bg-[#212833] caret-white" >
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