'use client'

import { collection, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";
import { FC, useState, useRef } from "react";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { setLastRead } from "./setLastRead";

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
    await setLastMessage(
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
      myUserInfo.username
    );

    await setLastMessage(
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
          image: image
        }
      },
      friend
    );

    setMyMessage("");

    setLastRead(myUserInfo, conversationId);
  }

  // set last message of conversation
  const findOldLastMessage = async (username: string) => {
    const inboxRef = doc(collection(db, 'inbox'), username);
    const inboxDoc = await getDoc(inboxRef);

    if (inboxDoc.exists() && inboxDoc.data()?.hasOwnProperty("recentChats")) {
      const message = inboxDoc.data()?.recentChats.find((e: any) => e.id === conversationId);
      if (message) { return message }
    }
    else return null;
  }

  const setLastMessage = async (lastMessage: any, username: string) => {
    const inboxRef = doc(collection(db, 'inbox'), username);
    const oldLastMessage = await findOldLastMessage(username);
    if (oldLastMessage) {
      await updateDoc(inboxRef, {
        recentChats: arrayRemove(oldLastMessage)
      });
    }

    await updateDoc(inboxRef, {
      recentChats: arrayUnion(lastMessage)
    });
  }

  // set seen status
  const onFormClick = async () => {
    const conversationRef = doc(collection(db, 'conversation'), conversationId);
    const docSnap = await getDoc(conversationRef);
    if (docSnap.data()?.messages?.slice(-1)[0].senderUsername !== myUserInfo.username) {
      setLastRead(myUserInfo, conversationId)
    }
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