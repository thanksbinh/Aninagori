import { getDocs, collection, query, orderBy, getCountFromServer, limit } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { formatDuration } from "../utils/formatDuration";
import PostContent from "./PostContent";
import PostAction from "./PostAction";

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount;
}

async function fetchLastComment(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")

  const lastCommentRef = query(commentsRef, orderBy("timestamp", "desc"), limit(1))
  const lastCommentDocs = (await getDocs(lastCommentRef)).docs

  const lastComment = lastCommentDocs.map(doc => {
    return {
      ...doc.data(),
      replies: doc.data().replies?.sort((a: any, b: any) => a.timestamp - b.timestamp).map((reply: any) => {
        return {
          ...reply,
          timestamp: formatDuration(new Date().getTime() - new Date(reply.timestamp.seconds * 1000).getTime()),
          realTimestamp: { ...reply.timestamp },
          parentId: doc.id
        }
      }),
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id
    } as any
  })

  return lastComment;
}

export async function Post(props: any) {
  const [commentCount, lastComment] = [await fetchCommentCount(props.id), await fetchLastComment(props.id)]

  return (
    <div className="mb-4">
      <PostContent
        authorName={props.authorName}
        avatarUrl={props.avatarUrl}
        timestamp={props.timestamp}
        content={props.content}
        imageUrl={props.imageUrl}
        videoUrl={props.videoUrl}
      />
      <PostAction
        reactions={props.reactions}
        commentCount={commentCount}
        comments={lastComment}
      />
    </div>
  );
}