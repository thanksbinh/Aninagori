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
  const { postData } = useContext(PostContext)

  useEffect(() => {
    if (!postData.id) return;

    async function fetchData() {
      const commentsQuery = query(collection(db, "posts", postData.id, "comments"), orderBy("timestamp", "asc"))
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
  }, [postData])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={""}>
      <div className="w-[600px]">
        <PostContent
          authorName={postData.authorName}
          avatarUrl={postData.avatarUrl}
          timestamp={postData.timestamp}
          content={postData.content}
          imageUrl={postData.imageUrl}
          videoUrl={postData.videoUrl}
          animeID={postData?.post_anime_data?.anime_id}
          animeName={postData?.post_anime_data?.anime_name}
          watchingProgress={postData?.post_anime_data?.watching_progress}
          episodesSeen={postData?.post_anime_data?.episodes_seen}
          episodesTotal={postData?.post_anime_data?.total_episodes}
          tag={postData?.tag?.filter((tag: string) => !(postData?.post_anime_data?.my_status === "completed" && tag === "Spoiler"))}
          postId={postData.id}
        />
        <PostActions
          commentCountPromise={comments.length}
          comments={comments}
          showTopReaction={true}
          animeStatus={postData?.post_anime_data?.my_status}
        />
      </div>
    </Modal>
  )
}
