import React from 'react';
import { UserInfo } from '../../nav/NavBar';

interface ChatContextType {
  myUserInfo: UserInfo;
  conversationId: string;
}

export const ChatContext = React.createContext<ChatContextType>({
  myUserInfo: {
    username: "",
    image: "",
    id: "",
  },
  conversationId: "Qtp6I39m8uWhiNfcvQHR"
});