import { getAnimeList } from '@/app/api/apiServices/getServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const search_name: any = request.headers.get('q');
  const offset: any = request.headers.get('offset');
  const limit: any = request.headers.get('limit');

  console.log(search_name, offset, limit);

  //   const result: any = await getAnimeList(search_name, offset, limit);
  const result: any = await getAnimeList(search_name, parseInt(offset), parseInt(limit));
  //   console.log(result.data);

  return NextResponse.json(result.data);
}
