'use client'

import PostContent from "@/app/post/[...post_id]/components/postContent/PostContent";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "@/global/UserInfo.types";
import { collection, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ContextProvider from "../../post/[...post_id]/components/context/PostContext";
import PostAction from "../../post/[...post_id]/components/post/PostAction";
import { fetchAllData, fetchFriendData, fetchMyData, getFriendList, getLastView, updateLastView } from "./recommendPost";

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount;
}

export default function Posts({ myUserInfo, profileUsername }: { myUserInfo: UserInfo, profileUsername?: string }) {
  const [posts, setPosts] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})
  const [friendPostIds, setFriendPostIds] = useState<string[]>(["0"])
  const [friendList, setFriendList] = useState<string[]>([])
  const [hasMoreFriendPosts, setHasMoreFriendPosts] = useState(true)
  const [lastView, setLastView] = useState<any>()

  useEffect(() => {
    async function fetchData() {
      const [myFriendList, lastViewData] = await Promise.all([
        getFriendList(myUserInfo),
        getLastView(myUserInfo)
      ])
      updateLastView(myUserInfo)

      setFriendList(myFriendList)
      setLastView(lastViewData)
      setHasMoreFriendPosts(myFriendList?.length > 0)
    }

    if (!profileUsername) fetchData()
  }, [])

  async function fetchPosts() {
    let fetchedPosts;

    if (profileUsername) {
      fetchedPosts = await fetchMyData(profileUsername, lastKey)
    }
    else if (hasMoreFriendPosts) {
      if (!lastView) return;

      fetchedPosts = await fetchFriendData(myUserInfo, friendList, lastView, lastKey)

      if (fetchedPosts.posts.length) {
        setFriendPostIds([...friendPostIds, fetchedPosts.posts[0].id])
      }
      else {
        fetchedPosts = await fetchAllData(friendPostIds, {})
        setHasMoreFriendPosts(false)
      }
    }
    else {
      fetchedPosts = await fetchAllData(friendPostIds, lastKey)
    }

    setPosts([...posts, ...fetchedPosts.posts]);
    (fetchedPosts.lastKey) ? setLastKey(fetchedPosts.lastKey) : setHasMore(false)
  }

  return (
    <InfiniteScroll
      loadMore={fetchPosts}
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


