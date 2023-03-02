import axios from 'axios';

// config API call from client => backend
export const MALRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAL_API_URL,
  headers: {
    'X-MAL-Client-ID': process.env.NEXT_PUBLIC_X_MAL_CLIENT_ID,
  },
});

export const jikanRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JIKAN_ANIME_API_URL,
});
