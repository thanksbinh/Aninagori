import { getAnimeTotal } from '@/app/api/apiServices/getServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: any }) {
  const id = params.id;
  const result = await getAnimeTotal(id);
  return NextResponse.json({ total: result?.data.num_episodes });
}
