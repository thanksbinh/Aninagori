"use client"

import PostContent from "@/app/post/[...post_id]/components/post/PostContent"
import { db } from "@/firebase/firebase-app"
import { collection, getCountFromServer } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import ContextProvider from "../../post/[...post_id]/PostContext"
import PostAction from "../../post/[...post_id]/components/post/PostAction"
import { fetchAllPosts, fetchFriendPosts, getAnimePreferenceScore } from "../functions/recommendPost"
import { HomeContext } from "../HomeContext"

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount
}

export default function Posts({ myFriendList, myAnimeList, postPreference }: any) {
  const [posts, setPosts] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})
  const [friendPostIds, setFriendPostIds] = useState<string[]>(["0"])
  const [myFriendUsernameList, setMyFriendUsernameList] = useState<string[]>([])
  const [hasMoreFriendPosts, setHasMoreFriendPosts] = useState(myFriendList?.length > 0)
  const { myUserInfo } = useContext(HomeContext)

  useEffect(() => {
    const logo = document.getElementById("logo")

    logo?.addEventListener("click", () => refreshPosts())
    return logo?.removeEventListener("click", () => refreshPosts())
  }, [])

  // Init first posts
  useEffect(() => {
    if (posts.length < 2) {
      fetchPosts()
    }
  }, [posts])

  // Refresh posts when router.refresh() is called
  useEffect(() => {
    if (myFriendUsernameList.length == myFriendList.length) {
      refreshPosts()
    } else {
      setMyFriendUsernameList(myFriendList.map((friend: any) => friend.username))
    }
  }, [myFriendList])

  async function refreshPosts() {
    setPosts([])
    setLastKey({})
    setHasMore(true)
    setHasMoreFriendPosts(true)
    setFriendPostIds(["0"])
  }

  function filterPosts(fetchedPosts: any) {
    if (!postPreference) return fetchedPosts

    return fetchedPosts.filter((post: any) => {
      // isFromMe or isFromMyFriend
      if (post.authorName === myUserInfo.username || myFriendUsernameList?.includes(post.authorName)) {
        return true
      }

      // isFromOther and isRecommended
      const preferenceScore = getAnimePreferenceScore(myAnimeList, postPreference.animeList, post.post_anime_data?.anime_id)
      return (Math.random() * 10 < preferenceScore) && (post.videoUrl !== "" || post.imageUrl !== "")
    })
  }

  async function fetchFriendsPosts() {
    const fetchedPosts = await fetchFriendPosts(myUserInfo, myFriendUsernameList, postPreference.last_view, lastKey)

    if (fetchedPosts.posts.length) {
      setFriendPostIds([...friendPostIds, ...fetchedPosts.posts.map((post: any) => post.id)])
      setLastKey(fetchedPosts.lastKey)
      setPosts([...posts, ...fetchedPosts.posts])
      return;
    }
    else {
      setHasMoreFriendPosts(false)
    }
  }

  async function fetchPosts() {
    // fetch posts from friends
    if (hasMoreFriendPosts) fetchFriendsPosts()

    // fetch posts from other users
    let copyLastKey = lastKey
    while (true) {
      const fetchedPosts = await fetchAllPosts(friendPostIds, copyLastKey)

      if (!fetchedPosts.lastKey || !fetchedPosts.posts.length) {
        setHasMore(false)
        break;
      }

      copyLastKey = fetchedPosts.lastKey
      setLastKey(fetchedPosts.lastKey)

      fetchedPosts.posts = filterPosts(fetchedPosts.posts)
      setPosts([...posts, ...fetchedPosts.posts])

      if (fetchedPosts.posts.length) break;
    }
  }

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={
          <div key={0} className="animate-pulse mb-4">
            <PostContent />
            <PostAction />
          </div>
        }
        refreshFunction={() => console.log("refresh")}
        pullDownToRefresh={true}
        className="flex flex-col"
      >
        {posts.map((post: any) => {
          return (
            <div className="flex justify-center mb-4">
              <ContextProvider
                key={post.id}
                myUserInfo={myUserInfo}
                content={post.content}
                authorName={post.authorName}
                animeID={post.post_anime_data?.anime_id}
                postId={post.id}
                postData={post}
              >
                <div className="w-[72%]">
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
                    reactions={post.reactions}
                  />
                  <PostAction
                    reactions={post.reactions}
                    myUserInfo={myUserInfo}
                    malAuthCode={myUserInfo?.mal_connect?.accessToken}
                    animeID={post?.post_anime_data?.anime_id}
                    commentCountPromise={fetchCommentCount(post.id)}
                    comments={post.lastComment ? [post.lastComment] : []}
                  />
                </div>
              </ContextProvider>
            </div>
          )
        })}
      </InfiniteScroll>
    </>
  )
}
