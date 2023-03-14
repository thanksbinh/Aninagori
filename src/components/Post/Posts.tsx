import Post from "./Post";
import { getDocs, collection, query, orderBy, getCountFromServer, limit } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "../nav/NavBar";
import PostAction from "./PostAction"
import { formatDuration } from "../utils/formatDuration";

async function fetchData() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

  let fetchedPosts = [];
  const querySnapshot = await getDocs(q);

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i];

    const commentsRef = collection(doc.ref, "comments")
    const commentCount = (await getCountFromServer(commentsRef)).data().count

    const lastCommentRef = query(commentsRef, orderBy("timestamp", "desc"), limit(1))
    const lastComment = (await getDocs(lastCommentRef)).docs[0]?.data()

    fetchedPosts.push({
      authorName: doc.data().authorName,
      avatarUrl: doc.data().avatarUrl,
      content: doc.data().content,
      imageUrl: doc.data().imageUrl,
      videoUrl: doc.data().videoUrl,
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),

      reactions: doc.data().reactions,
      commentCount: commentCount,
      lastComment: lastComment && {
        ...lastComment,
        timestamp: formatDuration(new Date().getTime() - lastComment.timestamp.toDate().getTime())
      },
      id: doc.id
    })
  }

  return fetchedPosts
}

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const posts = await fetchData();

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <div key={post.id}>
          <Post
            authorName={post.authorName}
            avatarUrl={post.avatarUrl}
            timestamp={post.timestamp}
            content={post.content}
            imageUrl={post.imageUrl}
            videoUrl={post.videoUrl}
            id={post.id}
          />
          <PostAction
            myUserInfo={myUserInfo}
            reactions0={post.reactions}
            commentCount={post.commentCount}
            lastComment={post.lastComment as any}
            id={post.id}
          />
        </div>
      ))}
    </div>
  );
}