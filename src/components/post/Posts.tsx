import { getDocs, collection, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "../../global/types";
import { formatDuration } from "../utils/formatDuration";
import { Suspense } from "react";
import ContextProvider from "./context/PostContext";
import { Post } from "./Post";
import PostContent from "./PostContent";
import PostAction from "./PostAction";

async function fetchPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10));
  const querySnapshot = await getDocs(q);
  const fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id
    } as any
  });

  return fetchedPosts;
}

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const fetchedPosts = await fetchPosts()

  return (
    <div className="flex flex-col">
      {fetchedPosts.map((post) => (
        <ContextProvider key={post.id} myUserInfo={myUserInfo} authorName={post.authorName} postId={post.id}>
          <Suspense fallback={<div className="mb-4"><PostContent content={"Loading..."} /><PostAction /></div>}>
            {/* @ts-expect-error Server Component */}
            <Post
              authorName={post.authorName}
              avatarUrl={post.avatarUrl}
              timestamp={post.timestamp}
              content={post.content}
              imageUrl={post.imageUrl}
              videoUrl={post.videoUrl}
              reactions={post.reactions}
              id={post.id}
            />
          </Suspense>
        </ContextProvider>
      ))}
    </div >
  );
}


