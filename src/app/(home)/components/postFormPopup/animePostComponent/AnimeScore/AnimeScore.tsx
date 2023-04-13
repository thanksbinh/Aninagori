import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames/bind"
import { forwardRef, useState, useImperativeHandle } from "react"
import styles from "./AnimeScore.module.scss"
const cx = classNames.bind(styles)

function AnimeScore(props: any, ref: any) {
  const [score, setScore] = useState("0")

  useImperativeHandle(ref, () => ({
    getAnimeScore: () => {
      return score
    },
    setAnimeScore: (score: any) => {
      setScore(score)
    }
  }))

  return (
    <div style={props.style} className={cx("status-component")} ref={ref}>
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
