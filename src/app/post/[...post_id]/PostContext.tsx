'use client';

import { UserInfo } from '@/global/UserInfo.types';
import React from 'react';

interface PostContextType {
  myUserInfo: UserInfo;
  content: string;
  authorName: string;
  animeID?: string;
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
  animeID: "",
  postId: ""
});

export default function ContextProvider({
  myUserInfo,
  content,
  authorName,
  animeID,
  postId,
  children
}: {
  myUserInfo: UserInfo,
  content: string,
  authorName: string,
  animeID?: string,
  postId: string,
  children: React.ReactNode
}) {
  return (
    <PostContext.Provider value={{ myUserInfo, content, authorName, animeID, postId }} >
      {children}
    </PostContext.Provider>
  );
}