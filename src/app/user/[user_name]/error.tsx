"use client"

import classNames from "classnames/bind"
import styles from "./Profile.module.scss"

const cx = classNames.bind(styles)

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className={cx("profile-wrapper")}>
      <div className={cx("profile-content")}>
        <div className="flex justify-center pt-10 h-screen">
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </div>
    </div>
  )
}
