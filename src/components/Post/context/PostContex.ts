import React from 'react';
import { UserInfo } from '../../nav/NavBar';

interface PostContextType {
  myUserInfo: UserInfo;
  postId: string;
}

export const PostContext = React.createContext<PostContextType>({
  myUserInfo: {
    username: "",
    image: "",
    id: "",
  },
  postId: ""
});
