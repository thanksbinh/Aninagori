/* eslint-disable @next/next/no-img-element */
import AnimeFavorite from "@/app/user/[user_name]/profileComponent/AnimeFavorite/AnimeFavorite"
import AnimeStatus from "@/app/user/[user_name]/profileComponent/AnimeStatus/AnimeStatus"
import AnimeUpdate from "@/app/user/[user_name]/profileComponent/AnimeUpdate/AnimeUpdate"
import ProfileHeader from "@/app/user/[user_name]/profileComponent/ProfileHeader/ProfileHeader"
import classNames from "classnames/bind"
import styles from "./Profile.module.scss"

const cx = classNames.bind(styles)

export default function loading() {
  return (
    <div className={cx("profile-wrapper")}>
      <div className={cx("profile-content")}>
        <ProfileHeader guess={null} admin={null} />
        <div className={cx("profile-body-wrapper")}>
          <div className={cx("status-section")}>
            {/* @ts-expect-error Server Component */}
            <AnimeUpdate data={[]} />
            <AnimeStatus statusData={{}} />
            <AnimeFavorite favorite_data={{}} />
          </div>
        </div>
      </div>
    </div>
  )
}