'use client'

import { getDocs, collection, query, orderBy, getDoc, doc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import PostContent from "./PostContent";
import { db } from "@/firebase/firebase-app";
import PostAction from "./PostAction"
import { formatDuration } from "../utils/formatDuration";
import Modal from "../utils/Modal";
import { PostContext } from "./context/PostContext";

// Todo: Optimization
export default function PostPopup({ isOpen, onClose }: { isOpen: boolean, onClose: any }) {
  const [post, setPost] = useState<any>({})
  const { postId } = useContext(PostContext)

  useEffect(() => {
    async function fetchData() {
      const postDoc = await getDoc(doc(db, "posts", postId))
      if (!postDoc.exists()) return;

      const commentsRef = collection(postDoc.ref, "comments")
      const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"))

      const commentsDocs = (await getDocs(commentsQuery)).docs
      const commentCount = commentsDocs.length

      const comments = commentsDocs.map(doc => {
        return {
          ...doc.data(),
          replies: doc.data().replies?.sort((a: any, b: any) => a.timestamp - b.timestamp).map((reply: any) => {
            return {
              ...reply,
              timestamp: formatDuration(new Date().getTime() - new Date(reply.timestamp.seconds * 1000).getTime()),
              realTimestamp: reply.timestamp,
              parentId: doc.id
            }
          }),
          timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
          id: doc.id
        }
      })

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
          postId={post.id}
        />
        <PostAction
          reactions={post.reactions}
          commentCountPromise={post.commentCount}
          comments={post.comments}
        />
      </div>
    </Modal >
  );
}