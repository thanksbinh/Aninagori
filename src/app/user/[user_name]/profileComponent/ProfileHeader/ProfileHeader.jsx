/* eslint-disable @next/next/no-img-element */
'use client';
import classNames from 'classnames/bind';
import styles from './ProfileHeader.module.scss';
import Button from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faImage, faPenToSquare, faPlug, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase-app';
import AddFriendBtn from './AddFriendBtn';
import { memo } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Avatar from '@/components/Avatar/Avatar';

const cx = classNames.bind(styles);

function ProfileHeader({ guess, admin }) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [load, setLoad] = useState(true);
  const [userName, setUserName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [wallpaper, setWallpaper] = useState('');
  const [currentImage, setCurrentImage] = useState('/wallpaper.png');
  const editBox = useRef();
  const editBoxWrapper = useRef();
  return (
    <div className={cx('wrapper')}>
      <div className={cx('modal')} ref={editBoxWrapper}>
        <div className={cx('modal_overlay')}></div>
        <div className={cx('modal_body')} ref={editBox}>
          <h4 className={cx('edit-title')}>Edit your profile information</h4>
          <div className={cx('form-group')}>
            <h5 className={cx('form-title')}>Username: </h5>
            <input
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              className={cx('form-control')}
              placeholder="Enter your display name"
            ></input>
          </div>
          <div className={cx('form-group')}>
            <h5 className={cx('form-title')}>Avatar link: </h5>
            <input
              onChange={(e) => {
                setAvatar(e.target.value);
              }}
              className={cx('form-control')}
              placeholder="Enter your avatar link"
            ></input>
          </div>
          <div className={cx('form-group')}>
            <h5 className={cx('form-title')}>Wallpaper link: </h5>
            <input
              onChange={async (e) => {
                setWallpaper(e.target.value);
              }}
              className={cx('form-control')}
              placeholder="Enter your wallpaper link"
            ></input>
          </div>
          <div className={cx('form-btn')}>
            <Button
              small
              primary
              to={undefined}
              href={undefined}
              onClick={() => {
                editBox.current.classList.add(cx('Fadeout'));
                editBox.current.classList.remove(cx('Fadein'));
                setTimeout(() => {
                  editBox.current.classList.remove(cx('Fadeout'));
                  editBoxWrapper.current.style.display = 'none';
                }, 300);
              }}
              leftIcon={undefined}
              rightIcon={undefined}
            >
              Close
            </Button>
            <Button
              small
              primary
              to={undefined}
              href={undefined}
              onClick={async () => {
                const docRef = doc(db, 'users', admin.id);
                if (userName !== '') {
                  await updateDoc(docRef, {
                    name: userName
                  });
                }
                if(wallpaper !== '') {
                  await updateDoc(docRef, {
                    wallpaper: wallpaper
                  });
                }
                if(avatar !== '') {
                  await updateDoc(docRef, {
                    image: avatar
                  });
                }
                if(userName !== '' || wallpaper !== '' || avatar !== '') {
                  location.reload();
                } else {
                  alert('Please fill up at least 1 fill :((')
                }
              }}
              leftIcon={undefined}
              rightIcon={undefined}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <img
        src={guess.wallpaper || currentImage}
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
        <div className="px-2 absolute bottom-1/4 right-3 z-10 rounded-2xl overflow-hidden">
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
            onClick={async() => {
              if (!load) {
                setCurrentImage(link);
                const docRef = doc(db, 'users', admin.id);
                if (link !== '') {
                  await updateDoc(docRef, {
                    wallpaper: link
                  });
                  setLink('');
                  location.reload();
                }
              }
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
              <Button
                onClick={() => {
                  editBox.current.classList.add(cx('Fadein'));
                  editBoxWrapper.current.style.display = 'flex';
                }}
                small
                primary
                leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
              >
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

export default ProfileHeader;
