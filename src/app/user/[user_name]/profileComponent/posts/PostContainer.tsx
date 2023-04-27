'use client'

import PostFormPopUp from "@/app/(home)/components/postFormPopup/PostFormPopUp";
import ContextProvider from "@/app/post/[...post_id]/PostContext";
import PostActions from "@/app/post/[...post_id]/components/actions/PostActions";
import PostContent from "@/app/post/[...post_id]/components/post/PostContent";
import { formatDuration } from "@/components/utils/formatData";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { collection, getCountFromServer, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';

async function fetchProfilePosts(profileUsername: string, lastKey: any) {
  const postQuery = query(collection(db, "posts"), where("authorName", "==", profileUsername), orderBy("timestamp", "desc"), startAfter(lastKey), limit(5))
  const querySnapshot = await getDocs(postQuery)

  const fetchedPosts = querySnapshot.docs.map((doc: any) => {
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

export default function ProfilePosts({ myUserInfo, profileUsername }: { myUserInfo: UserInfo, profileUsername?: string }) {
  const [posts, setPosts] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})

  const inputRef = useRef()

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    if (!profileUsername) return;

    const fetchedPosts = await fetchProfilePosts(profileUsername, lastKey)

    if (fetchedPosts.lastKey) {
      setPosts([...posts, ...fetchedPosts.posts]);
      setLastKey(fetchedPosts.lastKey)
    } else {
      setHasMore(false)
    }
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchPosts}
      hasMore={hasMore}
      loader={
        <div key={0} className="animate-pulse mb-4">
          <PostContent />
          <PostActions />
        </div>
      }
      refreshFunction={() => console.log("refresh")}
      pullDownToRefresh={true}
      className="flex flex-col"
    >
      {posts.map((post: any) => (
        <ContextProvider
          key={post.id}
          myUserInfo={myUserInfo}
          content={post.content}
          authorName={post.authorName}
          animeID={post.post_anime_data?.anime_id}
          postId={post.id}
          postData={post}
        >
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
              watchingProgress={post?.post_anime_data?.watching_progress}
              episodesSeen={post?.post_anime_data?.episodes_seen}
              episodesTotal={post?.post_anime_data?.total_episodes}
              tag={!!post?.post_anime_data?.tag ? post?.post_anime_data?.tag : post?.tag}
              score={post?.post_anime_data?.score}
              postId={post.id}
            />
            <PostActions
              myUserInfo={myUserInfo}
              malAuthCode={myUserInfo?.mal_connect?.accessToken}
              animeID={post?.post_anime_data?.anime_id}
              reactions={post.reactions}
              commentCountPromise={fetchCommentCount(post.id)}
              comments={post.lastComment ? [post.lastComment] : []}
              showTopReaction={false}
            />
          </div>
        </ContextProvider>
      ))}

    </InfiniteScroll>
  );
}
