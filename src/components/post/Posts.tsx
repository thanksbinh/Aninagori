import { getDocs, collection, query, orderBy, getCountFromServer, limit } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "../../global/types";
import { formatDuration } from "../utils/formatDuration";
import PostContent from "./PostContent";
import PostAction from "./PostAction"
import { Suspense } from "react";

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10));
  const querySnapshot = await getDocs(q);
  const fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id
    } as any
  });

  return (
    <div className="flex flex-col">
      {fetchedPosts.map((post) => (
        <div key={post.id}>
          <Suspense fallback={<div className="h-screen">Loading...</div>}>
            {/* @ts-expect-error Server Component */}
            <Post
              authorName={post.authorName}
              avatarUrl={post.avatarUrl}
              timestamp={post.timestamp}
              content={post.content}
              imageUrl={post.imageUrl}
              videoUrl={post.videoUrl}
              myUserInfo={myUserInfo}
              reactions={post.reactions}
              id={post.id}
            />
          </Suspense>
        </div>
      ))
      }
    </div >
  );
}

async function Post(props: any) {
  const commentsRef = collection(db, "posts", props.id, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

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

  return (
    <div className="mb-4">
      <PostContent
        myUserInfo={props.myUserInfo}
        authorName={props.authorName}
        avatarUrl={props.avatarUrl}
        timestamp={props.timestamp}
        content={props.content}
        imageUrl={props.imageUrl}
        videoUrl={props.videoUrl}
        id={props.id}
      />
      <PostAction
        myUserInfo={props.myUserInfo}
        reactions={props.reactions}
        commentCount={commentCount}
        comments={lastComment}
        postId={props.id}
      />
    </div>
  );
}

