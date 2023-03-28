import { formatDuration } from "@/components/utils/formatDuration";
import { db } from "@/firebase/firebase-app";
import { getUserInfo } from "@/global/getUserInfo";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { getServerSession } from "next-auth";
import ContextProvider from "./components/context/PostContext";
import PostAction from "./components/post/PostAction";
import PostContent from "./components/postContent/PostContent";

async function fetchPost(postId: string) {
  if (!postId) return {};

  const postRef = doc(db, "posts", postId)
  const postDoc = await getDoc(postRef)
  if (!postDoc.exists()) return;
  const fetchedPost = {
    ...postDoc.data(),
    lastComment: postDoc.data().lastComment && {
      ...postDoc.data().lastComment,
      timestamp: formatDuration(new Date().getTime() - postDoc.data().lastComment.timestamp.toDate().getTime()),
    },
    timestamp: formatDuration(new Date().getTime() - postDoc.data().timestamp.toDate().getTime()),
    id: postDoc.id
  } as any

  return fetchedPost;
}

async function fetchComments(postId: string) {
  if (!postId) return [];

  const commentsRef = collection(db, "posts", postId, "comments")
  const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"))

  const commentsDocs = (await getDocs(commentsQuery)).docs

  const comments = commentsDocs.map(doc => {
    return {
      ...doc.data(),
      replies: doc.data().replies?.sort((a: any, b: any) => a.timestamp - b.timestamp).map((reply: any) => {
        return {
          ...reply,
          timestamp: formatDuration(new Date().getTime() - new Date(reply.timestamp.seconds * 1000).getTime()),
          realTimestamp: reply.timestamp.toJSON(),
          parentId: doc.id
        }
      }),
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id
    } as any
  })

  return comments;
}

// Todo: realtime reactions/ comments
async function Post({ params }: { params: { post_id: string[] } }) {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId) || { username: "", id: "", image: "" }

  const [fetchedPost, fetchedComments] = await Promise.all([
    fetchPost(params.post_id[0]),
    fetchComments(params.post_id[0])
  ])

  return (
    <div className='flex justify-center pt-10'>
      <div className="flex flex-col lg:w-2/5 w-3/5 mt-8 mb-2">
        <ContextProvider
          myUserInfo={myUserInfo}
          content={fetchedPost.content || ""}
          authorName={fetchedPost.authorName}
          animeID={fetchedPost?.post_anime_data?.anime_id}
          postId={fetchedPost.id}
        >
          <PostContent
            authorName={fetchedPost.authorName}
            avatarUrl={fetchedPost.avatarUrl}
            timestamp={fetchedPost.timestamp}
            content={fetchedPost.content}
            imageUrl={fetchedPost.imageUrl}
            videoUrl={fetchedPost.videoUrl}
            animeID={fetchedPost?.post_anime_data?.anime_id}
            animeName={fetchedPost?.post_anime_data?.anime_name}
            watchingProgress={fetchedPost?.post_anime_data?.watching_progress}
            episodesSeen={fetchedPost?.post_anime_data?.episodes_seen}
            episodesTotal={fetchedPost?.post_anime_data?.total_episodes}
            tag={fetchedPost?.post_anime_data?.tag}
            postId={fetchedPost.id}
          />
          <PostAction
            reactions={fetchedPost.reactions}
            commentCountPromise={fetchedComments.length}
            comments={fetchedComments}
            focusedComment={(params.post_id.length > 1) ? params.post_id[2] : undefined}
          />
        </ContextProvider>
      </div>
    </div>
  )
}

export default Post;