'use client'

import ContextProvider from "@/app/post/[...post_id]/PostContext";
import PostActions from "@/app/post/[...post_id]/components/actions/PostActions";
import PostContent from "@/app/post/[...post_id]/components/post/PostContent";
import { formatDuration } from "@/components/utils/formatData";
import { db } from "@/firebase/firebase-app";
import { PostInfo } from "@/global/Post.types";
import { UserInfo } from "@/global/UserInfo.types";
import { collection, getCountFromServer, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';

async function fetchProfilePosts(profileUsername: string, lastKey: any) {
  const postQuery = query(collection(db, "posts"), where("authorName", "==", profileUsername), orderBy("timestamp", "desc"), startAfter(lastKey), limit(2))
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
    }
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
  const [posts, setPosts] = useState<PostInfo[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})

  useEffect(() => {
    fetchPosts()
  }, [])

  async function addMyAnimeStatus(posts: PostInfo[]) {
    posts.forEach((post) => {
      if (!post.post_anime_data) return;

      const anime = myUserInfo.myAnimeList?.find((anime) => anime.node.id === post.post_anime_data?.anime_id)
      if (anime) post.post_anime_data.my_status = anime.list_status.status
    })
  }

  async function fetchPosts() {
    if (!profileUsername) return;

    const fetchedPosts = await fetchProfilePosts(profileUsername, lastKey)

    if (fetchedPosts.lastKey) {
      addMyAnimeStatus(fetchedPosts.posts)
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
      {posts.map((post) => (
        <ContextProvider
          key={post.id}
          myUserInfo={myUserInfo}
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
              tag={post?.tag?.filter((tag: string) => !(post?.post_anime_data?.my_status === "completed" && tag === "Spoiler"))}
              score={post?.post_anime_data?.score}
              postId={post.id}
            />
            <PostActions
              commentCountPromise={fetchCommentCount(post.id)}
              comments={post.lastComment ? [post.lastComment] : []}
              showTopReaction={false}
              animeStatus={post?.post_anime_data?.my_status}
            />
          </div>
        </ContextProvider>
      ))}

    </InfiniteScroll>
  );
}
