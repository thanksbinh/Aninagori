import { NextResponse } from "next/server"

export const config = { runtime: "experimental-edge" }

export async function POST(req: Request) {
  const requestBody = await req.formData()
  const fileVideo = requestBody.get("file") as File
  var file_name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ".mp4"
  var formData = new FormData()
  formData.append("file", fileVideo, file_name)

  const body = await fetch("http://up.hydrax.net/" + process.env.ABYSS_API_KEY, {
    method: "POST",
    body: formData,
  }).then((res) => res.json())
  return NextResponse.json(body)
}
