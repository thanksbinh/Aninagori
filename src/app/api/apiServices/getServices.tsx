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
    // console.log(error);
  }
};

// Get User Anime List
export const getUserAnimeList = async (username: string) => {
  try {
    // Will custom so that user information API more customize
    // ----------------------------------
    const userInformation = await apiServices.MALRequest.get(`/users/${username}/animelist?fields=list_status&sort=list_updated_at`);
    return userInformation;
  } catch (error) {
    // console.log(error);
  }
};
