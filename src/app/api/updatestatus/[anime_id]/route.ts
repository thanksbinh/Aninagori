import { NextResponse } from "next/server"
import qs from "qs"

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const anime_id = params.anime_id
    const status = request.headers.get("status")
    const episode = request.headers.get("episode")
    const score = request.headers.get("score")
    const auth_code = request.headers.get("auth_code")
    console.log(anime_id, status, episode, score)
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
    const urlEncodedParams = qs.stringify(urlParamsOauth)
    console.log(urlEncodedParams)

    fetch("https://api.myanimelist.net/v2/anime/" + anime_id + "/my_list_status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + auth_code,
      },
      body: urlEncodedParams,
    })
      .then((res) => res.json())
      .then((data) => {
        return NextResponse.json({ status: 200, data: data })
      })
    return NextResponse.json({ status: 200 })
  } catch (err) {
    return NextResponse.json({ status: 400, err: err })
  }
}
