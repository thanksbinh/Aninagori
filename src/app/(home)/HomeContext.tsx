'use client';

import { UserInfo } from '@/global/UserInfo.types';
import React from 'react';

interface HomeContextType {
  myUserInfo: UserInfo;
}

export const HomeContext = React.createContext<HomeContextType>({
  myUserInfo: {
    username: "",
    image: "",
    id: "",
  },
});

export default function ContextProvider({
  myUserInfo,
  children
}: {
  myUserInfo: UserInfo,
  children: React.ReactNode
}) {
  return (
    <HomeContext.Provider value={{ myUserInfo }} >
      {children}
    </HomeContext.Provider>
  );
}