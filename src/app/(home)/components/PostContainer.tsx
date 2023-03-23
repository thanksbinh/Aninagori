import { getDocs, collection, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { Suspense } from "react";
import PostAction from "../../post/[...post_id]/components/post/PostAction";
import { formatDuration } from "@/components/utils/formatDuration";
import { UserInfo } from "@/global/UserInfo.types";
import ContextProvider from "../../post/[...post_id]/components/context/PostContext";
import PostContent from "@/app/post/[...post_id]/components/postContent/PostContent";

async function fetchPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(2));
  const querySnapshot = await getDocs(q);
  const fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      lastComment: doc.data().lastComment && {
        ...doc.data().lastComment,
        timestamp: formatDuration(new Date().getTime() - doc.data().lastComment.timestamp.toDate().getTime()),
      },
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id
    } as any
  });

  return fetchedPosts;
}

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount;
}

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const fetchedPosts = await fetchPosts()

  return (
    <div className="flex flex-col">
      {fetchedPosts.map((post) => (
        <ContextProvider
          key={post.id}
          myUserInfo={myUserInfo}
          content={post.content}
          authorName={post.authorName}
          postId={post.id}
        >
          <Suspense fallback={<div className="mb-4"><PostContent content={"Loading..."} /><PostAction /></div>}>
            <div className="mb-4">
              <PostContent
                authorName={post.authorName}
                avatarUrl={post.avatarUrl}
                timestamp={post.timestamp}
                content={post.content}
                imageUrl={post.imageUrl}
                videoUrl={post.videoUrl}
                animeID={post?.post_anime_data?.anime_id}
                animeName={post?.post_anime_data?.anime_name}
                watchingProgess={post?.post_anime_data?.watching_progress}
                episodesSeen={post?.post_anime_data?.episodes_seen}
                episodesTotal={post?.post_anime_data?.total_episodes}
                tag={post?.post_anime_data?.tag}
                postId={post.id}
              />
              <PostAction
                reactions={post.reactions}
                commentCountPromise={fetchCommentCount(post.id)}
                comments={post.lastComment ? [post.lastComment] : []}
              />
            </div>
          </Suspense>
        </ContextProvider>
      ))}
    </div >
  );
}

