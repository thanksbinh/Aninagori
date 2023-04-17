import getProductionBaseUrl from "@/components/utils/getProductionBaseURL"
import { db } from "@/firebase/firebase-app"
import { doc, getDoc } from "firebase/firestore"
import { convertPostFormWatchStatus } from "./postingUtils"

export async function setAnimeData(
  postData: any,
  animeSearchRef: any,
  animeEpisodesRef: any,
  animeStatusRef: any,
  animeScoreRef: any,
  postAdditionalRef: any,
) {
  if (!!postData?.post_anime_data?.anime_id) {
    ;(animeSearchRef?.current as any).setLoading(true)
    const promiseArray = [
      fetch(getProductionBaseUrl() + "/api/anime/" + postData?.post_anime_data?.anime_id).then((res) => res.json()),
    ]
    const animeRef = doc(db, "myAnimeList", postData?.authorName)
    promiseArray.push(getDoc(animeRef))
    const [data, animeDoc] = await Promise.all(promiseArray)
    ;(animeSearchRef?.current as any).setAnimeSearch(postData?.post_anime_data, data?.main_picture?.medium)
    ;(animeSearchRef?.current as any).setLoading(false)
    const animeData = animeDoc.data()?.animeList.find((anime: any) => {
      return anime.node.id === postData?.post_anime_data?.anime_id
    })
    ;(postAdditionalRef?.current as any).setData(animeData)
  }
  if (!!postData?.post_anime_data) {
    ;(animeEpisodesRef?.current as any).setAnimeEpisodes(postData?.post_anime_data?.episodes_seen)
    const status = convertPostFormWatchStatus(postData?.post_anime_data?.watching_progress)
    ;(animeStatusRef?.current).setAnimeStatus(status)
    if (!!postData?.post_anime_data?.total_episodes) {
      ;(animeEpisodesRef?.current as any).setAnimeTotal(postData?.post_anime_data?.total_episodes)
    }
    if (!!postData?.post_anime_data?.score) {
      ;(animeScoreRef?.current as any).setAnimeScore(postData?.post_anime_data?.score)
    }
  }
}

export function setPostTag(postData: any, animeTagRef: any) {
  // set PostTag data
  if (!!postData?.post_anime_data?.tag) {
    ;(animeTagRef?.current as any).setAnimeTag(postData?.post_anime_data?.tag)
  }
  if (!!postData?.tag) {
    ;(animeTagRef?.current as any).setAnimeTag(postData?.tag)
  }
}

export function setMediaData(postData: any, setMediaUrl: any, setHaveUploadedImage: any, setMediaType: any) {
  // set Media data
  if (!!postData?.imageUrl && typeof postData.imageUrl === "object" && postData.imageUrl.length > 0) {
    setMediaUrl(postData.imageUrl)
    setHaveUploadedImage(postData.imageUrl.map((_: any) => true))
    setMediaType("image")
    return
  }
  if (!!postData?.imageUrl && typeof postData.imageUrl === "string") {
    if (postData.imageUrl === "") {
      setMediaUrl([])
      setHaveUploadedImage([])
      setMediaType("image")
      return
    }
    setMediaUrl([postData.imageUrl])
    setHaveUploadedImage([true])
    setMediaType("image")
    return
  }

  if (!!postData?.videoUrl) {
    setMediaUrl([postData.videoUrl])
    setHaveUploadedImage([true])
    setMediaType("video")
  }
}
