/* eslint-disable @next/next/no-img-element */
'use client';
import classNames from 'classnames/bind';
import styles from './ProfileHeader.module.scss';
import Button from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faImage, faPenToSquare, faPlug, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase-app';
import AddFriendBtn from './AddFriendBtn';
import { memo } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const cx = classNames.bind(styles);

function ProfileHeader({ guess, admin }) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [load, setLoad] = useState(true);
  const [currentImage, setCurrentImage] = useState('/wallpaper.png');
  console.log('re-render header');
  console.log(guess);
  return (
    <div className={cx('wrapper')}>
      <img
        src={currentImage}
        alt="wallpaper"
        className={cx('wallpaper')}
        onError={({ currentTarget }) => {
          //TODO: show pop up notification when error
          console.log('Error');
          currentTarget.onerror = null;
          currentTarget.src = '/wallpaper.png';
        }}
        onLoad={() => {
          setLoad(false);
        }}
        width={1044}
        height={281}
      ></img>
      {admin.username === guess.username && (
        <Button
          onClick={() => {
            setOpen(!open);
          }}
          leftIcon={<FontAwesomeIcon icon={faImage} />}
          small
          primary
          className={cx('change-wallpaper')}
        >
          Change your wallpaper
        </Button>
      )}
      {open && (
        <div className="px-2 absolute bottom-1/4 right-8 z-10 rounded-2xl overflow-hidden">
          <input
            type="text"
            className="border border-gray-300 py-2 px-4 w-64 text-black outline-none"
            placeholder="Enter wallpaper link here"
            onChange={(e) => {
              setLink(e.target.value);
            }}
            value={link}
          />
          <button
            onClick={() => {
              if (!load) {
                setCurrentImage(link);
              }
              setLink('');
            }}
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
          >
            Save
          </button>
        </div>
      )}
      <div className={cx('user-display')}>
        <div className={cx('avatar-wrapper')}>
          <img src={guess.image || '/bocchi.jpg'} alt="avatar" className={cx('avatar')}></img>
          <div className={cx('user-information')}>
            <strong className={cx('user-name')}>{guess.name || guess.username}</strong>
            {!!guess.friend_list ? (
              <>
                <div className={cx('friends-count')}>
                  <span>{guess.friend_list.length}</span> friends
                </div>
                <div className={cx('friends-information')}>
                  {guess.friend_list.map((data, index) => {
                    if (index < 5) {
                      return (
                        <Tippy placement="bottom" key={index} content={data.username} delay={[250, 0]}>
                          <img
                            key={index}
                            src={data.image}
                            alt="avatar"
                            className={cx('friends-avatar')}
                            onClick={() => {
                              window.location.href = process.env.NEXT_PUBLIC_BASE_URL + '/user/' + data.username;
                            }}
                          ></img>
                        </Tippy>
                      );
                    }
                  })}
                </div>
              </>
            ) : (
              <>
                <div className={cx('friends-count')}>
                  <span>Only 1</span> friend
                </div>
                <div className={cx('friends-information')}>
                  <img
                    src={guess.image}
                    alt="avatar"
                    className={cx('friends-avatar')}
                    onClick={() => {
                      window.location.href = process.env.NEXT_PUBLIC_BASE_URL + '/user/' + guess.username;
                    }}
                  ></img>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={cx('profile-interact')}>
          {/* //TODO: make edit profile information feature */}
          {/* //TODO: handle myAnimeList connect feature */}
          {admin.username === guess.username ? (
            <>
              <Button
                onClick={() => {
                  if (!!!guess.myAnimeList_username) {
                    //TODO: handle log in with MAL later
                    console.log('not connect');
                  } else {
                    console.log('Already Connect');
                  }
                }}
                small
                gradient
                leftIcon={
                  guess.myAnimeList_username ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faPlug} />
                }
              >
                {guess.myAnimeList_username ? 'Connected with MAL' : 'Connect with MAL'}
              </Button>
              <Button small primary leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}>
                Edit profile
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {}}
                small
                gradient
                href={
                  guess.myAnimeList_username ? 'https://myanimelist.net/profile/' + guess.myAnimeList_username : false
                }
                leftIcon={<FontAwesomeIcon icon={faPlug} />}
              >
                {/*TODO: handle user haven't connected to MAL */}
                {guess.myAnimeList_username ? 'Visit MAL profile' : '....Feature'}
              </Button>
              <AddFriendBtn myUserInfo={admin} userInfo={guess}>
                {' '}
                Button{' '}
              </AddFriendBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ProfileHeader);
