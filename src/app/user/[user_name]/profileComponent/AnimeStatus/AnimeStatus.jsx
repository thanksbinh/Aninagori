import StatusWrapper from '../StatusWrapper/StatusWrapper';
import classNames from 'classnames/bind';
import styles from './AnimeStatus.module.scss';
import { memo } from 'react';
import { convertToPercent } from '../AnimeUpdate/AnimeUpdate';
const cx = classNames.bind(styles);

function AnimeStatus({ data }) {
  return (
    <StatusWrapper title="Anime Stats">
      {!!data.updates && (
        <>
          <div className={cx('stats-number')}>
            <p>
              Days: <span className={cx('highlight')}>{data.statistics.anime.days_watched}</span>
            </p>
            <p>
              Mean Score: <span className={cx('highlight')}>{data.statistics.anime.mean_score}</span>
            </p>
          </div>
          <div className={cx('progress-bar')}>
            <ProgressChild
              percent={convertToPercent(data.statistics.anime.watching, data.statistics.anime.total_entries)}
              color="#1CE318"
            />
            <ProgressChild
              percent={convertToPercent(data.statistics.anime.completed, data.statistics.anime.total_entries)}
              color="#1C4CF2"
            />
            <ProgressChild
              percent={convertToPercent(data.statistics.anime.on_hold, data.statistics.anime.total_entries)}
              color="#DBDE22"
            />
            <ProgressChild
              percent={convertToPercent(data.statistics.anime.dropped, data.statistics.anime.total_entries)}
              color="#E93030"
            />
          </div>
          <div className={cx('status-note')}>
            <div className={cx('progress-note')}>
              <StatusNoteChild
                color="#1CE318"
                title="Watching"
                number={data.statistics.anime.watching}
                className={cx('note-child')}
              />
              <StatusNoteChild
                color="#1C4CF2"
                title="Completed"
                number={data.statistics.anime.completed}
                className={cx('note-child')}
              />
              <StatusNoteChild
                color="#DBDE22"
                title="On-hold"
                number={data.statistics.anime.on_hold}
                className={cx('note-child')}
              />
              <StatusNoteChild
                color="#E93030"
                title="Drop"
                number={data.statistics.anime.dropped}
                className={cx('note-child')}
              />
              <StatusNoteChild
                color="#757B85"
                title="Plan to Watch"
                number={data.statistics.anime.plan_to_watch}
                className={cx('note-child')}
              />
            </div>
            <div className={cx('watch-note')}>
              <div className={cx('watch-wrapper')}>
                <span className={cx('watch-title')}>Total Entries</span>
                <span className={cx('watch-number')}>{data.statistics.anime.total_entries}</span>
              </div>
              <div className={cx('watch-wrapper')}>
                <span className={cx('watch-title')}>Rewatched</span>
                <span className={cx('watch-number')}>{data.statistics.anime.rewatched}</span>
              </div>
              <div className={cx('watch-wrapper')}>
                <span className={cx('watch-title')}>Episodes</span>
                <span className={cx('watch-number')}>{data.statistics.anime.episodes_watched}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </StatusWrapper>
  );
}

function StatusNoteChild({ color, title, number }) {
  return (
    <div className={cx('status-wrapper')}>
      <div className={cx('status-round')} style={{ backgroundColor: `${color}` }}></div>
      <div className={cx('status-text-wrapper')}>
        <p className={cx('status')}>{title}</p>
        <p className={cx('status-number')}>{number}</p>
      </div>
    </div>
  );
}

export function ProgressChild({ percent, color = '#1ce318', className }) {
  return (
    <div style={{ width: `${percent}%`, backgroundColor: `${color}`, height: '100%' }} className={className}></div>
  );
}

export default memo(AnimeStatus);
