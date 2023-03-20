import { getAnimeList } from '@/app/api/apiServices/getServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const search_name: any = request.headers.get('q');
    const offset: any = request.headers.get('offset');
    const limit: any = request.headers.get('limit');
    const result: any = await getAnimeList(String(search_name), parseInt(offset), parseInt(limit));
    return NextResponse.json(result.data);
  } catch (err) {
    return NextResponse.json({ error: 'cant find anime name' });
  }
}
