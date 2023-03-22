'use client';

import { UserInfo } from '@/global/types';
import React from 'react';

interface PostContextType {
  myUserInfo: UserInfo;
  authorName: string;
  postId: string;
}

export const PostContext = React.createContext<PostContextType>({
  myUserInfo: {
    username: "",
    image: "",
    id: "",
  },
  authorName: "",
  postId: ""
});

export default function ContextProvider({
  myUserInfo,
  authorName,
  postId,
  children
}: {
  myUserInfo: UserInfo,
  authorName: string,
  postId: string,
  children: React.ReactNode
}) {
  return (
    <PostContext.Provider value={{ myUserInfo, authorName, postId }} >
      {children}
    </PostContext.Provider>
  );
}