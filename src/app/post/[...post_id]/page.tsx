import { formatDuration } from "@/components/utils/formatData";
import { getUserInfo } from "@/components/utils/getUserInfo";
import { db } from "@/firebase/firebase-app";
import { AnimeInfo } from "@/global/AnimeInfo.types";
import { CommentInfo, PostInfo } from "@/global/Post.types";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ContextProvider from "./PostContext";
import PostActions from "./components/actions/PostActions";
import PostContent from "./components/post/PostContent";

async function fetchPost(postId: string): Promise<PostInfo> {
  const postRef = doc(db, "posts", postId)
  const postDoc = await getDoc(postRef)
  if (!postDoc.exists()) {
    notFound()
  }

  const fetchedPost = {
    ...postDoc.data() as any,
    lastComment: postDoc.data().lastComment && {
      ...postDoc.data().lastComment,
      timestamp: formatDuration(new Date().getTime() - postDoc.data().lastComment.timestamp.toDate().getTime()),
    },
    timestamp: formatDuration(new Date().getTime() - postDoc.data().timestamp.toDate().getTime()),
    id: postDoc.id
  }

  return fetchedPost;
}

async function fetchComments(postId: string): Promise<CommentInfo[]> {
  if (!postId) return [];

  const commentsRef = collection(db, "posts", postId, "comments")
  const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"))

  const commentsDocs = (await getDocs(commentsQuery)).docs

  const comments = commentsDocs.map(doc => {
    return {
      ...doc.data() as any,
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
    }
  })

  return comments;
}

async function Post({ params }: { params: { post_id: string[] } }) {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId) || { username: "", id: "", image: "" }

  const [post, fetchedComments, myAnimeList] = await Promise.all([
    fetchPost(params.post_id[0]),
    fetchComments(params.post_id[0]),
    getDoc(doc(db, "myAnimeList", myUserInfo.username)).then(doc => doc.data()?.animeList)
  ])

  const myAnimeStatus = myAnimeList?.find((anime: AnimeInfo) => anime.node.id === post.post_anime_data?.anime_id)?.list_status.status

  return (
    <div className='flex justify-center pt-10'>
      <div className="flex flex-col lg:w-2/5 w-3/5 mt-8 mb-2">
        <ContextProvider
          postData={post}
          myUserInfo={myUserInfo}
          content={post.content || ""}
          authorName={post.authorName}
          animeID={post.post_anime_data?.anime_id}
          postId={post.id}
        >
          <div className="w-full relative">
            <PostContent
              authorName={post.authorName}
              avatarUrl={post.avatarUrl}
              timestamp={post.timestamp}
              content={post.content}
              imageUrl={post.imageUrl}
              videoUrl={post.videoUrl}
              animeID={post.post_anime_data?.anime_id}
              animeName={post.post_anime_data?.anime_name}
              watchingProgress={post.post_anime_data?.watching_progress}
              episodesSeen={post.post_anime_data?.episodes_seen}
              episodesTotal={post.post_anime_data?.total_episodes}
              score={post.post_anime_data?.score}
              tag={post?.tag?.filter((tag: string) => !(myAnimeStatus === "completed" && tag === "Spoiler"))}
              postId={post.id}
            />
            <PostActions
              reactions={post.reactions}
              commentCountPromise={fetchedComments.length}
              comments={fetchedComments}
              focusedComment={(params.post_id.length > 1) ? params.post_id[2] : undefined}
              showTopReaction={true}
              animeStatus={myAnimeStatus}
            />
          </div>
        </ContextProvider>
      </div>
    </div>
  )
}

export default Post;