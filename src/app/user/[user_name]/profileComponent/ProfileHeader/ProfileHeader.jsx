/* eslint-disable @next/next/no-img-element */
'use client';
import classNames from 'classnames/bind';
import styles from './ProfileHeader.module.scss';
import Button from '@/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const cx = classNames.bind(styles);

function ProfileHeader() {
  return (
    <div className={cx('wrapper')}>
      <img src="/wallpaper.png" alt="wallpaper" className={cx('wallpaper')}></img>
      <div className={cx('user-display')}>
        <div className={cx('avatar-wrapper')}>
          <img src="/bocchi.jpg" alt="avatar" className={cx('avatar')}></img>
          <div className={cx('user-information')}>
            <strong className={cx('user-name')}>LostArrows</strong>
            <div className={cx('friends-count')}>
              <span>5 </span> friends
            </div>
            <div className={cx('friends-information')}>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
              <img src="/bocchi.jpg" alt="avatar" className={cx('friends-avatar')}></img>
            </div>
          </div>
        </div>
        <div className={cx('profile-interact')}>
          <Button small gradient leftIcon={<FontAwesomeIcon icon={faPlug} />}>
            Connect with MAL
          </Button>
          <Button small primary leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>
            Add friend
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
