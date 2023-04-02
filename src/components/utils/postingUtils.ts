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
