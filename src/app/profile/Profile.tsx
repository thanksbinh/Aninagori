/* eslint-disable @next/next/no-img-element */
'use client';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { getAnimeList } from '@/app/api/apiServices/getServices';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import MyAnimeList from './UserInformation';
import { get } from '@/app/api/apiServices/httpRequest';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const cx = classNames.bind(styles);

function Profile() {
  const [search, setSearch] = useState('');
  const [image, setImage] = useState(
    'https://steamuserimages-a.akamaihd.net/ugc/884259456715792803/0BC095F5A9445C9A23F8C6E5AFDC915ACFF64DDC/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
  );
  const [userName, setUserName] = useState('(Have not connect to MAL)');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(false);

  const searchAnime = async (q: string, offset: number, limit: number) => {
    const animeData = await getAnimeList(q, offset, limit);
    return animeData;
  };

  const handleConnect = async () => {
    setLoading(true);
    let data = await get(`api/user/${search}`);
    data = data.data;
    console.log(data);
    setUserName(data.username);
    setImage(data.images.jpg['image_url']);
    setSearch('');
    setLoading(false);
    setUserData(data.updates.anime);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center py-10 bg-gray-100">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-5">
          <div className="px-4 py-6">
            <img className="rounded-full w-32 h-32 mx-auto" src={image} alt="Nguyen Thanh dung" />
            <h1 className="mt-4 text-2xl font-bold text-center text-gray-800">{userName}</h1>
            <p className="mt-2 text-gray-600 text-center">Hi im Thanh Dung, currently a university studentXD</p>
            <p className="mt-2 text-gray-600 text-center">
              My Anime List nickname is: <span className="no-underline text-red-500">{userName}</span>
            </p>
          </div>
          <div className="bg-blue-100 px-4 py-3 flex flex-col item-center justify-center relative">
            <input
              type="text"
              placeholder="Enter your MAL nickname"
              className="mb-6 mt-4 border rounded-md px-4 py-2 w-full text-gray-700 focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            {!!loading && <FontAwesomeIcon icon={faSpinner as IconProp} className={cx('spinner')}></FontAwesomeIcon>}
            <button
              onClick={handleConnect}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
      {!!userData && <MyAnimeList animeList={userData} />}
    </>
  );
}

export default Profile;
