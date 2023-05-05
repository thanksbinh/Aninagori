"use client"

import { PostInfo } from "@/global/Post.types"
import { UserInfo } from "@/global/UserInfo.types"
import React from "react"

interface PostContextType {
  myUserInfo: UserInfo
  postData: any,
  hidePost?: (postId: string) => void,
}

export const PostContext = React.createContext<PostContextType>({
  myUserInfo: {
    username: "",
    image: "",
    id: "",
  },
  postData: {},
  hidePost: (postId: string) => { console.log("hidePost", postId) },
})

export default function ContextProvider({
  myUserInfo,
  children,
  postData,
  hidePost,
}: {
  myUserInfo: UserInfo
  children: React.ReactNode,
  postData: PostInfo,
  hidePost?: (postId: string) => void,
}) {
  return (
    <PostContext.Provider value={{ myUserInfo, postData, hidePost }}>
      {children}
    </PostContext.Provider>
  )
}
