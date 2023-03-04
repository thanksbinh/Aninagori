import { getUserAnimeList } from '@/app/api/apiServices/getServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: any }) {
  const userName = params.user_name;
  const result : any = await getUserAnimeList(userName);
  return NextResponse.json(result.data);
}
