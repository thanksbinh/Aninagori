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

const cx = classNames.bind(styles);

function Profile({ user_name }: { user_name: string }) {
  const { data: session } = useSession();
  const admin = useRef({});
  const guess = useRef({});
  const [userNotFound, setUserNotFound] = useState(false);
  const isAdmin = useRef(false);
  const [animeData, setAnimeData] = useState({ data: '' });

  useEffect(() => {
    async function getUserID() {
      if (session && session.user) {
        const docRef = doc(db, 'users', (session.user as any).id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          admin.current = { ...docSnap.data(), "id": docSnap.id };
          const adminName = docSnap.data().username;
          const guessName = window.location.href.split('user/')[1];
          const usersRef = collection(db, 'users');
          const usernameQuery = query(usersRef, where('username', '==', guessName));
          const querySnapshot = await getDocs(usernameQuery);
          if (querySnapshot.empty) {
            //TODO: return user not found page
            setUserNotFound(true);
            console.log('not found');
          } else {
            guess.current = { ...querySnapshot.docs[0].data(), "id": querySnapshot.docs[0].id }
            isAdmin.current = (guess.current as any).username === (admin.current as any).username;
            if (isAdmin.current) {
              console.log('Current Admin');
            } else {
              console.log('Not Admin');
            }
            const result = await get('api/user/B_I_N_H');
            console.log('REsult í', result);

            setAnimeData(result);
          }

          //TODO handle if docsnap have "connected_to_MAL"
        } else {
          //TODO: return user error apge
        }
      }
    }
    getUserID();
  }, [session]);
  console.log('Re-render and ', userNotFound);

  //TODO: add loading effect when first time loading page
  return userNotFound ? (
    <div className="setBackground"></div>
  ) : (
    <div className={cx('profile-wrapper')}>
      <div className={cx('profile-content')}>
        <ProfileHeader guess={guess.current} admin={admin.current} />
        <div className={cx('profile-body-wrapper')}>
          <div className={cx('status-section')}>
            <AnimeUpdate data={animeData.data} />
            <AnimeStatus data={animeData.data} />
            <AnimeFavorite data={animeData.data} />
          </div>
          <div className={cx('post-section')}>
            {isAdmin.current && (
              <PostForm
                avatarUrl={'/bocchi.jpg'}
                authorName={(guess.current as any).name || (guess.current as any).username}
                time={''}
                content={''}
                likes={0}
                comments={0}
              />
            )}
            <Post
              authorName={(guess.current as any).name || (guess.current as any).username}
              avatarUrl={'/bocchi.jpg'}
              time={'March 1, 2023 at 2:30pm'}
              content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
              imageUrl={'/Konosuba.jpg'}
              likes={10}
              comments={10}
            />
            <Post
              authorName={'Nichan'}
              avatarUrl={'/bocchi.jpg'}
              time={'March 1, 2023 at 2:30pm'}
              content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
              imageUrl={'/Konosuba.jpg'}
              likes={10}
              comments={10}
            />
            <Post
              authorName={'Nichan'}
              avatarUrl={'/bocchi.jpg'}
              time={'March 1, 2023 at 2:30pm'}
              content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
              imageUrl={'/Konosuba.jpg'}
              likes={10}
              comments={10}
            />
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
        </div>
      </div>
    </div>
  );
}

export default Profile;
