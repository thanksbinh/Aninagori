import { getAnimeList, getUserInformation } from '@/app/api/apiServices/getServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: any }) {
  const userName = params.user_name;

  //   const result: any = await getAnimeList(search_name, offset, limit);
  //   const result: any = await getAnimeList(search_name, parseInt(offset), parseInt(limit));
  //   console.log(result.data);
  const result : any = await getUserInformation(userName);
  return NextResponse.json(result.data);
}
