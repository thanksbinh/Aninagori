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

const cx = classNames.bind(styles);

async function Profile({ params }: { params: { user_name: string } }) {
  const session = await getServerSession(authOptions);

  // get admin information
  let adminData = {} as any;

  if (session && !!session.user) {
    const docRef = doc(db, 'users', (session.user as any).id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCookie('username', docSnap.data().username);
      setCookie('userID', docSnap.id);
      adminData = { ...docSnap.data(), joined_date: "", id: docSnap.id };
    } else {
      //TODO: return user error apge
    }
  }

  // get guess information
  const usersRef = collection(db, 'users');
  const usernameQuery = query(usersRef, where('username', '==', params.user_name));
  const querySnapshot = await getDocs(usernameQuery);
  const guessData = ({ ...querySnapshot.docs[0].data(), joined_date: "", id: querySnapshot.docs[0].id }) as any;

  // compare between admin and guess
  const isAdmin = (!querySnapshot.empty && !!session?.user) && (params.user_name === adminData.username);

  //TODO: add loading effect when first timestamp loading page
  return (
    <div className={cx('profile-wrapper')}>
      <div className={cx('profile-content')}>
        <ProfileHeader guess={guessData} admin={adminData} />
        <div className={cx('profile-body-wrapper')}>
          <div className={cx('status-section')}>
            {guessData?.mal_connect ? (
              <Suspense fallback={<><AnimeUpdate data={{}} /><AnimeStatus data={{}} /><AnimeFavorite data={{}} /></>}>
                {/* @ts-expect-error Server Component */}
                <AnimeComponent mal_username={guessData.mal_connect.myAnimeList_username} />
              </Suspense>
            ) : (
              <div className={cx('mal-notfound')}>Not connected to MAL yet</div>
            )}
          </div>
          <div className={cx('post-section')}>
            {isAdmin && (
              <PostForm
                avatarUrl={session?.user?.image as string}
                username={guessData.name || guessData.username}
                isBanned={!!adminData.is_banned}
              />
            )}
            {/* @ts-expect-error Server Component */}
            <Posts myUserInfo={adminData} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function AnimeComponent({ mal_username }: { mal_username: string }) {
  const animeData = (await get('api/user/' + mal_username)).data;

  return (
    <>
      <AnimeUpdate data={animeData} />
      <AnimeStatus data={animeData} />
      <AnimeFavorite data={animeData} />
    </>
  )
}
export default Profile;
