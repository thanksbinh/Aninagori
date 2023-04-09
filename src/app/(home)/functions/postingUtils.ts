import { updateStatusOnFriendLists } from "@/app/(home)/functions/syncUpdates"
import { db, storage } from "@/firebase/firebase-app"
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"
import getProductionBaseUrl from "../../../components/utils/getProductionBaseURL"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

export function getDateNow() {
  const now = new Date().toISOString().slice(0, -5) + "+00:00"
  return now
}

export function handleAnimeInformationPosting(
  status: any,
  animeInformation: any,
  episodes: any,
  totalEps: any,
  score: any,
) {
  const postAnimeData = {
    watching_progress: status,
    anime_name: animeInformation.animeName,
    anime_id: animeInformation.animeID,
    episodes_seen: episodes,
    total_episodes: parseInt(totalEps) === 0 ? "1" : totalEps + "",
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
    ; (postAnimeData as any).score = score
    postAnimeData.watching_progress = "have finished"
    postAnimeData.episodes_seen = postAnimeData.total_episodes
  } else if (status === "Drop") {
    postAnimeData.watching_progress = "have dropped"
  } else if (status === "Re-watching" && episodes === "0") {
    postAnimeData.watching_progress = "re-watching"
    postAnimeData.episodes_seen = "1"
  } else if (status === "Re-watching") {
    postAnimeData.watching_progress = "re-watching"
  }
  if (postAnimeData.episodes_seen === postAnimeData.total_episodes) {
    postAnimeData.watching_progress = "have finished"
  }

  return postAnimeData
}

