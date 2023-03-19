import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import PostContent from "./PostContent";
import PostAction from "./PostAction";

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount;
}

export async function Post(props: any) {
  const commentCount = await fetchCommentCount(props.id)

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
        comments={props.lastComment ? [props.lastComment] : []}
      />
    </div>
  );
}