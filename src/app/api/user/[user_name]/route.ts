import {
  getAnimeList,
  getUserInformation,
  getUserAnimeList,
  getAnimeInformation,
} from '@/app/api/apiServices/getServices';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: any }) {
  const userName = params.user_name;
  let userAnimeUpdate: any = await getUserAnimeList(userName);
  let userInformation: any = await getUserInformation(userName);
  let animeArr: any = [];
  userInformation.data.data.updates.anime.map(async (anime: any, key: number) => {
    const list_status = userAnimeUpdate.data.data[key].list_status;
    const node = userAnimeUpdate.data.data[key].node;
    anime.score = list_status.score;
    let status = list_status.status;
    switch (status) {
      case 'completed':
        status = 'Completed';
        break;
      case 'plan_to_watch':
        status = 'Plan To Watch';
        break;
      case 'watching':
        status = 'Watching';
        break;
      case 'on_hold':
        status = 'On Hold';
        break;
      default:
        status = 'Unknow Status';
        break;
    }
    if (list_status.is_rewatching) {
      status = 'Re Watching';
    }
    anime.entry.url = 'https://myanimelist.net/anime/' + node.id;
    anime.status = status;
    anime.episodes_seen = list_status.num_episodes_watched;
    anime.date = list_status.updated_at;
    anime.entry.mal_id = node.id;
    anime.entry.title = node.title;
    anime.entry.images.jpg.image_url = node.main_picture.large;
    animeArr.push(node.id);
    // anime.episodes_total = animeData.data.num_episodes;
  });
  const result = [
    await getAnimeInformation(animeArr[0]),
    await getAnimeInformation(animeArr[1]),
    await getAnimeInformation(animeArr[2]),
  ];
  result.map((a: any, key: any) => {
    userInformation.data.data.updates.anime[key].episodes_total = a.data.num_episodes;
    console.log(a.data);
  });

  return NextResponse.json(userInformation.data);
}