export function convertWatchStatus(watchStatus: string, isEnd: boolean) {
  console.log(watchStatus, isEnd)

  switch (watchStatus) {
    case "is watching":
      return "watching"
      break
    case "re-watching":
      if (isEnd) {
        return "completed"
      }
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

// get old anime daa
export async function getOldAnimeData(username: any, animeData: any) {
  const myAnimeListRef = doc(db, "myAnimeList", username)
  const myAnimeList = (await getDoc(myAnimeListRef)).data()
  if (!!!myAnimeList?.animeList) return "anime not exist"
  const oldData = myAnimeList?.animeList.find((anime: any) => {
    return anime.node.id === animeData.node.id
  })
  if (oldData) {
    return oldData
  } else {
    // anime not exist
    return "anime not exist"
  }
}

export async function handleSubmitForm(
  animeStatus: any,
  animeSearch: any,
  animeEpisodes: any,
  animeTag: any,
  animeScore: any,
  inputRef: any,
  mediaUrl: any,
  mediaType: any,
  myUserInfo: any,
  postAdditional: any,
): Promise<void> {
  const statusData = (animeStatus?.current as any).getAnimeStatus()
  const searchData = (animeSearch?.current as any).getAnimeName()
  const episodesData = (animeEpisodes?.current as any)?.getAnimeEpisodes()
  const totalEps = (animeEpisodes?.current as any).getAnimeTotal()
  const tagData = (animeTag?.current as any).getAnimeTag()
  const scoreData = (animeScore?.current as any)?.getAnimeScore()
  const startDate = (postAdditional?.current as any).getStartDate()
  const endDate = (postAdditional?.current as any).getEndDate()
  const rewatchTime = (postAdditional?.current as any).getRewatchTime()
  const animeTagData = (postAdditional?.current as any).getAnimeTag()

  if (!!startDate.error) {
    alert(startDate.error)
    return
  }
  if (!!endDate.error) {
    alert(endDate.error)
    return
  }
  const postAnimeData = handleAnimeInformationPosting(statusData, searchData, episodesData, totalEps, scoreData)
  const statustConverted = convertWatchStatus(
    postAnimeData.watching_progress,
    parseInt(totalEps) === parseInt(episodesData),
  )
  console.log(statustConverted)
  // // upload media to firebase storage
  const downloadMediaUrl = await uploadMedia(mediaUrl)
  // post info to firestore
  const promisePost = [
    addDoc(collection(db, "posts"), {
      authorName: myUserInfo.username,
      avatarUrl: myUserInfo.image,
      timestamp: serverTimestamp(),
      content: inputRef.current?.value || "",
      imageUrl: mediaType === "image" ? downloadMediaUrl : "",
      videoUrl: mediaType === "video" ? downloadMediaUrl[0] : "",
      tag: tagData,
      post_anime_data: (animeSearch?.current as any).getAnimeName().animeID === "" ? {} : postAnimeData,
      comments: 0,
    }),
  ] as any

  try {
    // post have anime data
    if (!!postAnimeData.anime_id) {
      // user connect with MAL: post info to MAL
      if (!!myUserInfo?.mal_connect?.accessToken) {
        const promiseUpdateMAL = fetch(getProductionBaseUrl() + "/api/updatestatus/" + postAnimeData.anime_id, {
          headers: {
            status: statustConverted,
            episode: postAnimeData.episodes_seen,
            score: (postAnimeData as any).score,
            auth_code: myUserInfo?.mal_connect?.accessToken,
            start_date: startDate,
            end_date: endDate,
            rewatch_time: rewatchTime,
            is_rewatching: statusData === "Re-watching" ? true : false,
            tags: animeTagData,
          } as any,
        }).then((res) => res.json())
        promisePost.push(promiseUpdateMAL)
      } else {
        // user not connect with MAL: post anime status to firebase
        const myAnimeListRef = doc(db, "myAnimeList", myUserInfo.username)
        const dateNow = getDateNow()
        const animeInformation = await fetch(getProductionBaseUrl() + "/api/anime/" + postAnimeData.anime_id).then(
          (res) => res.json(),
        )
        const animeData = {
          list_status: {
            num_episodes_watched: postAnimeData.episodes_seen,
            score: !!(postAnimeData as any).score ? (postAnimeData as any).score : 0,
            status: statustConverted,
            updated_at: dateNow,
            is_rewatching: statusData === "Re-watching" ? true : false,
          },
          node: {
            id: postAnimeData.anime_id,
            main_picture: animeInformation.main_picture,
            title: animeInformation.title,
          },
        }
        if (!!startDate) (animeData as any).list_status.start_date = startDate
        if (!!endDate) (animeData as any).list_status.finish_date = endDate
        if (animeTagData.length > 0) (animeData as any).list_status.tags = animeTagData
        if (!!rewatchTime && parseInt(rewatchTime) > 0) (animeData as any).list_status.num_times_rewatched = rewatchTime
        // check if anime already in list, if in list, update that anime node
        const batch = writeBatch(db)
        const oldAnimeData = await getOldAnimeData(myUserInfo.username, animeData)
        if (oldAnimeData !== "anime not exist") {
          console.log(oldAnimeData)
          batch.update(myAnimeListRef, {
            animeList: arrayRemove(oldAnimeData),
          })
        }
        batch.update(myAnimeListRef, {
          animeList: arrayUnion(animeData),
          last_updated: dateNow,
        })
        promisePost.push(batch.commit())
      }
      // Update status on friend list
      promisePost.push(
        updateStatusOnFriendLists(myUserInfo, {
          ...postAnimeData,
          status: statustConverted,
        }),
      )
    }
  } catch (err) {
    console.log(err)
  }
}

export const handlePaste = (e: any, setMediaUrl: any, setMediaType: any, mediaUrl: any) => {
  const file = e.clipboardData.files[0]
  var clipboardData = e.clipboardData
  var types = clipboardData.types
  if (types.includes("text/plain")) {
    return
  }
  if (file?.type?.indexOf("image") !== -1) {
    const blob = file.slice(0, file.size, "image/png")
    const fileUrl = new File([blob], "image.png", { type: "image/png" })
    setMediaUrl([...mediaUrl, fileUrl])
    setMediaType("image")
  }
}

export const uploadMedia = async (mediaUrl: any) => {
  if (mediaUrl.length === 0) return ""
  const promise: any[] = []
  mediaUrl.map((file: any) => {
    const fileRef = ref(storage, `posts/${v4()}`)
    const uploadTask = uploadBytes(fileRef, file)
    promise.push(uploadTask)
  })

  const downloadMediaUrl: any = await Promise.all(promise).then(async (snapshot) => {
    const downloadUrl = ["link"]
    downloadUrl.pop()
    for (var i = 0; i < snapshot.length; i++) {
      const dowloadUrlChild = await getDownloadURL(snapshot[i].ref)
      downloadUrl.push(dowloadUrlChild)
    }
    return downloadUrl
  })
  return downloadMediaUrl
}

export const handleDeleteMedia = (index: any, mediaUrl: any, setMediaUrl: any) => {
  URL.revokeObjectURL(mediaUrl[index])
  setMediaUrl(mediaUrl.filter((_: any, i: any) => i !== index))
}

export const handleMediaChange = (e: any, mediaUrl: any, setMediaType: any, setMediaUrl: any) => {
  const file = e.target.files[0]
  if (!file) return
  const fileType = file.type.split("/")[0]
  if (mediaUrl.length !== 0 && mediaUrl[0].type.split("/")[0] !== fileType) {
    setMediaType(fileType)
    setMediaUrl([file])
    alert("You can only upload image or video")
    return
  }
  if (mediaUrl.length >= 10) {
    alert("You can only upload 10 media files")
    return
  }
  //TODO: -handle post a video after a video
  setMediaType(fileType)
  setMediaUrl([...mediaUrl, file])
}
