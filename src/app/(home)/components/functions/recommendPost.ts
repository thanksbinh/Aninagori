import { formatDuration } from "@/components/utils/format"
import { db } from "@/firebase/firebase-app"
import { UserInfo } from "@/global/UserInfo.types"
import { collection, getDocs, limit, orderBy, query, startAfter, Timestamp, where } from "firebase/firestore"

function formatPostData(querySnapshot: any) {
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

async function fetchFriendPosts(myUserInfo: UserInfo, friendList: string[], lastView: any, lastKey: any) {
  const usernameList1 = [myUserInfo.username, ...friendList.slice(0, 9)]
  const usernameList2 = friendList.slice(9)

  const lastViewTimestamp = new Timestamp(lastView.seconds, lastView.nanoseconds)

  let postQuery = query(
    collection(db, "posts"),
    where("authorName", "in", usernameList1),
    where("timestamp", ">=", lastViewTimestamp),
    orderBy("timestamp", "desc"),
    startAfter(lastKey),
    limit(1),
  )
  let querySnapshot = await getDocs(postQuery)

  if (usernameList2.length && querySnapshot.empty) {
    postQuery = query(
      collection(db, "posts"),
      where("authorName", "in", usernameList2),
      where("timestamp", ">=", lastViewTimestamp),
      orderBy("timestamp", "desc"),
      startAfter(lastKey),
      limit(1),
    )
    querySnapshot = await getDocs(postQuery)
  }

  return formatPostData(querySnapshot)
}

async function fetchAllPosts(friendPostIds: string[], lastKey: any) {
  let copyLastKey = lastKey
  do {
    const postQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"), startAfter(copyLastKey), limit(1))
    const querySnapshot = await getDocs(postQuery)

    if (friendPostIds.includes(querySnapshot.docs[0].id)) {
      copyLastKey = querySnapshot.docs[0]
    } else {
      return formatPostData(querySnapshot)
    }
  } while (true)
}

function getAnimePreferenceScore(myAnimeList: any, animePreference: any, anime_id: string): number {
  const anime = myAnimeList?.find((anime: any) => anime.node.id === anime_id)

  // Anime in myAnimeList
  if (anime?.list_status.status === "watching") return 0
  if (anime?.list_status.status === "dropped") return 4
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
