import { NextResponse } from "next/server"
import qs from "qs"

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const anime_id = params.anime_id
    const status = request.headers.get("status")
    const episode = request.headers.get("episode")
    const score = request.headers.get("score")
    const auth_code = request.headers.get("auth_code")
    const start_date = request.headers.get("start_date")
    const end_date = request.headers.get("end_date")
    const is_rewatching = request.headers.get("is_rewatching")
    const rewatch_time = request.headers.get("rewatch_time")
    const tags = request.headers.get("tags")
    const urlParamsOauth =
      parseInt(score as any) > 0
        ? {
            status: status,
            num_watched_episodes: parseInt(episode as any),
            score: parseInt(score as any),
          }
        : {
            status: status,
            num_watched_episodes: parseInt(episode as any),
          }
    if (!!start_date) {
      ;(urlParamsOauth as any).start_date = start_date
    } else {
      ;(urlParamsOauth as any).start_date = null
    }
    if (!!end_date) {
      ;(urlParamsOauth as any).finish_date = end_date
    } else {
      ;(urlParamsOauth as any).finish_date = null
    }
    if (!!is_rewatching) (urlParamsOauth as any).is_rewatching = is_rewatching
    if (!!rewatch_time) (urlParamsOauth as any).num_times_rewatched = parseInt(rewatch_time)
    if (tags !== "") (urlParamsOauth as any).tags = tags
    const urlEncodedParams = qs.stringify(urlParamsOauth)
    console.log(urlEncodedParams)

    const result = await fetch("https://api.myanimelist.net/v2/anime/" + anime_id + "/my_list_status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + auth_code,
      },
      body: urlEncodedParams,
    }).then((res) => res.json())
    return NextResponse.json({ status: 200, data: result })
  } catch (err) {
    return NextResponse.json({ status: 400, err: err })
  }
}
