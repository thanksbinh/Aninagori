"use client"

import PostContent from "@/app/post/[...post_id]/components/post/PostContent";
import { db } from "@/firebase/firebase-app";
import { collection, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ContextProvider from "../../post/[...post_id]/PostContext";
import PostAction from "../../post/[...post_id]/components/post/PostAction";
import { fetchAllPosts, fetchFriendPosts, getAnimePreferenceScore } from "./functions/recommendPost";

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount
}

export default function Posts({ myUserInfo, myFriendList, myAnimeList, postPreference }: any) {
  const [posts, setPosts] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})
  const [friendPostIds, setFriendPostIds] = useState<string[]>(["0"])
  const [myFriendUsernameList, setMyFriendUsernameList] = useState<string[]>([])
  const [hasMoreFriendPosts, setHasMoreFriendPosts] = useState(myFriendList?.length > 0)



  useEffect(() => {
    myFriendList && setMyFriendUsernameList(myFriendList.map((friend: any) => friend.username))
  }, [myFriendList])

  function filterPosts(fetchedPosts: any) {
    return (fetchedPosts.posts[0].authorName === myUserInfo.username) || //isFromMe
      (myFriendUsernameList?.includes(fetchedPosts.posts[0].authorName)) || //isFromMyFriend
      (Math.random() * 10 < getAnimePreferenceScore(myAnimeList, postPreference?.animeList, fetchedPosts.posts[0].post_anime_data?.anime_id)) //gachaTrue
  }

  async function fetchPosts() {
    if (!postPreference) return

    let fetchedPosts
    if (hasMoreFriendPosts) {
      fetchedPosts = await fetchFriendPosts(myUserInfo, myFriendUsernameList, postPreference.last_view, lastKey)

      if (fetchedPosts.posts.length) {
        setFriendPostIds([...friendPostIds, ...fetchedPosts.posts.map((post: any) => post.id)])
      } else {
        setHasMoreFriendPosts(false)
        fetchedPosts = await fetchAllPosts(friendPostIds, {})
      }
    } else {
      fetchedPosts = await fetchAllPosts(friendPostIds, lastKey)
    }

    if (fetchedPosts.lastKey) {
      if (filterPosts(fetchedPosts)) {
        setPosts([...posts, ...fetchedPosts.posts])
      }
      setLastKey(fetchedPosts.lastKey)
    } else {
      setHasMore(false)
    }
  }

  return (
    <InfiniteScroll
      loadMore={fetchPosts}
      hasMore={hasMore}
      loader={
        <div key={0} className="animate-pulse mb-4">
          <PostContent />
          <PostAction />
        </div>
      }
      initialLoad={true}
      className="flex flex-col"
    >
      {posts.map((post: any) => {
        return ((
          <ContextProvider
            key={post.id}
            myUserInfo={myUserInfo}
            content={post.content}
            authorName={post.authorName}
            animeID={post.post_anime_data?.anime_id}
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
              watchingProgress={post?.post_anime_data?.watching_progress}
              episodesSeen={post?.post_anime_data?.episodes_seen}
              episodesTotal={post?.post_anime_data?.total_episodes}
              score={post?.post_anime_data?.score}
              tag={!!post?.post_anime_data?.tag ? post?.post_anime_data?.tag : post?.tag}
              postId={post.id}
            />
            <PostAction
              reactions={post.reactions}
              myUserInfo={myUserInfo}
              animeName={post?.post_anime_data?.anime_name}
              malAuthCode={myUserInfo?.mal_connect?.accessToken}
              animeID={post?.post_anime_data?.anime_id}
              commentCountPromise={fetchCommentCount(post.id)}
              comments={post.lastComment ? [post.lastComment] : []}
            />
            <div className="mb-4"></div>
          </ContextProvider>
        ))


      })}
    </InfiniteScroll>
  )
}
