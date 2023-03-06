/* eslint-disable @next/next/no-img-element */
'use client';
import classNames from 'classnames/bind';
import styles from './ProfileHeader.module.scss';
import Button from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPlug, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { setCookie } from 'cookies-next';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {doc, getDoc} from 'firebase/firestore';
import { db } from '@/firebase/firebase-app';

const cx = classNames.bind(styles);

function ProfileHeader({data}) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [load, setLoad] = useState(true);
  const [currentImage, setCurrentImage] = useState('/wallpaper.png');



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
        width = {1044}
        height = {281}
      ></img>
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
          <img src= {data.image} alt="avatar" className={cx('avatar')}></img>
          <div className={cx('user-information')}>
            <strong className={cx('user-name')}>{data.name || data.user }</strong>
            <div className={cx('friends-count')}>
              <span>5 </span> friends
            </div>
            <div className={cx('friends-information')}>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
            </div>
          </div>
        </div>
        <div className={cx('profile-interact')}>
          {/* //TODO: 2 types of button for @me / another user */}
          {/* //TODO: make edit profile information feature */}
          {/* //TODO: handle myAnimeList connect feature */}
          <Button
            onClick={() => {
              console.log('Login ');
            }}
            small
            gradient
            leftIcon={<FontAwesomeIcon icon={faPlug} />}
          >
            Connect with MAL
          </Button>
          <Button small primary leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>
            Add friend
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
