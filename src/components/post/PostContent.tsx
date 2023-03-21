/* eslint-disable @next/next/no-img-element */
import { FC } from 'react';
import Avatar from '../avatar/Avatar';
import { VideoComponent } from './Video';
import classNames from 'classnames/bind';
import styles from './PostContent.module.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import AnimeName from './animePostComponent/AnimeName';
const cx = classNames.bind(styles);

type PostStaticProps = {
  authorName: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
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
  authorName,
  avatarUrl,
  timestamp,
  content,
  imageUrl,
  videoUrl,
  animeID = '12403',
  animeName = 'Yuru Yuri Nachuyachumi!',
  watchingProgess = 'is watching',
  episodesSeen = 6,
  episodesTotal = 13,
  tag = [],
}) => {
  return (
    <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-4 pb-0 rounded-b-none">
      <div className="flex items-center space-x-4 mx-2">
        <a href={'/user/' + authorName}>
          <Avatar imageUrl={avatarUrl} altText={authorName} size={10} />
        </a>
        <div style={{ width: '430px' }}>
          <div className="flex item-center font-bold text-[#dddede]">
            <div className={cx('info-wrapper')}>
              <a href={'/user/' + authorName} className={`${cx('user-name')}`}>
                {authorName}
              </a>
              <p className={cx('watch-status')}>{watchingProgess}</p>
              <AnimeName animeName={animeName} animeID={animeID as any} seen={episodesSeen} total={episodesTotal} />
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
      <p className="text-lg mt-3 mb-2 text-[#dddede] mx-2">{content}</p>
      <div className="mt-4 mx-2">
        {imageUrl && <img src={imageUrl} alt={''} className="rounded-2xl" />}
        {videoUrl && <VideoComponent videoUrl={videoUrl} />}
      </div>
    </div>
  );
};

function PostTag({ children }: { children: any }) {
  return <div className={cx('tag')}>{children}</div>;
}

export default PostContent;
