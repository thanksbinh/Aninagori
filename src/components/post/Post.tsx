import { getDocs, collection, query, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { db } from '@/firebase/firebase-app';
import { UserInfo } from '../../global/types';
import { formatDuration } from '../utils/formatDuration';
import { Suspense } from 'react';
import ContextProvider from './context/PostContext';
import PostContent from './PostContent';
import PostAction from './PostAction';

export default async function Post(props: any) {
  const commentsRef = collection(db, 'posts', props.id, 'comments');
  const commentCount = (await getCountFromServer(commentsRef)).data().count;

  const lastCommentRef = query(commentsRef, orderBy('timestamp', 'desc'), limit(1));
  const lastCommentDocs = (await getDocs(lastCommentRef)).docs;

  const lastComment = lastCommentDocs.map((doc) => {
    return {
      ...doc.data(),
      replies: doc
        .data()
        .replies?.sort((a: any, b: any) => a.timestamp - b.timestamp)
        .map((reply: any) => {
          return {
            ...reply,
            timestamp: formatDuration(new Date().getTime() - new Date(reply.timestamp.seconds * 1000).getTime()),
            realTimestamp: { ...reply.timestamp },
            parentId: doc.id,
          };
        }),
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id,
    } as any;
  });

  return (
    <div className="mb-4">
      <PostContent
        authorName={props.authorName}
        avatarUrl={props.avatarUrl}
        timestamp={props.timestamp}
        content={props.content}
        imageUrl={props.imageUrl}
        videoUrl={props.videoUrl}
        animeID={props?.postAnimeData?.anime_id}
        animeName={props?.postAnimeData?.anime_name}
        watchingProgess={props?.postAnimeData?.watching_progess}
        episodesSeen={props?.postAnimeData?.episodes_seen}
        episodesTotal={props?.postAnimeData?.total_episodes}
        tag={props?.postAnimeData?.tag}
      />
      <PostAction reactions={props.reactions} commentCount={commentCount} comments={lastComment} />
    </div>
  );
}
