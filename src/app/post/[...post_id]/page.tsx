import { PostContent } from "@/components";
import ContextProvider from "@/components/post/context/PostContext";
import PostAction from "@/components/post/PostAction";
import { formatDuration } from "@/components/utils/formatDuration";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/types";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { getServerSession } from "next-auth";

// Todo: Remove UserInfo fetch duplication
async function getUserInfo(userId: string): Promise<UserInfo | undefined> {
  if (!userId) return;

  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      "id": docSnap.id,
      "username": docSnap.data().username,
      "image": docSnap.data().image,
      "is_admin": docSnap.data().is_admin,
      "is_banned": docSnap.data().is_banned,
    }
  } else {
    console.log("No such document in page/getUserInfo()!");
  }
}

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
          content={fetchedPost.content}
          authorName={fetchedPost.authorName}
          postId={fetchedPost.id}
        >
          <PostContent
            authorName={fetchedPost.authorName}
            avatarUrl={fetchedPost.avatarUrl}
            timestamp={fetchedPost.timestamp}
            content={fetchedPost.content}
            imageUrl={fetchedPost.imageUrl}
            videoUrl={fetchedPost.videoUrl}
            postId={fetchedPost.id}
          />
          <PostAction
            reactions={fetchedPost.reactions}
            commentCountPromise={fetchedComments.length as any}
            comments={fetchedComments}
          />
        </ContextProvider>
      </div>
    </div>
  )
}

export default Post;