import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames/bind"
import { useState, forwardRef, useImperativeHandle } from "react"
import styles from "./AnimeEpisodes.module.scss"
const cx = classNames.bind(styles)

function AnimeEpisodes(props: any, ref: any) {
  const [episodes, setEpisodes] = useState("0")
  const [totalEpisodes, setTotalEpisodes] = useState(26)

  useImperativeHandle(ref, () => ({
    getAnimeEpisodes: () => {
      return episodes
    },
    getAnimeTotal: () => {
      return totalEpisodes
    },
    setAnimeTotal: (total: any) => {
      setTotalEpisodes(total)
    },
    setAnimeEpisodes: (eps: any) => {
      setEpisodes(eps)
    },
  }))

  return (
    <div style={props.style} className='w-[24%] px-2 py-1 h-10 bg-[#4e5d78] rounded-2xl flex justify-between sm-max:w-[49%] sm-max:order-1' ref={ref}>
      <div className={cx("wrapper")}>
        <input
          onChange={(e) => {
            const reg = new RegExp("^[0-9]+$")
            if (
              e.target.value === "" ||
              (reg.test(e.target.value) && parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= totalEpisodes)
            ) {
              setEpisodes(e.target.value)
            }
          }}
          type="text"
          value={episodes}
        ></input>
        <div className={cx("space")}>/</div>
        <p className={cx("total-episodes")}>{`${totalEpisodes}`}</p>
      </div>
      <div className={cx("adjust-episodes")}>
        <FontAwesomeIcon
          onClick={() => {
            if (episodes === "") {
              setEpisodes("0")
            } else if (parseInt(episodes) >= totalEpisodes) {
              setEpisodes(totalEpisodes + "")
            } else {
              setEpisodes(parseInt(episodes) + 1 + "")
            }
          }}
          icon={faCaretUp as any}
          className={cx("up-icon")}
        />
        <FontAwesomeIcon
          onClick={() => {
            if (episodes === "") {
              setEpisodes("0")
            } else if (parseInt(episodes) <= 0) {
              setEpisodes("0")
            } else {
              setEpisodes(parseInt(episodes) - 1 + "")
            }
          }}
          icon={faCaretDown as any}
          className={cx("down-icon")}
        />
      </div>
    </div>
  )
}

export default forwardRef(AnimeEpisodes)
