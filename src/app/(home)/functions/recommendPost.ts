import { formatDuration } from "@/components/utils/formatData"
import { db } from "@/firebase/firebase-app"
import { UserInfo } from "@/global/UserInfo.types"
import { collection, getDocs, limit, orderBy, query, startAfter, Timestamp, where } from "firebase/firestore"

function formatPostData(querySnapshot: any) {
  if (!querySnapshot) return { posts: [], lastKey: null }

  const fetchedPosts = querySnapshot.docs.map((doc: any) => {
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

  return {
    posts: fetchedPosts,
    lastKey: querySnapshot.docs[querySnapshot.docs.length - 1],
  }
}

async function fetchFriendPosts(myUserInfo: UserInfo, friendList: string[], lastView: any) {
  const usernameList1 = [myUserInfo.username, ...friendList.slice(0, 9)]
  const usernameList2 = friendList.slice(9)

  const lastViewTimestamp = lastView ? new Timestamp(lastView._seconds, lastView._nanoseconds) : Timestamp.now()

  let postQuery = query(
    collection(db, "posts"),
    where("authorName", "in", usernameList1),
    where("timestamp", ">=", lastViewTimestamp),
    orderBy("timestamp", "desc"),
  )
  let querySnapshot = await getDocs(postQuery)

  if (usernameList2.length && querySnapshot.empty) {
    postQuery = query(
      collection(db, "posts"),
      where("authorName", "in", usernameList2),
      where("timestamp", ">=", lastViewTimestamp),
      orderBy("timestamp", "desc"),
    )
    querySnapshot = await getDocs(postQuery)
  }

  return formatPostData(querySnapshot)
}

async function fetchAllPosts(friendPostIds: string[], lastKey: any) {
  let copyLastKey = lastKey
  while (true) {
    const postQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"), startAfter(copyLastKey), limit(2))
    let querySnapshot = (await getDocs(postQuery)) as any

    if (!querySnapshot.docs.length) {
      return formatPostData(null);
    }

    querySnapshot = {
      ...querySnapshot,
      docs: querySnapshot.docs.filter((doc: any) => {
        copyLastKey = doc
        return !friendPostIds.includes(doc.id)
      }),
    }

    if (querySnapshot.docs.length) {
      return formatPostData(querySnapshot)
    }
  }
}

function getAnimePreferenceScore(myAnimeList: any, animePreference: any, anime_id: string): number {
  const anime = myAnimeList?.find((anime: any) => anime.node.id === anime_id)

  // Anime in myAnimeList
  if (anime?.list_status.status === "watching") return 0
  if (anime?.list_status.status === "dropped") return 2.5
  if (anime?.list_status.status === "completed") {
    if (anime?.list_status.score >= 8) return 10
    if (anime?.list_status.score >= 6) return 5
    return 2
  }

  // Anime in animePreference
  const thisAnime = animePreference?.find((anime: any) => anime.id === anime_id)
  return thisAnime ? thisAnime.potential : 10
}

export { fetchAllPosts, fetchFriendPosts, getAnimePreferenceScore }
