import { getDocs, collection, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/firebase/firebase-app"
import { UserInfo } from "../../global/types"
import { formatDuration } from "../utils/formatDuration"
import { Suspense } from "react"
import ContextProvider from "./context/PostContext"
import PostContent from "./postContent/PostContent"
import PostAction from "./PostAction"
import Post from "./Post"

async function fetchPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10))
  const querySnapshot = await getDocs(q)
  const fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      lastComment: doc.data().lastComment && {
        ...doc.data().lastComment,
        timestamp: formatDuration(new Date().getTime() - doc.data().lastComment.timestamp.toDate().getTime()),
      },
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id,
    } as any
  })

  return fetchedPosts
}

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const fetchedPosts = await fetchPosts()

  return (
    <div className="flex flex-col">
      {fetchedPosts.map((post: any) => (
        <div key={post.id}>
          <ContextProvider key={post.id} myUserInfo={myUserInfo} authorName={post.authorName} postId={post.id}>
            <Suspense
              fallback={
                <div className="mb-4">
                  <PostContent content={"Loading..."} />
                  <PostAction />
                </div>
              }
            >
              {/* @ts-expect-error Server Component */}
              <Post
                authorName={post.authorName}
                avatarUrl={post.avatarUrl}
                timestamp={post.timestamp}
                content={post.content}
                imageUrl={post.imageUrl}
                videoUrl={post.videoUrl}
                reactions={post.reactions}
                lastComment={post.lastComment}
                postAnimeData={post?.post_anime_data}
                id={post.id}
              />
            </Suspense>
          </ContextProvider>
        </div>
      ))}
    </div>
  )
}
