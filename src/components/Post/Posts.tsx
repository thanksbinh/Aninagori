import { getDocs, collection, query, orderBy, getCountFromServer, limit } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "../nav/NavBar";
import { formatDuration } from "../utils/formatDuration";
import PostContent from "./PostContent";
import PostAction from "./PostAction"

async function fetchData() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(20));
  const querySnapshot = await getDocs(q);

  let fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id
    } as any
  });

  return fetchedPosts
}

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const posts = await fetchData();

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <div key={post.id}>
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
        </div>
      ))}
    </div>
  );
}

async function Post(props: any) {
  const commentsRef = collection(db, "posts", props.id, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  const lastCommentRef = query(commentsRef, orderBy("timestamp", "desc"), limit(1))
  const lastCommentData = (await getDocs(lastCommentRef)).docs[0]
  const lastComment = lastCommentData ? {
    ...lastCommentData.data(),
    timestamp: formatDuration(new Date().getTime() - lastCommentData.data().timestamp.toDate().getTime()),
    id: lastCommentData.id
  } as any : []

  return (
    <div className="mb-4">
      <PostContent
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
        reactions0={props.reactions}
        commentCount={commentCount}
        comments={lastComment}
        id={props.id}
      />
    </div>
  );
}

