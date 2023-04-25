/* eslint-disable @next/next/no-img-element */
import StatusWrapper from "../StatusWrapper/StatusWrapper"
import classNames from "classnames/bind"
import styles from "./AnimeFavorite.module.scss"
const cx = classNames.bind(styles)

function AnimeFavorite({ favorite_data }) {
  return (
    <div className="px-5 pb-1 pt-5 mb-5 rounded-xl bg-ani-black lg-between:flex-1 lg-between:max-w-full">
      <h4 className="inline-block w-full font-bold pb-2 mb-3 border-b-2 border-b-[rgb(197,198,199)]">Favorite</h4>
      {!!favorite_data.anime && (
        <>
          <FavoriteChild title="Anime" count={favorite_data.anime.length} data={favorite_data.anime} />
          <FavoriteChild title="Character" count={favorite_data.characters.length} data={favorite_data.characters} />
        </>
      )}
    </div>
  )
}

function FavoriteChild({ title, count, data }) {
  const number = `(${count})`
  return (
    <>
      <p className={cx("title")}>
        {title} {number}
      </p>
      <div className={cx("wrapper")}>
        {!!data &&
          data.map((fav, key) => {
            return <Img key={key} className={cx("image")} src={fav.images.jpg.image_url} alt="image" href={fav.url} />
          })}
      </div>
    </>
  )
}

export function Img({ href, className, src, alt }) {
  return (
    <a href={href} target="_blank">
      <img src={src} alt={alt} className={className}></img>
    </a>
  )
}

export default AnimeFavorite
