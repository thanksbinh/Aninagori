'use client';
import classNames from 'classnames/bind';
import styles from './PostContent.module.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { convertToPercent } from '@/app/user/[user_name]/profileComponent/AnimeUpdate/AnimeUpdate';
const cx = classNames.bind(styles);

function AnimeName({
  animeName,
  animeID,
  seen,
  total,
}: {
  animeName: string;
  animeID: string;
  seen: number;
  total: number;
}) {
  console.log(convertToPercent(seen, total));

  return (
    <Tippy
      className={cx('tippy-anime-name')}
      placement="bottom"
      content={`${animeName}: ${seen} / ${total}`}
      delay={[250, 0]}
    >
      <div
        onClick={() => {
          window.open('https://myanimelist.net/anime/' + animeID);
        }}
        className={cx('anime-name')}
        style={
          seen !== 0
            ? {
                backgroundImage: `linear-gradient(to right, #c574cc ${convertToPercent(
                  seen,
                  total,
                )}%, #444444 ${convertToPercent(
                    seen,
                    total,)}%)`,
              }
            : { backgroundColor: '#444444' }
        }
      >
        <div className={cx('progress-name')}>{animeName}</div>
      </div>
    </Tippy>
  );
}

export default AnimeName;
