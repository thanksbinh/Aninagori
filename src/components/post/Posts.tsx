import { getDocs, collection, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase/firebase-app";
import { UserInfo } from "../../global/types";
import { formatDuration } from "../utils/formatDuration";
import { Suspense } from "react";
import ContextProvider from "./context/PostContext";
import { Post } from "./Post";
import PostContent from "./PostContent";
import PostAction from "./PostAction";

async function fetchPosts() {
  const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  const fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      lastComment: doc.data().lastComment && {
        ...doc.data().lastComment,
        timestamp: formatDuration(new Date().getTime() - doc.data().lastComment.timestamp.toDate().getTime()),
      },
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id,
    } as any;
  });

  return fetchedPosts;
}

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(10));
async function fetchPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10));
  const querySnapshot = await getDocs(q);
  const fetchedPosts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      lastComment: doc.data().lastComment && {
        ...doc.data().lastComment,
        timestamp: formatDuration(new Date().getTime() - doc.data().lastComment.timestamp.toDate().getTime()),
      },
      timestamp: formatDuration(new Date().getTime() - doc.data().timestamp.toDate().getTime()),
      id: doc.id,
    } as any;
  });

  return fetchedPosts;
}

export default async function Posts({ myUserInfo }: { myUserInfo: UserInfo }) {
  const fetchedPosts = await fetchPosts();

  return (
    <div className="flex flex-col">
      {fetchedPosts.map((post: any) => (
        <div key={post.id}>
        <ContextProvider key={post.id} myUserInfo={myUserInfo} authorName={post.authorName} postId={post.id}>
          <Suspense fallback={<div className="mb-4"><PostContent content={"Loading..."} /><PostAction /></div>}>
            {/* @ts-expect-error Server Component */}
            <Post
              authorName={post.authorName}
              avatarUrl={post.avatarUrl}
              timestamp={post.timestamp}
              content={post.content}
              imageUrl={post.imageUrl}
              videoUrl={post.videoUrl}
              reactions={post.reactions}
              lastComment={post.lastComment}
              id={post.id}
            />
          </Suspense>
        </ContextProvider>
        </div>
      ))}
    </div>
  );
}

async function Post(props: any) {
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
        id={props.id}
      />
      <PostAction
        reactions={props.reactions}
        myUserInfo={props.myUserInfo}
        commentCount={commentCount}
        comments={lastComment}
        postId={props.id}
      />
    </div>
  );
}
