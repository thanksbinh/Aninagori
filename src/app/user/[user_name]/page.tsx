/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { get } from '@/app/api/apiServices/httpRequest';
import ProfileHeader from '@/app/user/[user_name]/profileComponent/ProfileHeader/ProfileHeader';
import AnimeStatus from '@/app/user/[user_name]/profileComponent/AnimeStatus/AnimeStatus';
import AnimeFavorite from '@/app/user/[user_name]/profileComponent/AnimeFavorite/AnimeFavorite';
import AnimeUpdate from '@/app/user/[user_name]/profileComponent/AnimeUpdate/AnimeUpdate';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase-app';
import PostForm from '@/components/post/PostForm';
import { setCookie } from 'cookies-next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Suspense } from 'react';
import { Posts } from '@/components';
import * as apiServices from '@/app/api/apiServices/apiServicesConfig';
import axios from 'axios';
import { getAnimeInformation, getAnimeTotal } from '@/app/api/apiServices/getServices';

const cx = classNames.bind(styles);

async function Profile({ params }: { params: { user_name: string } }) {
  const session = await getServerSession(authOptions);

  // get admin information
  let adminData = {} as any;

  if (session && !!session.user) {
    const docRef = doc(db, 'users', (session.user as any).id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      adminData = { ...docSnap.data(), joined_date: '', id: docSnap.id };
    }
  }

  // get guess information
  const usersRef = collection(db, 'users');
  const usernameQuery = query(usersRef, where('username', '==', params.user_name));
  const querySnapshot = await getDocs(usernameQuery);
  const guessData = { ...querySnapshot.docs[0].data(), joined_date: '', id: querySnapshot.docs[0].id } as any;

  // compare between admin and guess
  const isAdmin = !querySnapshot.empty && !!session?.user && params.user_name === adminData.username;
  return (
    <div className={cx('profile-wrapper')}>
      <div className={cx('profile-content')}>
        <ProfileHeader guess={{ ...guessData }} admin={{ ...adminData }} />
        <div className={cx('profile-body-wrapper')}>
          <div className={cx('status-section')}>
            {guessData?.mal_connect ? (
              <Suspense
                fallback={
                  <>
                    {/* @ts-expect-error Server Component */}
                    <AnimeUpdate data={[]} />
                    <AnimeStatus statusData={{}} />
                    <AnimeFavorite favorite_data={{}} />
                  </>
                }
              >
                {/* @ts-expect-error Server Component */}
                <AnimeComponent
                  access_token={guessData.mal_connect.accessToken}
                  mal_username={guessData.mal_connect.myAnimeList_username}
                />
              </Suspense>
            ) : (
              <div className={cx('mal-notfound')}>Not connected to MAL yet</div>
            )}
          </div>
          <div className={cx('post-section')}>
            {isAdmin && (
              <PostForm avatarUrl={session?.user?.image as string} username={guessData.name || guessData.username} />
            )}
            {/* @ts-expect-error Server Component
            <Posts myUserInfo={adminData} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

async function AnimeComponent({ mal_username, access_token }: { mal_username: string; access_token: string }) {
  const animeData = getUserAnimeUpdate(access_token, mal_username);
  const animeStatus = getAnimeStatus(access_token);
  const userFavorite = getAnimeFavorite(mal_username);
  const [data, anime_status, user_favorite] = await Promise.all([animeData, animeStatus, userFavorite]);

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <AnimeUpdate data={data.data} />
      <AnimeStatus statusData={anime_status.anime_statistics} />
      <AnimeFavorite favorite_data={user_favorite.data.data.favorites} />
    </>
  );
}

function getAnimeStatus(access_token: any) {
  const url = 'https://api.myanimelist.net/v2/users/@me?fields=anime_statistics';
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());
}

function getAnimeFavorite(mal_username: any) {
  return apiServices.jikanRequest.get(`/users/${mal_username}/full`);
}

async function getUserAnimeUpdate(access_token: any, mal_username: any) {
  const url = 'https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=3&sort=list_updated_at';
  const userUpdate = fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());

  const result = await userUpdate;
  result.data.map((data: any) => {
    console.log(data.node);
    console.log(data.list_status);
  });

  return userUpdate;
}

export default Profile;
