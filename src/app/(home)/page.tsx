'use client';

import { Post, PostForm, Sidebar } from '../../components';
import { useSession } from 'next-auth/react';
export default function Home() {
  return (
    <div className="flex justify-center">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <PostForm avatarUrl={''} authorName={'Nichan'} time={''} content={''} likes={0} comments={0} />
        <Post
          authorName={'Nichan'}
          avatarUrl={'/bocchi.jpg'}
          time={'March 1, 2023 at 2:30pm'}
          content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          imageUrl={'/Konosuba.jpg'}
          likes={10}
          comments={10}
        />
      </div>
      <Sidebar />
    </div>
  );
}
