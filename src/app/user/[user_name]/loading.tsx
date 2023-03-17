import classNames from "classnames/bind";
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

export default function loading() {
  return (
    <div className={cx('profile-wrapper')}>
      <div className={cx('profile-content')}>
        <div className="h-screen">Loading...</div>
      </div>
    </div>
  )
}
