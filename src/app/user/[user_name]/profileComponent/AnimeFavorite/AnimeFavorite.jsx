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
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
        <Img className={cx('image')} src="/animePic.jpg" alt="image" href='https://google.com'/>
      </div>
    </>
  );
}

export function Img({ href, className, src, alt}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={() => {
        window.location.href = href;
      }}
    ></img>
  );
}

export default AnimeFavorite;
