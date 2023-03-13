/* eslint-disable @next/next/no-img-element */
'use client';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useEffect, useRef, useState } from 'react';
import { get } from '@/app/api/apiServices/httpRequest';
import ProfileHeader from '@/app/user/[user_name]/profileComponent/ProfileHeader/ProfileHeader';
import AnimeStatus from '@/app/user/[user_name]/profileComponent/AnimeStatus/AnimeStatus';
import AnimeFavorite from '@/app/user/[user_name]/profileComponent/AnimeFavorite/AnimeFavorite';
import AnimeUpdate from '@/app/user/[user_name]/profileComponent/AnimeUpdate/AnimeUpdate';
import { useSession } from 'next-auth/react';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase-app';
import PostForm from '@/components/Post/PostForm';
import Post from '@/components/Post/Post';
import PostAction from '@/components/Post/PostAction';
import Button from '@/components/Button/Button';
import { Posts } from '@/components';
import { AnyRecord } from 'dns';

const cx = classNames.bind(styles);

function Profile({ user_name }: { user_name: string }) {
  const { data: session } = useSession();
  const admin = useRef({});
  const guess = useRef({});
  const isAdmin = useRef(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [animeData, setAnimeData] = useState({ data: '' });
  const [guessData, setGuessData] = useState({});
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    async function getUserID() {
      // get admin information
      console.log(session);

      if (session && !!session.user) {
        const docRef = doc(db, 'users', (session.user as any).id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          admin.current = { ...docSnap.data(), id: docSnap.id };
          console.log(admin.current);
          setAdminData(admin.current);
        } else {
          //TODO: return user error apge
        }
      }
      // get guess information
      const guessName = window.location.href.split('user/')[1];
      const usersRef = collection(db, 'users');
      const usernameQuery = query(usersRef, where('username', '==', guessName));
      const querySnapshot = await getDocs(usernameQuery);
      if (querySnapshot.empty) {
        setUserNotFound(true);
      } else {
        guess.current = { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
      }

      // compare between admin and guess
      if (!querySnapshot.empty && !!session?.user) {
        guess.current = { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
        isAdmin.current = (guess.current as any).username === (admin.current as any).username;
        if (isAdmin.current) {
          console.log('Current Admin');
        } else {
          console.log('Not Admin');
        }
      }
      setGuessData(guess.current);
      if (!!(guess.current as any).myAnimeList_username) {
        const result = await get('api/user/' + (guess.current as any).myAnimeList_username);
        setAnimeData(result);
      }
    }
    getUserID();
  }, []);

  //TODO: add loading effect when first timestamp loading page
  return userNotFound ? (
    <div className="setBackground"></div>
  ) : (
    <div className={cx('profile-wrapper')}>
      <div className={cx('profile-content')}>
        <ProfileHeader guess={guessData} admin={adminData} />
        <div className={cx('profile-body-wrapper')}>
          <div className={cx('status-section')}>
            {!!(guess.current as any).myAnimeList_username ? (
              <>
                <AnimeUpdate data={animeData.data} />
                <AnimeStatus data={animeData.data} />
                <AnimeFavorite data={animeData.data} />
              </>
            ) : (
              <div className={cx('mal-notfound')}>Not connected to MAL yet</div>
            )}
          </div>
          <div className={cx('post-section')}>
            {isAdmin.current && (
              <PostForm
                avatarUrl={'/bocchi.jpg'}
                username={(guess.current as any).name || (guess.current as any).username}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
