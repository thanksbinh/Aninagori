import React from 'react';

interface PostFormContextType {
  recentAnimeList: any
  setRecentAnimeList: any
}

export const PostFormContext = React.createContext<PostFormContextType>({
  recentAnimeList: [],
  setRecentAnimeList: () => { }
});