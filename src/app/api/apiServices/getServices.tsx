import * as apiServices from '@/app/api/apiServices/apiServicesConfig';

// Used to search Anime by name
export const getAnimeList = async (q: string, offset: number, limit: number) => {
  try {
    const animeResult = await apiServices.MALRequest.get('/anime', {
      params: {
        q,
        offset,
        limit,
      },
    });

    return animeResult;
  } catch (error) {
    console.error(error);
  }
};

// Search User information by name
export const getUserInformation = async (username: string) => {
  try {
    const userInformation = await apiServices.jikanRequest.get(`/users/${username}/full`);
    return userInformation;
  } catch (error) {
    console.log(error);
  }
};

// Get User Anime List
// You can custom params metter
// Here im taking 3 of lastest update anime
export const getUserAnimeList = async (username: string) => {
  try {
    // Will custom so that user information API more customize
    // ----------------------------------
    const userAnimeUpdate = await apiServices.MALRequest.get(
      `/users/${username}/animelist?fields=list_status&limit=3&sort=list_updated_at`,
    );
    return userAnimeUpdate;
  } catch (error) {
    console.log(error);
  }
};

export const getAnimeInformation = async (id: string) => {
  try {
    const animeInformation = await apiServices.MALRequest.get(
      `/anime/${id}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`,
    );
    return animeInformation;
  } catch (error) {
    console.log(error);
  }
};

export const getAnimeTotal = async (id: string) => {
  try {
    const animeTotal = await apiServices.MALRequest.get(
      `/anime/${id}?fields=num_episodes`,
    );
    return animeTotal;
  } catch (error) {
    console.log(error);
  }
};
