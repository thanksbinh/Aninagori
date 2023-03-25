'use client'

import { getDocs, collection, query, orderBy, limit, getCountFromServer, where, startAfter } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import PostAction from "../../post/[...post_id]/components/post/PostAction";
import { formatDuration } from "@/components/utils/formatDuration";
import { UserInfo } from "@/global/UserInfo.types";
import ContextProvider from "../../post/[...post_id]/components/context/PostContext";
import PostContent from "@/app/post/[...post_id]/components/postContent/PostContent";
import { useState } from "react"
import InfiniteScroll from 'react-infinite-scroller';

async function fetchPosts({ username, lastKey }: { username?: string, lastKey?: any }) {
  const q = (username) ?
    query(collection(db, "posts"), where("authorName", "==", username), orderBy("timestamp", "desc"), startAfter(lastKey), limit(1)) :
    query(collection(db, "posts"), orderBy("timestamp", "desc"), startAfter(lastKey), limit(1))

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

  return {
    posts: fetchedPosts,
    lastKey: querySnapshot.docs[querySnapshot.docs.length - 1]
  };
}

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount;
}

export default function Posts({ myUserInfo, profileUsername }: { myUserInfo: UserInfo, profileUsername?: string }) {
  const [posts, setPosts] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})

  async function fetchData() {
    const fetchedPosts = await fetchPosts({ username: profileUsername, lastKey: lastKey })
    setPosts([...posts, ...fetchedPosts.posts]);
    (fetchedPosts.lastKey) ? setLastKey(fetchedPosts.lastKey) : setHasMore(false)
  }

  return (
    <InfiniteScroll
      loadMore={fetchData}
      hasMore={hasMore}
      loader={<div className="animate-pulse mb-4"><PostContent /><PostAction /></div>}
      initialLoad={true}
      className="flex flex-col"
    >
      {posts.map((post: any) => (
        <ContextProvider
          key={post.id}
          myUserInfo={myUserInfo}
          content={post.content}
          authorName={post.authorName}
          postId={post.id}
        >
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
          <div className="mb-4"></div>
        </ContextProvider>
      ))}
    </InfiniteScroll>
  );
}


