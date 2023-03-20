import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './AnimeTag.module.scss';
const cx = classNames.bind(styles);

function AnimeTag(props: any, ref: any) {
  const { tagArr } = props;
  const [selectedTag, setSelectedTag] = useState(() => {
    return tagArr.map((data: any) => {
      return { selected: false, text: data };
    });
  });

  useImperativeHandle(ref, () => ({
    getAnimeTag: () => {
      return selectedTag?.reduce((a: any, b: any) => {
        if (b.selected) {
          return [...a, b.text];
        } else {
          return a;
        }
      }, []);
    },
  }));
  return (
    <div className={cx('tag-wrapper')} ref={ref}>
      {selectedTag?.map((data: any, index: number) => {
        return (
          <div
            onClick={() => {
              const newArr = selectedTag.map((data: any, index2: any) => {
                if (index === index2) {
                  return { selected: !data.selected, text: data.text };
                }
                return data;
              });
              setSelectedTag(newArr);
            }}
            key={index}
            className={cx('tag', { select: data.selected })}
          >
            {data.selected ? (
              <FontAwesomeIcon className={cx('tag-icon')} icon={faCheck as any} />
            ) : (
              <FontAwesomeIcon className={cx('tag-icon')} icon={faPlus as any} />
            )}
            <p className={cx('tag-name')}>{data.text}</p>
          </div>
        );
      })}
    </div>
  );
}

export default forwardRef(AnimeTag);
