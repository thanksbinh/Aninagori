'use client'

import { getDocs, collection, query, orderBy, getDoc, doc } from "firebase/firestore";
import PostContent from "./PostContent";
import { db } from "@/firebase/firebase-app";
import PostAction from "./PostAction"
import { formatDuration } from "../utils/formatDuration";
import { useEffect, useState } from "react";
import { UserInfo } from "../nav/NavBar";
import Modal from "../utils/Modal";

export default function PostPopup({ isOpen, onClose, myUserInfo, id }: { isOpen: boolean, onClose: any, myUserInfo: UserInfo, id: string }) {
  const [post, setPost] = useState<any>({})

  useEffect(() => {
    async function fetchData() {
      const postDoc = await getDoc(doc(db, "posts", id))
      if (!postDoc.exists()) return;

      const commentsRef = collection(postDoc.ref, "comments")
      const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"))

      const commentsData = (await getDocs(commentsQuery)).docs
      console.log(commentsData)
      const commentCount = commentsData.length

      const comments = commentsData.map(doc => {
        return {
          ...doc.data(),
          timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime())
        }
      })

      console.log(comments)

      setPost({
        ...postDoc.data(),
        timestamp: formatDuration(new Date().getTime() - postDoc.data().timestamp.toDate().getTime()),
        commentCount: commentCount,
        comments: comments,
      } as any)
    }

    fetchData()
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={""}>
      <div className="w-[600px]" >
        <PostContent
          authorName={post.authorName}
          avatarUrl={post.avatarUrl}
          timestamp={post.timestamp}
          content={post.content}
          imageUrl={post.imageUrl}
          videoUrl={post.videoUrl}
          id={id}
        />
        <PostAction
          myUserInfo={myUserInfo}
          reactions0={post.reactions}
          commentCount={post.commentCount}
          comments={post.comments}
          id={id}
        />
      </div>
    </Modal >
  );
}