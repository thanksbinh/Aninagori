import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames/bind"
import { forwardRef, useState, useImperativeHandle } from "react"
import styles from "./AnimeScore.module.scss"
const cx = classNames.bind(styles)

function AnimeScore(props: any, ref: any) {
  const [score, setScore] = useState("1")

  useImperativeHandle(ref, () => ({
    getAnimeScore: () => {
      return score
    },
    setAnimeScore: (score: any) => {
      setScore(score)
    }
  }))

  return (
    <div style={props.style} className='w-[24%] px-2 py-1 h-10 bg-[#4e5d78] rounded-[18px] flex justify-between items-center sm-max:order-1 sm-max:w-[49%]' ref={ref}>
      <div className={cx("title")}>Score:</div>
      <input
        type="text"
        onChange={(e) => {
          const regex = /^([1-9]|10)$/
          if (regex.test(e.target.value) || e.target.value === "") {
            setScore(e.target.value)
          }
        }}
        className={cx("input")}
        placeholder="score"
        value={score}
      ></input>
      <div className={cx("icon-wrapper")}>
        <FontAwesomeIcon
          onClick={() => {
            if (score === undefined) {
              setScore("2")
              return
            }

            if (parseInt(score) >= 10) {
              setScore("10")
            } else if (score === "") {
              setScore("1")
            } else {
              setScore(parseInt(score) + 1 + "")
            }
          }}
          icon={faCaretUp as any}
          className={cx("up-icon")}
        />
        <FontAwesomeIcon
          onClick={() => {
            if (score === undefined) {
              setScore("1")
              return
            }
            if (parseInt(score) <= 1) {
              setScore("1")
            } else if (score === "") {
              setScore("1")
            } else {
              setScore(parseInt(score) - 1 + "")
            }
          }}
          icon={faCaretDown as any}
          className={cx("down-icon")}
        />
      </div>
    </div>
  )
}

export default forwardRef(AnimeScore)
