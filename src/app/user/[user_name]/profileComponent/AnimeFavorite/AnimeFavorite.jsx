/* eslint-disable @next/next/no-img-element */
import StatusWrapper from '../StatusWrapper/StatusWrapper';
import classNames from 'classnames/bind';
import styles from './AnimeFavorite.module.scss';
const cx = classNames.bind(styles);

function AnimeFavorite() {
  return (
    <StatusWrapper title="Favourite">
      <FavoriteChild title="Anime" count="10" />
      <FavoriteChild title="Character" count="20" />
    </StatusWrapper>
  );
}

function FavoriteChild({ title, count }) {
  const number = `(${count})`;
  return (
    <>
      <p className={cx('title')}>
        {title} {number}
      </p>
      <div className={cx('wrapper')}>
        <img className={cx('image')} src="/animePic.jpg" alt="image"></img>
        <img className={cx('image')} src="/animePic.jpg" alt="image"></img>
        <img className={cx('image')} src="/animePic.jpg" alt="image"></img>
        <img className={cx('image')} src="/animePic.jpg" alt="image"></img>
        <img className={cx('image')} src="/animePic.jpg" alt="image"></img>
        <img className={cx('image')} src="/animePic.jpg" alt="image"></img>
        <img className={cx('image')} src="/animePic.jpg" alt="image"></img>
        <img className={cx('image')} src="/animePic.jpg" alt="image"></img>
      </div>
    </>
  );
}

export default AnimeFavorite;
