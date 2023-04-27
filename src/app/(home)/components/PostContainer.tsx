"use client"

import PostContent from "@/app/post/[...post_id]/components/post/PostContent"
import { db } from "@/firebase/firebase-app"
import { collection, getCountFromServer } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import ContextProvider from "../../post/[...post_id]/PostContext"
import PostActions from "../../post/[...post_id]/components/actions/PostActions"
import { HomeContext } from "../HomeContext"
import { fetchAllPosts, fetchFriendPosts, getAnimePreferenceScore } from "../functions/recommendPost"

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount
}

export default function Posts({ myFriendList, myAnimeList, postPreference }: any) {
  const { myUserInfo } = useContext(HomeContext)

  const [posts, setPosts] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})
  const [friendPostIds, setFriendPostIds] = useState<string[]>(["0"])
  const [hasMoreFriendPosts, setHasMoreFriendPosts] = useState(myFriendList?.length > 0)

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
    refreshPosts()
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
      if (post.authorName === myUserInfo.username || myFriendList?.find((friend: any) => friend.username === post.authorName)) {
        return true
      }

      // isFromOther and isRecommended
      const preferenceScore = getAnimePreferenceScore(myAnimeList, postPreference.animeList, post.post_anime_data?.anime_id)
      return (Math.random() * 10 < preferenceScore) && (post.videoUrl !== "" || post.imageUrl !== "")
    })
  }

  function addMyAnimeStatus(posts: any) {
    posts.forEach((post: any) => {
      const anime = myAnimeList?.find((anime: any) => anime.node.id === post.post_anime_data?.anime_id)
      if (anime) post.post_anime_data.my_status = anime.list_status.status
      console.log(post, anime)
    })
  }

  async function fetchPosts() {
    // fetch posts from friends
    if (myFriendList.length && hasMoreFriendPosts) {
      const fetchedPosts = await fetchFriendPosts(myUserInfo, myFriendList.map((friend: any) => friend.username), postPreference.last_view)

      if (fetchedPosts.posts.length) {
        setFriendPostIds([...friendPostIds, ...fetchedPosts.posts.map((post: any) => post.id)])
        addMyAnimeStatus(fetchedPosts.posts)
        setPosts(fetchedPosts.posts)
        return;
      }
      else {
        setHasMoreFriendPosts(false)
      }
    }

    // fetch posts from other users
    let copyLastKey = lastKey || {}
    while (true) {
      const fetchedPosts = await fetchAllPosts(friendPostIds, copyLastKey)

      if (!fetchedPosts.lastKey || !fetchedPosts.posts.length) {
        setHasMore(false)
        break;
      }

      copyLastKey = fetchedPosts.lastKey
      setLastKey(fetchedPosts.lastKey)

      fetchedPosts.posts = filterPosts(fetchedPosts.posts)
      addMyAnimeStatus(fetchedPosts.posts)
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
          <div key={0} className="flex justify-center animate-pulse mb-4">
            <div className="w-[72%] relative">
              <PostContent />
              <PostActions />
            </div>
          </div>
        }
        refreshFunction={() => console.log("refresh")}
        pullDownToRefresh={true}
        className="flex flex-col"
      >
        {posts.map((post: any) => {
          return (
            <div key={post.id} className="flex justify-center mb-4">
              <ContextProvider
                myUserInfo={myUserInfo}
                content={post.content}
                authorName={post.authorName}
                animeID={post.post_anime_data?.anime_id}
                postId={post.id}
                postData={post}
              >
                <div className="w-[72%] relative">
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
                  <PostActions
                    reactions={post.reactions}
                    commentCountPromise={fetchCommentCount(post.id)}
                    comments={post.lastComment ? [post.lastComment] : []}
                    showTopReaction={true}
                    animeStatus={post?.post_anime_data?.my_status}
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
