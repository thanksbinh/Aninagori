/* eslint-disable @next/next/no-img-element */
import StatusWrapper from '../StatusWrapper/StatusWrapper';
import classNames from 'classnames/bind';
import styles from './AnimeFavorite.module.scss';
import Link from 'next/link';
const cx = classNames.bind(styles);

function AnimeFavorite({ favorite_data }) {
  return (
    <StatusWrapper title="Favourite">
      {!!favorite_data.anime && (
        <>
          <FavoriteChild title="Anime" count={favorite_data.anime.length} data={favorite_data.anime} />
          <FavoriteChild title="Character" count={favorite_data.characters.length} data={favorite_data.characters} />
        </>
      )}
    </StatusWrapper>
  );
}

function FavoriteChild({ title, count, data }) {
  const number = `(${count})`;
  return (
    <>
      <p className={cx('title')}>
        {title} {number}
      </p>
      <div className={cx('wrapper')}>
        {!!data &&
          data.map((fav, key) => {
            return <Img key={key} className={cx('image')} src={fav.images.jpg.image_url} alt="image" href={fav.url} />;
          })}
      </div>
    </>
  );
}

export function Img({ href, className, src, alt }) {
  return (
    <Link href={href}>
      <img src={src} alt={alt} className={className}></img>
    </Link>
  );
}

export default AnimeFavorite;
