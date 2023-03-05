/* eslint-disable @next/next/no-img-element */
import StatusWrapper from '../StatusWrapper/StatusWrapper';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './AnimeUpdate.module.scss';
const cx = classNames.bind(styles);

function AnimeUpdate() {
  return (
    <StatusWrapper title="Last Anime Updates">
      <div className={cx('wrapper')}>
        <p className={cx('time-line')}>Yesterday, 10:14 AM</p>
        <div className={cx('update-information')}>
          <img className={cx('anime-pic')} src="/animePic.jpg" alt="anime pic"></img>
          <div className={cx('more-detail')}>
            <h5 className={cx('anime-name')}>Saenai Kanojo no Sodatekata</h5>
            <div className={cx('progress-bar')}>
              <div className={cx('progress-percent')}></div>
            </div>
            <div className={cx('status-wrapper')}>
              Watching <span className={cx('highlight')}>20</span>/26 - Scored{' '}
              <span className={cx('highlight')}>9</span>
            </div>
          </div>
        </div>
      </div>
      <div className={cx('wrapper')}>
        <p className={cx('time-line')}>Yesterday, 10:14 AM</p>
        <div className={cx('update-information')}>
          <img className={cx('anime-pic')} src="/animePic.jpg" alt="anime pic"></img>
          <div className={cx('more-detail')}>
            <h5 className={cx('anime-name')}>Saenai Kanojo no Sodatekata</h5>
            <div className={cx('progress-bar')}>
              <div className={cx('progress-percent')}></div>
            </div>
            <div className={cx('status-wrapper')}>
              Watching <span className={cx('highlight')}>20</span>/26 - Scored{' '}
              <span className={cx('highlight')}>9</span>
            </div>
          </div>
        </div>
      </div>
      <div className={cx('wrapper')}>
        <p className={cx('time-line')}>Yesterday, 10:14 AM</p>
        <div className={cx('update-information')}>
          <img className={cx('anime-pic')} src="/animePic.jpg" alt="anime pic"></img>
          <div className={cx('more-detail')}>
            <h5 className={cx('anime-name')}>Saenai Kanojo no Sodatekata</h5>
            <div className={cx('progress-bar')}>
              <div className={cx('progress-percent')}></div>
            </div>
            <div className={cx('status-wrapper')}>
              Watching <span className={cx('highlight')}>20</span>/26 - Scored{' '}
              <span className={cx('highlight')}>9</span>
            </div>
          </div>
        </div>
      </div>
    </StatusWrapper>
  );
}

function convertToLocalTime(dateString) {
  //TODO: if date was yesterday or 1-7 day ago will have different format
  const dateObject = new Date(dateString);
  return dateObject.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
}

export default AnimeUpdate;
