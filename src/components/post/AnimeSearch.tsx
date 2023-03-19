/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import styles from './PostForm.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { get } from '@/app/api/apiServices/httpRequest';
import { faCaretDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const cx = classNames.bind(styles);

function AnimeSearch() {
  const [animeName, setAnimeName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animePic, setAnimepic] = useState('');
  const [animeID, setAnimeID] = useState('');

  const debouncedValue = useDebounce(animeName, 500);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }
    setLoading(true);
    const searchAnimeName = async () => {
      try {
        const result = await get('api/anime/search', {
          headers: {
            q: debouncedValue,
            offset: '0',
            limit: '10',
          },
        });
        if (!!result.error) {
          setSearchResult([]);
        } else {
          setSearchResult(result.data);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    if (animeID === '') {
      searchAnimeName();
    } else {
      setLoading(false);
    }
  }, [animeID, debouncedValue]);

  return (
    <HeadlessTippy
      appendTo={() => document.body}
      visible={searchResult.length !== 0}
      placement="bottom-start"
      interactive={true}
      render={() => {
        return (
          <div className={cx('result-wrapper')}>
            {searchResult.map((ele, index) => {
              return (
                <div
                  onClick={() => {
                    setAnimepic((ele as any).node.main_picture.medium);
                    setAnimeName((ele as any).node.title);
                    setAnimeID((ele as any).node.id);
                    setSearchResult([]);
                  }}
                  key={index}
                  className={cx('result-children')}
                >
                  <img alt="anime-name" src={(ele as any).node.main_picture.medium}></img>
                  <div>
                    <p>{(ele as any).node.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    >
      <div className={cx('anime-search-wrapper')}>
        <div>
          <input
            value={animeName}
            placeholder="Search anime name"
            onChange={(e) => {
              const regex = /^\S/;
              if (regex.test(e.target.value)) {
                setAnimeName(e.target.value);
              } else {
                setAnimeName('');
              }
            }}
            onKeyDown={(e) => {
              setAnimeID('');
            }}
          ></input>
        </div>
        {!loading ? (
          <FontAwesomeIcon className={cx('down-icon')} icon={faCaretDown as any}></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner as any}></FontAwesomeIcon>
        )}
        <img
          className={cx('anime-preview')}
          src={
            animePic !== ''
              ? animePic
              : 'https://styles.redditmedia.com/t5_xpfq5/styles/communityIcon_f7njauwbmdfa1.png'
          }
          alt="anime-preview"
        ></img>
      </div>
    </HeadlessTippy>
  );
}

function useDebounce(value: any, delay: any) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return debouncedValue;
}

export default AnimeSearch;
