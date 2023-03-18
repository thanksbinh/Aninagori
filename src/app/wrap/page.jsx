import Avatar from '@/components/avatar/Avatar';
import { VideoComponent } from '@/components/post/Video';
import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
const cx = classNames.bind(styles);

function Page() {
  return (
    <div className="flex flex-col lg:w-2/5 w-3/5 mt-20 items-center justify-center">
      <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl p-4 pb-0 rounded-b-none">
        <div className="flex items-center space-x-4 mx-2">
          <a href={'/user/' + 'thanhdung0207'}>
            <Avatar imageUrl={'/bocchi.jpg'} altText={'thanhdung0207'} size={10} />
          </a>
          <div>
            <div className="flex font-bold text-[#dddede]">
              <div className={cx('info-wrapper')}>
                <a className={`${cx('user-name')}`}>thanhdung0207</a>
                <p className={cx('watch-status')}>is watching</p>
                <div className={cx('anime-name')}>Yuru yuri shouhaiken</div>
              </div>
              <div>...</div>
            </div>
            <p className="text-gray-500 text-sm">{'Just Now'}</p>
          </div>
        </div>

        <p className="text-lg mt-4 mb-2 text-[#dddede] mx-2">This is a a post</p>
        <div className="mt-4 mx-2">
          <img src="/Konosuba.jpg" alt={''} className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default Page;
