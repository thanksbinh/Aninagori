"use client"
import { getDocs, collection, query, orderBy, limit, getCountFromServer, where } from "firebase/firestore"
import { db } from "@/firebase/firebase-app"
import { Suspense } from "react"
import PostAction from "../../post/[...post_id]/components/post/PostAction"
import { formatDuration } from "@/components/utils/formatDuration"
import { UserInfo } from "@/global/UserInfo.types"
import ContextProvider from "../../post/[...post_id]/components/context/PostContext"
import PostContent from "@/app/post/[...post_id]/components/postContent/PostContent"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import {
  fetchAllPosts,
  fetchFriendPosts,
  fetchMyAnimeList,
  fetchPostPreference,
  getAnimePreferenceScore,
  getFriendList,
  updateLastView,
} from "./recommendPost"

async function fetchPosts(username?: string) {
  const q = username
    ? query(collection(db, "posts"), where("authorName", "==", username), orderBy("timestamp", "desc"), limit(3))
    : query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(3))

  const querySnapshot = await getDocs(q)
  const fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      lastComment: doc.data().lastComment && {
        ...doc.data().lastComment,
        timestamp: formatDuration(new Date().getTime() - doc.data().lastComment.timestamp.toDate().getTime()),
      },
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id,
    } as any
  })

  return fetchedPosts
}

async function fetchCommentCount(postId: string) {
  const commentsRef = collection(db, "posts", postId, "comments")
  const commentCount = (await getCountFromServer(commentsRef)).data().count

  return commentCount
}

export default async function Posts({
  myUserInfo,
  profileUsername,
}: {
  myUserInfo: UserInfo
  profileUsername?: string
}) {
  const fetchedPosts = await fetchPosts(profileUsername)
export default function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const [posts, setPosts] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastKey, setLastKey] = useState<any>({})
  const [friendPostIds, setFriendPostIds] = useState<string[]>(["0"])
  const [friendList, setFriendList] = useState<string[]>([])
  const [hasMoreFriendPosts, setHasMoreFriendPosts] = useState(true)
  const [myAnimeList, setMyAnimeList] = useState<any>([])
  const [postPreference, setPostPreference] = useState<any>()

  useEffect(() => {
    async function fetchData() {
      const [myFriendList, postPreference] = await Promise.all([
        getFriendList(myUserInfo),
        fetchPostPreference(myUserInfo)
      ])
      setFriendList(myFriendList)
      setHasMoreFriendPosts(myFriendList?.length > 0)

      setPostPreference(postPreference)
      updateLastView(myUserInfo)

      const animeList = await fetchMyAnimeList(myUserInfo)
      setMyAnimeList(animeList?.animeList)
    }

    fetchData()
  }, [])

  function filterPosts(fetchedPosts: any) {
    return Math.random() * 10 < getAnimePreferenceScore(myAnimeList, postPreference?.animeList, fetchedPosts.posts[0].post_anime_data?.anime_id)
  }

  async function fetchPosts() {
    if (!postPreference) return;

    let fetchedPosts;
    if (hasMoreFriendPosts) {
      fetchedPosts = await fetchFriendPosts(myUserInfo, friendList, postPreference.last_view, lastKey)

      if (fetchedPosts.posts.length) {
        setFriendPostIds([...friendPostIds, ...fetchedPosts.posts.map((post: any) => post.id)])
      } else {
        setHasMoreFriendPosts(false)
        fetchedPosts = await fetchAllPosts(friendPostIds, {})
      }
    } else {
      fetchedPosts = await fetchAllPosts(friendPostIds, lastKey)
    }

    // Post is from me or my friend or is not disliked
    if (fetchedPosts.lastKey) {
      if ((fetchedPosts.posts[0].authorName === myUserInfo.username) || friendList?.includes(fetchedPosts.posts[0].authorName) || filterPosts(fetchedPosts)) {
        setPosts([...posts, ...fetchedPosts.posts]);
      }
      setLastKey(fetchedPosts.lastKey)
    } else {
      setHasMore(false)
    }
  }

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
          <Suspense
            fallback={
              <div className="mb-4">
                <PostContent content={"Loading..."} />
                <PostAction />
              </div>
            }
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
                tag={post?.post_anime_data?.tag}
                score={post?.post_anime_data?.score}
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
    </div>
  )
}
