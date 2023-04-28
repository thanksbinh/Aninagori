import { AnimeInfo } from '@/global/AnimeInfo.types';
import React from 'react';

interface PostFormContextType {
  recentAnimeList: AnimeInfo[]
  setRecentAnimeList: any
}

export const PostFormContext = React.createContext<PostFormContextType>({
  recentAnimeList: [],
  setRecentAnimeList: () => { }
});