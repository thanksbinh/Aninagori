import classNames from 'classnames/bind';
import { forwardRef, useState, useImperativeHandle } from 'react';
import styles from './AnimeWatchStatus.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const cx = classNames.bind(styles);

function AnimeWatchStatus(props: any, ref: any) {
  const [status, setStatus] = useState('Watching');
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    getAnimeStatus: () => {
      return status;
    },
  }));

  function setChoice(choice: string) {
    setStatus(choice);
    setBoxOpen(false);
  }

  function openInputBox() {
    setBoxOpen(!boxOpen);
    setIsInputFocus(true);
  }

  return (
    <HeadlessTippy
      visible={boxOpen && isInputFocus}
      appendTo={() => document.body}
      onClickOutside={() => {
        setIsInputFocus(false);
      }}
      interactive={true}
      placement="bottom-start"
      render={() => {
        return (
          <div className={cx('option-wrapper')}>
            <div
              onClick={() => {
                setChoice('Watching');
              }}
              className={cx('option')}
            >
              Watching
            </div>
            <div
              onClick={() => {
                setChoice('Finshed');
              }}
              className={cx('option')}
            >
              Finished
            </div>
            <div
              onClick={() => {
                setChoice('Plan to watch');
              }}
              className={cx('option')}
            >
              Plan to watch
            </div>
            <div
              onClick={() => {
                setChoice('Drop');
              }}
              className={cx('option')}
            >
              Drop
            </div>
          </div>
        );
      }}
    >
      <div
        className={cx('status-component')}
        onClick={() => {
          openInputBox();
        }}
        ref={ref}
      >
        <p
          onClick={() => {
            openInputBox();
          }}
          className={cx('anime-watch-status')}
        >
          {status}
        </p>
        <FontAwesomeIcon
          onClick={() => {
            openInputBox();
          }}
          className={cx('down-icon')}
          icon={faCaretDown as any}
        ></FontAwesomeIcon>
      </div>
    </HeadlessTippy>
  );
}

export default forwardRef(AnimeWatchStatus);
