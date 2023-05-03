"use client"

import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import Modal from "@/components/utils/Modal"
import { formatDuration } from "@/components/utils/formatData"
import { db } from "@/firebase/firebase-app"
import { CommentInfo } from "@/global/Post.types"
import { PostContext } from "../../PostContext"
import PostActions from "../actions/PostActions"
import PostContent from "./PostContent"

// Todo: Optimization
export default function PostPopup({ isOpen, onClose }: { isOpen: boolean; onClose: any }) {
  const [comments, setComments] = useState<CommentInfo[]>([])
  const { postData: post } = useContext(PostContext)

  useEffect(() => {
    if (!post.id) return;

    async function fetchData() {
      const commentsQuery = query(collection(db, "posts", post.id, "comments"), orderBy("timestamp", "asc"))
      const commentsDocs = (await getDocs(commentsQuery)).docs

      const comments = commentsDocs.map((doc) => {
        return {
          ...doc.data() as any,
          replies: doc
            .data()
            .replies?.sort((a: any, b: any) => a.timestamp - b.timestamp)
            .map((reply: any) => {
              return {
                ...reply,
                timestamp: formatDuration(new Date().getTime() - new Date(reply.timestamp.seconds * 1000).getTime()),
                realTimestamp: reply.timestamp,
                parentId: doc.id,
              }
            }),
          timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
          id: doc.id,
        }
      })

      setComments(comments)
    }

    fetchData()
  }, [post])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={""}>
      <div className="w-[600px]">
        <PostContent
          authorName={post.authorName}
          avatarUrl={post.avatarUrl}
          timestamp={post.timestamp}
          content={post.content}
          imageUrl={post.imageUrl}
          videoUrl={post.videoUrl}
          animeID={post?.post_anime_data?.anime_id}
          animeName={post?.post_anime_data?.anime_name}
          watchingProgress={post?.post_anime_data?.watching_progress}
          episodesSeen={post?.post_anime_data?.episodes_seen}
          episodesTotal={post?.post_anime_data?.total_episodes}
          tag={post?.tag?.filter((tag: string) => !(post?.post_anime_data?.my_status === "completed" && tag === "Spoiler"))}
          postId={post.id}
        />
        <PostActions
          reactions={post.reactions}
          commentCountPromise={comments.length}
          comments={comments}
          showTopReaction={true}
          animeStatus={post?.post_anime_data?.my_status}
        />
      </div>
    </Modal>
  )
}
