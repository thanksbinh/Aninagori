import classNames from "classnames/bind"
import { forwardRef, useState, useImperativeHandle } from "react"
import styles from "./AnimeWatchStatus.module.scss"
import HeadlessTippy from "@tippyjs/react/headless"
import "tippy.js/dist/tippy.css"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
const cx = classNames.bind(styles)

function AnimeWatchStatus({ setShowScore }: any, ref: any) {
  const [status, setStatus] = useState("Watching")
  const [isInputFocus, setIsInputFocus] = useState(false)
  const [boxOpen, setBoxOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    getAnimeStatus: () => {
      return status
    },
    resetAnimeStatus: () => {
      setStatus("Watching")
    },
    setAnimeStatus: (data: any) => {
      setStatus(data)
      if (data === "Finished") {
        setShowScore(true)
      }
    }
  }), [{}])

  function setChoice(choice: string) {
    setStatus(choice)
    setBoxOpen(false)
  }

  function openInputBox() {
    setBoxOpen(!boxOpen)
    setIsInputFocus(true)
  }

  return (
    <div ref={ref} className="w-[24%] sm-max:w-[49%]">
      <HeadlessTippy
        visible={boxOpen && isInputFocus}
        appendTo={() => document.body}
        onClickOutside={() => {
          setIsInputFocus(false)
        }}
        interactive={true}
        placement="bottom-start"
        render={() => {
          return (
            <div className={cx("option-wrapper")}>
              <div
                onClick={() => {
                  setChoice("Watching")
                  setShowScore(false)
                }}
                className={cx("option")}
              >
                Watching
              </div>
              <div
                onClick={() => {
                  setChoice("Re-watching")
                  setShowScore(false)
                }}
                className={cx("option")}
              >
                Re-watching
              </div>
              <div
                onClick={() => {
                  setChoice("Finished")
                  setShowScore(true)
                }}
                className={cx("option")}
              >
                Finished
              </div>
              <div
                onClick={() => {
                  setChoice("Plan to watch")
                  setShowScore(false)
                }}
                className={cx("option")}
              >
                Plan to watch
              </div>
              <div
                onClick={() => {
                  setChoice("Drop")
                  setShowScore(false)
                }}
                className={cx("option")}
              >
                Drop
              </div>
            </div>
          )
        }}
      >
        <div
          className={cx("status-component")}
          onClick={() => {
            openInputBox()
          }}
        >
          <p
            onClick={() => {
              openInputBox()
            }}
            className={cx("anime-watch-status")}
          >
            {status}
          </p>
          <FontAwesomeIcon
            onClick={() => {
              openInputBox()
            }}
            className={cx("down-icon")}
            icon={faCaretDown as any}
          ></FontAwesomeIcon>
        </div>
      </HeadlessTippy>
    </div>
  )
}

export default forwardRef(AnimeWatchStatus)
