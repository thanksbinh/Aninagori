/* eslint-disable @next/next/no-img-element */
import StatusWrapper from '../StatusWrapper/StatusWrapper';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './AnimeUpdate.module.scss';
import { ProgressChild } from '../AnimeStatus/AnimeStatus';
import { Img } from '../AnimeFavorite/AnimeFavorite';
import { useSession } from 'next-auth/react';
import { memo } from "react";
const cx = classNames.bind(styles);

function AnimeUpdate({data}) {
  return (
    <StatusWrapper title="Last Anime Updates">
      {!!data.updates && data.updates.anime.map((anime, key) => {
          return (
            <div className={cx('wrapper')} key = {key}>
            <p className={cx('time-line')}>{convertDateString(anime.date)}</p>
            <div className={cx('update-information')}>
              <Img href= {anime.entry.url} className={cx('anime-pic')} src= {anime.entry.images.jpg.image_url} alt="anime pic" />
              <div className={cx('more-detail')}>
                <a className={cx('anime-name')} href="">
                  {anime.entry.title}
                </a>
                <div className={cx('progress-bar')}>
                  <ProgressChild className={cx('progress-percent')} percent = {convertToPercent(anime.episodes_seen, anime.episodes_total)}></ProgressChild>
                </div>
                <div className={cx('status-wrapper')}>
                  {anime.status} <span className={cx('highlight')}>{anime.episodes_seen}</span>/{anime.episodes_total} - Scored{' '}
                  <span className={cx('highlight')}>{anime.score}</span>
                </div>
              </div>
            </div>
          </div>
          )
      })}
    </StatusWrapper>
  );
}

function convertDateString(dateString) {
  var date = new Date(dateString);
  var today = new Date();
  var options = {timeZone: 'Asia/Ho_Chi_Minh'};
  var dateInHCM = new Date(date.toLocaleString('en-US', options));
  var todayInHCM = new Date(today.toLocaleString('en-US', options));
  var diffDays = Math.floor((todayInHCM - dateInHCM) / (1000 * 60 * 60 * 24));
  var output = "";
   if (diffDays === 0) {
     output += "Today";
   } else if (diffDays === 1) {
     output += "Yesterday";
   } else if (diffDays >1 && diffDays <=7) {
     output += diffDays + " days ago";
   } else {
     output += dateInHCM.getDate() + "-" + (dateInHCM.getMonth() +1) + "-" + dateInHCM.getFullYear();
   }
   output += ", ";
   var options2 = {timeStyle: 'medium'};
   output += dateInHCM.toLocaleTimeString('en-US', options2);
   return output;
}


export function convertToPercent(seen, total) {
    if(seen == 0) return 0;
    else {
      const percent = (seen / total).toFixed(6) * 100; 
      return percent; 
    }
}

export default memo(AnimeUpdate);
