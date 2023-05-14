"use client"

import PostContent from "@/app/post/[...post_id]/components/post/PostContent"
import { db } from "@/firebase/firebase-app"
import { AnimeInfo } from "@/global/AnimeInfo.types"
import { collection, getCountFromServer } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import ContextProvider from "../../post/[...post_id]/PostContext"
import PostActions from "../../post/[...post_id]/components/actions/PostActions"
import { HomeContext } from "../HomeContext"
import { fetchAllPosts, fetchFriendPosts, getAnimePreferenceScore } from "../functions/recommendPost"
import { FriendInfo } from "@/global/FriendInfo.types"
import { PostInfo } from "@/global/Post.types"
import { postPreference } from "@/global/PostPreference.types"

type PostsProps = {
  myFriendList: FriendInfo[]
  myAnimeList: AnimeInfo[]
  postPreference: postPreference
}

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount
}

export default function Posts({ myFriendList, myAnimeList, postPreference }: PostsProps) {
  const { myUserInfo } = useContext(HomeContext)

  const [posts, setPosts] = useState<PostInfo[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})
  const [friendPostIds, setFriendPostIds] = useState<string[]>(["0"])
  const [hasMoreFriendPosts, setHasMoreFriendPosts] = useState(myFriendList?.length > 0)
  const [hiddenPosts, setHiddenPosts] = useState<string[]>(postPreference?.hiddenPosts || [])

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
  }, [postPreference])

  async function refreshPosts() {
    setPosts([])
    setLastKey({})
    setHasMore(true)
    setHasMoreFriendPosts(true)
    setFriendPostIds(["0"])
  }

  function filterPosts(fetchedPosts: PostInfo[]) {
    if (!postPreference) return fetchedPosts

    return fetchedPosts.filter((post: PostInfo) => {
      if (postPreference?.hiddenPosts?.includes(post.id)) {
        return false
      }

      // isFromMe or isFromMyFriend
      if (post.authorName === myUserInfo.username || myFriendList?.find((friend: FriendInfo) => friend.username === post.authorName)) {
        return true
      }

      // Todo: more options on post with no anime reference
      if (!post.post_anime_data?.anime_id) {
        return true
      }

      // isFromOther and isRecommended
      const preferenceScore = getAnimePreferenceScore(myAnimeList, postPreference.animeList, post.post_anime_data?.anime_id)
      return (Math.random() * 10 < preferenceScore) && (post.videoUrl !== "" || post.imageUrl !== "")
    })
  }

  function addMyAnimeStatus(posts: PostInfo[]) {
    posts.forEach((post: PostInfo) => {
      if (!post.post_anime_data) return

      const anime = myAnimeList?.find((anime: AnimeInfo) => anime.node.id === post.post_anime_data?.anime_id)
      if (anime) post.post_anime_data.my_status = anime.list_status.status
    })
  }

  async function fetchPosts() {
    // fetch posts from friends
    if (myFriendList?.length && hasMoreFriendPosts) {
      const fetchedPosts = await fetchFriendPosts(myUserInfo, myFriendList.map((friend: FriendInfo) => friend.username), postPreference.last_view)

      if (fetchedPosts.posts.length) {
        setFriendPostIds([...friendPostIds, ...fetchedPosts.posts.map((post: PostInfo) => post.id)])
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
        {posts
          .filter((post: PostInfo) => !hiddenPosts.includes(post.id))
          .map((post: PostInfo) => {
            return (
              <div key={post.id} className={`flex justify-center mb-4`}>
                <ContextProvider
                  myUserInfo={myUserInfo}
                  postData={post}
                  hidePost={(postId: string) => setHiddenPosts([...hiddenPosts, postId])}
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
                      tag={post?.tag?.filter((tag: string) => !(post?.post_anime_data?.my_status === "completed" && tag === "Spoiler"))}
                      postId={post.id}
                    />
                    <PostActions
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
