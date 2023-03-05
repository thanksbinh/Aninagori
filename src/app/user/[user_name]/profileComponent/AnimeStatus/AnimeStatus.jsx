import StatusWrapper from '../StatusWrapper/StatusWrapper';
import classNames from 'classnames/bind';
import styles from './AnimeStatus.module.scss';
const cx = classNames.bind(styles);

function AnimeStatus() {
  return (
    <StatusWrapper title="Anime Stats">
      <div className={cx('stats-number')}>
        <p>
          Days: <span className={cx('highlight')}>14</span>
        </p>
        <p>
          Mean Score: <span className={cx('highlight')}>8.26</span>
        </p>
      </div>
      <div className={cx('progress-bar')}>
        <ProgressChild percent="10" color="#1CE318" />
        <ProgressChild percent="20" color="#1C4CF2" />
        <ProgressChild percent="30" color="#DBDE22" />
        <ProgressChild percent="10" color="#E93030" />
      </div>
      <div className={cx('status-note')}>
        <div className={cx('progress-note')}>
          <StatusNoteChild color="#1CE318" title="Watching" number="4" className={cx('note-child')} />
          <StatusNoteChild color="#1C4CF2" title="Completed" number="4" className={cx('note-child')} />
          <StatusNoteChild color="#DBDE22" title="On-hold" number="4" className={cx('note-child')} />
          <StatusNoteChild color="#E93030" title="Drop" number="4" className={cx('note-child')} />
          <StatusNoteChild color="#757B85" title="Plan to Watch" number="4" className={cx('note-child')} />
        </div>
        <div className={cx('watch-note')}>
          <div className={cx('watch-wrapper')}>
            <span className={cx('watch-title')}>Total Entries</span>
            <span className={cx('watch-number')}>156</span>
          </div>
          <div className={cx('watch-wrapper')}>
            <span className={cx('watch-title')}>Rewatched</span>
            <span className={cx('watch-number')}>1</span>
          </div>
          <div className={cx('watch-wrapper')}>
            <span className={cx('watch-title')}>Episodes</span>
            <span className={cx('watch-number')}>13</span>
          </div>
        </div>
      </div>
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

export default AnimeStatus;
