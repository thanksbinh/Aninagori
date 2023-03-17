/* eslint-disable @next/next/no-img-element */
import StatusWrapper from '../StatusWrapper/StatusWrapper';
import classNames from 'classnames/bind';
import styles from './AnimeUpdate.module.scss';
import { ProgressChild } from '../AnimeStatus/AnimeStatus';
import { getAnimeTotal } from '@/app/api/apiServices/getServices';
import { Img } from '../AnimeFavorite/AnimeFavorite';
const cx = classNames.bind(styles);

async function AnimeUpdate({ data }) {
  if (data.length !== 0) {
    const updateArr = data;
    const id = updateArr.map((e) => {
      return getAnimeTotal(e.node.id);
    });
    const totalArr = await Promise.all([id[0], id[1], id[2]]);
    const newUpdateArr = updateArr.map((data, index) => {
      let status = data.list_status.status;
      switch (status) {
        case 'completed':
          status = 'Completed';
          break;
        case 'plan_to_watch':
          status = 'Plan To Watch';
          break;
        case 'watching':
          status = 'Watching';
          break;
        case 'on_hold':
          status = 'On Hold';
          break;
        default:
          status = 'Unknow Status';
          break;
      }
      if (data.list_status.is_rewatching) {
        status = 'Re Watching';
      }
      data.list_status.status = status;
      data.list_status.num_episodes_total = totalArr[index].data.num_episodes;
      return data;
    });
    data = newUpdateArr;
  }
  return (
    <StatusWrapper title="Last Anime Updates">
      {!!data &&
        data.map((anime, key) => {
          return (
            <div className={cx('wrapper')} key={key}>
              <p className={cx('time-line')}>{convertDateString(anime.list_status.updated_at)}</p>
              <div className={cx('update-information')}>
                <Img
                  href={'https://myanimelist.net/anime/' + anime.node.id}
                  className={cx('anime-pic')}
                  src={anime.node.main_picture.medium}
                  alt="anime pic"
                />
                <div className={cx('more-detail')}>
                  <a className={cx('anime-name')} href={'https://myanimelist.net/anime/' + anime.node.id}>
                    {anime.node.title}
                  </a>
                  <div className={cx('progress-bar')}>
                    <ProgressChild
                      className={cx('progress-percent')}
                      percent={convertToPercent(
                        anime.list_status.num_episodes_watched,
                        anime.list_status.num_episodes_total,
                      )}
                    ></ProgressChild>
                  </div>
                  <div className={cx('status-wrapper')}>
                    {anime.list_status.status}{' '}
                    <span className={cx('highlight')}>{anime.list_status.num_episodes_watched}</span>/
                    {anime.list_status.num_episodes_total} - Scored{' '}
                    <span className={cx('highlight')}>{anime.list_status.score}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </StatusWrapper>
  );
}

function convertDateString(dateString) {
  var date = new Date(dateString);
  var today = new Date();
  var options = { timeZone: 'Asia/Ho_Chi_Minh' };
  var dateInHCM = new Date(date.toLocaleString('en-US', options));
  var todayInHCM = new Date(today.toLocaleString('en-US', options));
  var diffDays = todayInHCM.getDate() - dateInHCM.getDate();
  var output = '';
  if (diffDays === 0) {
    output += 'Today';
  } else if (diffDays === 1) {
    output += 'Yesterday';
  } else if (diffDays > 1 && diffDays <= 7) {
    output += diffDays + ' days ago';
  } else {
    output += dateInHCM.getDate() + '/' + (dateInHCM.getMonth() + 1) + '/' + dateInHCM.getFullYear();
  }
  output += ', ';
  var options2 = { timeStyle: 'medium' };
  output += dateInHCM.toLocaleTimeString('en-US', options2);
  return output;
}

export function convertToPercent(seen, total) {
  if (seen == 0) return 0;
  else {
    const percent = (seen / total).toFixed(6) * 100;
    return percent;
  }
}

export default AnimeUpdate;
