/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { HiPhoto, HiVideoCamera } from 'react-icons/hi2';
import { FC, useRef, useState } from 'react';
import Avatar from '../avatar/Avatar';
import classNames from 'classnames/bind';
import styles from './PostForm.module.scss';
import PostFormPopUp from './PostFormPopUp';
const cx = classNames.bind(styles);

type PostFormProps = {
  username: string;
  avatarUrl: string;
  setOpen?: any;
  open?: any;
  className?: any;
};

const PostForm: FC<PostFormProps> = ({ username, avatarUrl, className = '' }) => {
  const [open, setOpen] = useState(false);

  function openForm() {
    setTimeout(() => {
      setOpen(true);
    }, 90);
  }

  return (
    <div className={className}>
      <PostFormPopUp username={username} avatarUrl={avatarUrl} setOpen={setOpen} open={open} />
      <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl px-4 my-4">
        <div className="flex justify-between items-center mt-4">
          <Avatar imageUrl={avatarUrl} altText={username} size={8} />
          <div
            onClick={() => {
              openForm();
            }}
            className="cursor-default flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-[#212833] hover:bg-[#4e5d78] caret-white"
          >
            Share your favourite Animemory now!
          </div>
        </div>

        <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
          <label
            onClick={() => {
              openForm();
            }}
            className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
          >
            <HiPhoto className="w-5 h-5 fill-[#3BC361]" />
            <span>Photo/Gif</span>
          </label>

          <label
            onClick={() => {
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

export default PostForm;
