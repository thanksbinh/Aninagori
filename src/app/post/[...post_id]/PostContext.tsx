"use client"

import { UserInfo } from "@/global/UserInfo.types"
import React from "react"

interface PostContextType {
  myUserInfo: UserInfo
  content: string
  authorName: string
  animeID?: number
  postId: string,
  postData: any,
}

export const PostContext = React.createContext<PostContextType>({
  myUserInfo: {
    username: "",
    image: "",
    id: "",
  },
  content: "",
  authorName: "",
  animeID: 0,
  postId: "",
  postData: {}
})

export default function ContextProvider({
  myUserInfo,
  content,
  authorName,
  animeID,
  postId,
  children,
  postData,
}: {
  myUserInfo: UserInfo
  content: string
  authorName: string
  animeID?: number
  postId: string
  children: React.ReactNode,
  postData: any,
}) {
  return (
    <PostContext.Provider value={{ myUserInfo, content, authorName, animeID, postId, postData }}>
      {children}
    </PostContext.Provider>
  )
}
