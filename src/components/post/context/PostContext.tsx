'use client';

import { UserInfo } from '@/global/UserInfo.types';
import React from 'react';

interface PostContextType {
  myUserInfo: UserInfo;
  content: string;
  authorName: string;
  postId: string;
}

export const PostContext = React.createContext<PostContextType>({
  myUserInfo: {
    username: "",
    image: "",
    id: "",
  },
  content: "",
  authorName: "",
  postId: ""
});

export default function ContextProvider({
  myUserInfo,
  content,
  authorName,
  postId,
  children
}: {
  myUserInfo: UserInfo,
  content: string,
  authorName: string,
  postId: string,
  children: React.ReactNode
}) {
  return (
    <PostContext.Provider value={{ myUserInfo, content, authorName, postId }} >
      {children}
    </PostContext.Provider>
  );
}