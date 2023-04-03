import { NextResponse } from "next/server"
import { getAnimeInformation } from "../../apiServices/getServices"

export async function GET(request: Request, { params }: { params: any }) {
  const id = params.id
  const result: any = await getAnimeInformation(id)

  return NextResponse.json(result.data)
}
