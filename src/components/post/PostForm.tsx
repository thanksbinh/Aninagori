/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { HiPhoto, HiVideoCamera } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import { FC, useRef, useState } from 'react';
import { db, storage } from '@/firebase/firebase-app';
import Avatar from '../avatar/Avatar';
import { v4 } from 'uuid';
import classNames from 'classnames/bind';
import styles from './PostForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faSpinner } from '@fortawesome/free-solid-svg-icons';

import AnimeSearch from './animePostComponent/AnimeSearch';
import { Img } from '@/app/user/[user_name]/profileComponent/AnimeFavorite/AnimeFavorite';
import AnimeWatchStatus from './animePostComponent/AnimeWatchStatus';
import AnimeEpisodes from './animePostComponent/AnimeEpisodes';
const cx = classNames.bind(styles);

type PostFormProps = {
  username: string;
  avatarUrl: string;
  setOpen?: any;
  open?: any;
};

const PostForm: FC<PostFormProps> = ({ username, avatarUrl }) => {
  const [open, setOpen] = useState(false);

  function openForm() {
    setTimeout(() => {
      setOpen(true);
    }, 90);
  }

  return (
    <div>
      <PostFormPopUp username={username} avatarUrl={avatarUrl} setOpen={setOpen} open={open} />
      <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl px-4 my-4">
        <div className="flex justify-between items-center mt-4">
          <Avatar imageUrl={avatarUrl} altText={username} size={8} />
          <div
            onClick={() => {
              openForm();
              // setRerender(!rerender);
            }}
            className="cursor-default flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-[#212833] hover:bg-[#4e5d78] caret-white"
          >
            Share your favourite Animemory now!
          </div>
        </div>

        <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
          <label
            onClick={() => {
              // setRerender(!rerender);
              openForm();
            }}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
          >
            <HiPhoto className="w-5 h-5 fill-[#3BC361]" />
            <span>Photo/Gif</span>
          </label>

          <label
            onClick={() => {
              // setRerender(!rerender);
              openForm();
            }}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
          >
            <HiVideoCamera className="w-5 h-5 fill-[#FF1D43]" />
            <span>Video</span>
          </label>

          <button
            onClick={() => {
              setOpen(true);
            }}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1"
          >
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const PostFormPopUp: FC<PostFormProps> = ({ username, avatarUrl, setOpen, open }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaUrl, setMediaUrl] = useState<any>(null);
  const [mediaType, setMediaType] = useState<string>('');
  const router = useRouter();
  const animeStatus = useRef();
  const animeSearch = useRef();
  const animeEpisodes = useRef();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    console.log((animeStatus?.current as any).getAnimeStatus());
    console.log((animeSearch?.current as any).getAnimeName());
    console.log((animeEpisodes?.current as any).getAnimeEpisodes());
    e.preventDefault();
    if (!inputRef.current?.value && !mediaUrl) return;

    const downloadMediaUrl = await uploadMedia();
    await addDoc(collection(db, 'posts'), {
      authorName: username,
      avatarUrl: avatarUrl,
      timestamp: serverTimestamp(),
      content: inputRef.current?.value || '',
      imageUrl: mediaType === 'image' ? downloadMediaUrl : '',
      videoUrl: mediaType === 'video' ? downloadMediaUrl : '',
      // Todo: Remove comments: 0
      comments: 0,
    });

    inputRef.current!.value = '';
    setMediaUrl(null);

    router.refresh();
  }

  const uploadMedia = async () => {
    if (mediaUrl == null) return '';

    const mediaRef = ref(storage, `posts/${mediaUrl.name + v4()}`);
    const snapshot = await uploadBytes(mediaRef, mediaUrl);
    const downloadMediaUrl = await getDownloadURL(snapshot.ref);

    return downloadMediaUrl;
  };

  const handleMediaChange = (e: any, mediaType: string) => {
    // Todo: multi media file
    const file = e.target.files[0];
    if (!file) return;

    setMediaType(mediaType);
    setMediaUrl(file);
  };

  return (
    <div
      onClick={() => {
        setTimeout(() => {
          setOpen(false);
        }, 90);
      }}
      className={cx('modal')}
      style={open ? { display: 'flex' } : { display: 'none' }}
    >
      <div className={cx('modal_overlay')}></div>
      <form
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl px-4 my-4">
          <div className="flex justify-start mt-4 px-2 mb-4 items-start">
            <Avatar imageUrl={avatarUrl} altText={username} size={10} />
            <h4 className="text-base font-bold ml-4">{username}</h4>
          </div>
          <div className={cx('status-wrapper')}>
            <AnimeWatchStatus ref={animeStatus} />
            <AnimeSearch ref={animeSearch} animeEpsRef={animeEpisodes} />
            <AnimeEpisodes ref={animeEpisodes} />
          </div>
          <input
            type="text"
            ref={inputRef}
            placeholder="Share your favourite Animemory now!"
            className="flex rounded-3xl py-3 px-4 w-full focus:outline-none bg-[#212833] caret-white"
          />

          <div className="mt-4 w-2/3">
            {mediaUrl &&
              (mediaUrl.name.endsWith('.mp4') ? (
                <video src={URL.createObjectURL(mediaUrl)} controls />
              ) : (
                <img src={URL.createObjectURL(mediaUrl)} className="w-full object-contain" />
              ))}
          </div>

          <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
            <label
              htmlFor="image-input"
              className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
            >
              <HiPhoto className="w-5 h-5 fill-[#3BC361]" />
              <span>Photo/Gif</span>
            </label>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              onChange={(e) => handleMediaChange(e, 'image')}
              className="hidden"
            />

            <label
              htmlFor="video-input"
              className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
            >
              <HiVideoCamera className="w-5 h-5 fill-[#FF1D43]" />
              <span>Video</span>
            </label>
            <input
              type="file"
              id="video-input"
              accept="video/*"
              onChange={(e) => handleMediaChange(e, 'video')}
              className="hidden"
            />

            <button
              type="submit"
              className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1"
            >
              <span>Share</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
