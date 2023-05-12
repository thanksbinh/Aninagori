import axios from "axios"

const JIKAN_ANIME_API_URL = 'https://api.jikan.moe/v4/'
const MAL_API_URL = 'https://api.myanimelist.net/v2/'

// config API call from backend => MAL or Jikan API
export const MALRequest = axios.create({
  baseURL: MAL_API_URL,
  headers: {
    "X-MAL-Client-ID": process.env.X_MAL_CLIENT_ID,
  },
})

export const jikanRequest = axios.create({
  baseURL: JIKAN_ANIME_API_URL,
})
