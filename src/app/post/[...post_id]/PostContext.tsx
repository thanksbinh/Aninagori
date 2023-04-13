"use client"

import { UserInfo } from "@/global/UserInfo.types"
import React from "react"

interface PostContextType {
  myUserInfo: UserInfo
  content: string
  authorName: string
  animeID?: string
  postId: string,
  postData: any,
  editFormRef: any,
  setEditPostID?: any
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
  postId: "",
  postData: {},
  editFormRef: {},
  setEditPostID: () => { },
})

export default function ContextProvider({
  myUserInfo,
  content,
  authorName,
  animeID,
  postId,
  children,
  postData,
  editFormRef,
  setEditPostID,
}: {
  myUserInfo: UserInfo
  content: string
  authorName: string
  animeID?: string
  postId: string
  children: React.ReactNode,
  postData: any,
  editFormRef?: any
  setEditPostID?: any
}) {
  return (
    <PostContext.Provider value={{ myUserInfo, content, authorName, animeID, postId, postData, editFormRef, setEditPostID }}>{children}</PostContext.Provider>
  )
}
