'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { FC } from 'react';
import Avatar from '../avatar/Avatar';
import PostOptions from './option/PostOptions';
import { VideoComponent } from './Video';
import classNames from 'classnames/bind';
import styles from './PostContent.module.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import AnimeName from './animePostComponent/AnimeName';
import { useState } from 'react';
const cx = classNames.bind(styles);

type PostStaticProps = {
  authorName?: string;
  avatarUrl?: string;
  timestamp?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  id: string;
  animeID?: number;
  animeName?: string;
  watchingProgess?: string;
  episodesSeen?: number;
  episodesTotal?: number;
  tag?: any;
};

const PostContent: FC<PostStaticProps> = ({
  authorName = '',
  avatarUrl = '',
  timestamp,
  content,
  imageUrl,
  videoUrl,
  animeID = '12403',
  animeName = 'Unknowned Anime',
  watchingProgess = 'is sharing',
  episodesSeen = 0,
  episodesTotal = 13,
  tag = [],
}) => {
  const [spoiler, setSpoiler] = useState(() => {
    return tag.some((a: any) => {
      return a === 'Spoiler';
    });
  });
  return (
    <div className="flex flex-col flex-1 bg-[#191c21] relative rounded-2xl p-4 pb-0 rounded-b-none">
      {spoiler && (
        <>
          <div
            className={cx('spoiler-button')}
            onClick={() => {
              setSpoiler(false);
            }}
          >
            SPOILER
          </div>
          <div className={cx('spoiler-overlay')}></div>
        </>
      )}
      <div className="flex items-center space-x-4 mx-2">
        <Link href={'/user/' + authorName}>
          <Avatar imageUrl={avatarUrl} altText={authorName} size={10} />
        </Link>
        <div style={{ width: '430px' }}>
          <div className="flex item-center font-bold text-[#dddede]">
            <div className={cx('info-wrapper')}>
              <Link href={'/user/' + authorName} className={`${cx('user-name')}`}>
                {authorName}
              </Link>
              <p className={cx('watch-status')}>{watchingProgess}</p>
              <AnimeName animeName={animeName} animeID={animeID as any} seen={episodesSeen} total={episodesTotal} />
              <div className="m-2">
                <PostOptions />
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-sm">{timestamp}</p>
        </div>
      </div>
      <div className={cx('tag-wrapper')}>
        {tag.map((data: any, index: any) => {
          return <PostTag key={index}>#{data}</PostTag>;
        })}
      </div>
      <p className="text-lg mx-2 mt-3 mb-2 text-[#dddede] mx-2)}">{content}</p>
      <div className="mt-4 mx-2 relative">
        {imageUrl && (
          <img
            draggable="false"
            src={imageUrl}
            alt={''}
            className={`cursor-pointer rounded-2xl ${cx({ 'blur-3xl': spoiler })}`}
          />
        )}
        {videoUrl && <VideoComponent videoUrl={videoUrl} className={cx('')} />}
      </div>
    </div>
  );
};

function PostTag({ children }: { children: any }) {
  return <div className={cx('tag')}>{children}</div>;
}

export default PostContent;
