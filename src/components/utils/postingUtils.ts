import { updateStatusOnFriendLists } from "@/app/(home)/components/functions/syncUpdates"
import { db } from "@/firebase/firebase-app"
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import getProductionBaseUrl from "./getProductionBaseURL"

export function getDateNow() {
  const now = new Date().toISOString().slice(0, -5) + "+00:00"
  return now
}

export function handleAnimeInformationPosting(
  status: any,
  animeInformation: any,
  episodes: any,
  tag: any,
  totalEps: any,
  score: any,
) {
  const postAnimeData = {
    watching_progress: status,
    anime_name: animeInformation.animeName,
    anime_id: animeInformation.animeID,
    episodes_seen: episodes,
    total_episodes: parseInt(totalEps) === 0 ? "1" : totalEps + "",
    tag: tag,
  }

  if (status === "Watching" && episodes === "0") {
    postAnimeData.watching_progress = "is watching"
    postAnimeData.episodes_seen = "1"
  } else if (status === "Watching") {
    postAnimeData.watching_progress = "is watching"
  } else if (status === "Plan to watch") {
    postAnimeData.watching_progress = "plan to watch"
    postAnimeData.episodes_seen = "0"
  } else if (status === "Finished") {
    ;(postAnimeData as any).score = score
    postAnimeData.watching_progress = "have finished"
    postAnimeData.episodes_seen = postAnimeData.total_episodes
  } else if (status === "Drop") {
    postAnimeData.watching_progress = "have dropped"
  }
  if (postAnimeData.episodes_seen === postAnimeData.total_episodes) {
    postAnimeData.watching_progress = "have finished"
  }

  return postAnimeData
}

export function convertWatchStatus(watchStatus: string) {
  switch (watchStatus) {
    case "is watching":
      return "watching"
      break
    case "have dropped":
      return "dropped"
      break
    case "plan to watch":
      return "plan_to_watch"
      break
    case "have finished":
      return "completed"
      break
    default:
      break
  }
}

// check if an anime have update before or not
export async function adjustAnimeListArray(username: any, animeData: any) {
  const myAnimeListRef = doc(db, "myAnimeList", username)
  const myAnimeList = (await getDoc(myAnimeListRef)).data()
  var canMerge = true
  // no anime list data
  if (!!!myAnimeList?.animeList) return [animeData]
  const newDataArray = myAnimeList?.animeList.map((anime: any) => {
    if (anime.node.id === animeData.node.id) {
      canMerge = false
      return animeData
    }
    return anime
  })
  // if anime data is not in the list
  if (canMerge) {
    return [animeData, ...myAnimeList?.animeList]
  }
  // if anime data is in the list
  return newDataArray
}

export async function handleSubmitForm(
  e: React.FormEvent<HTMLFormElement>,
  animeStatus: any,
  animeSearch: any,
  animeEpisodes: any,
  animeTag: any,
  animeScore: any,
  inputRef: any,
  mediaUrl: any,
  setLoadPosting: any,
  uploadMedia: any,
  username: any,
  avatarUrl: any,
  mediaType: any,
  malAuthCode: any,
  myUserInfo: any,
): Promise<void> {
  const statusData = (animeStatus?.current as any).getAnimeStatus()
  const searchData = (animeSearch?.current as any).getAnimeName()
  const episodesData = (animeEpisodes?.current as any).getAnimeEpisodes()
  const totalEps = (animeEpisodes?.current as any).getAnimeTotal()
  const tagData = (animeTag?.current as any).getAnimeTag()
  const scoreData = (animeScore?.current as any).getAnimeScore()

  e.preventDefault()
  if (!inputRef.current?.value && mediaUrl.length === 0) {
    alert("Please write something or upload media 😭")
    return
  }
  setLoadPosting(true)
  const postAnimeData = handleAnimeInformationPosting(
    statusData,
    searchData,
    episodesData,
    tagData,
    totalEps,
    scoreData,
  )

  const downloadMediaUrl = await uploadMedia()
  //TODO: promise.all post + update MAL watch status
  const promisePost = [
    addDoc(collection(db, "posts"), {
      authorName: username,
      avatarUrl: avatarUrl,
      timestamp: serverTimestamp(),
      content: inputRef.current?.value || "",
      imageUrl: mediaType === "image" ? downloadMediaUrl : "",
      videoUrl: mediaType === "video" ? downloadMediaUrl[0] : "",
      post_anime_data:
        (animeSearch?.current as any).getAnimeName().animeID === "" ? { tag: postAnimeData.tag } : postAnimeData,
      comments: 0,
    }),
  ] as any

  try {
    // post have anime data
    if (!!postAnimeData.anime_id) {
      // user connect with MAL
      if (!!malAuthCode) {
        const promiseUpdateMAL = fetch(getProductionBaseUrl() + "/api/updatestatus/" + postAnimeData.anime_id, {
          headers: {
            status: convertWatchStatus(postAnimeData.watching_progress),
            episode: postAnimeData.episodes_seen,
            score: (postAnimeData as any).score,
            auth_code: malAuthCode,
          } as any,
        }).then((res) => res.json())
        promisePost.push(promiseUpdateMAL)
      } else {
        // user not connect with MAL
        const myAnimeListRef = doc(db, "myAnimeList", username)
        const dateNow = getDateNow()
        const animeInformation = await fetch(getProductionBaseUrl() + "/api/anime/" + postAnimeData.anime_id).then(
          (res) => res.json(),
        )
        const animeData = {
          list_status: {
            is_rewatching: false,
            num_episodes_watched: postAnimeData.episodes_seen,
            score: !!(postAnimeData as any).score ? (postAnimeData as any).score : 0,
            status: convertWatchStatus(postAnimeData.watching_progress),
            updated_at: dateNow,
          },
          node: {
            id: postAnimeData.anime_id,
            main_picture: animeInformation.main_picture,
            title: animeInformation.title,
          },
        }
        // check if anime already in list, if in list, update that anime node
        const animeDataAfterCheck = await adjustAnimeListArray(username, animeData)
        const myAnimeListPromise = setDoc(myAnimeListRef, {
          last_updated: dateNow,
          animeList: animeDataAfterCheck,
        })
        promisePost.push(myAnimeListPromise as any)
        console.log("user not connect with MAL")
      }
      // Update status on friend list
      promisePost.push(
        updateStatusOnFriendLists(myUserInfo, {
          ...postAnimeData,
          status: convertWatchStatus(postAnimeData.watching_progress),
        }),
      )
    }
    const result = await Promise.all(promisePost)
    setLoadPosting(false)
    location.reload()
  } catch (err) {
    console.log(err)
  }
}
