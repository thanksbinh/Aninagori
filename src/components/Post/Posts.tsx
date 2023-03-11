import Post, { PostProps } from "./Post";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";

async function fetchData() {
    const q = query(collection(db, "posts"), orderBy("timeStamp", "desc"));
    const fetchedPosts: PostProps[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const post = {
        ...doc.data(),
        time: doc.data().timeStamp.toDate().toString(),
      } as PostProps;
      fetchedPosts.push(post);
    });
    return fetchedPosts
}  

export default async function Posts() {
  const posts: PostProps[] = await fetchData();

  return (
    <div className="flex flex-col">
      {posts.map((post) => (      
        <Post
          authorName={post.authorName}
          avatarUrl={post.avatarUrl}
          time={post.time}
          content={post.content}
          imageUrl={post.imageUrl}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
    </div>
  );
}