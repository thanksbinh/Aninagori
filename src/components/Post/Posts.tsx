import Post, { PostProps } from "./Post";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "../nav/NavBar";
import PostAction from "./PostAction"

async function fetchData() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

  const querySnapshot = await getDocs(q);
  const fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toString(),
      id: doc.id
    } as PostProps;
  })

  return fetchedPosts
}

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const posts: PostProps[] = await fetchData();

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
            reactions={[]}
            comments={post.comments}
            id={post.id}
          />
          <PostAction myUserInfo={myUserInfo} reactions0={post.reactions} comments={post.comments} id={post.id} />
        </div>
      ))}
    </div>
  );
}