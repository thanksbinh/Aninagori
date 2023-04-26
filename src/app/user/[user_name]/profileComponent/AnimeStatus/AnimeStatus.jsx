import StatusWrapper from "../StatusWrapper/StatusWrapper"
import classNames from "classnames/bind"
import styles from "./AnimeStatus.module.scss"
import { convertToPercent } from "../AnimeUpdate/AnimeUpdate"
const cx = classNames.bind(styles)

function AnimeStatus({ statusData }) {
  return (
    <StatusWrapper title="Anime Stats">
      <div className={cx("stats-number")}>
        <p>
          Days: <span className={cx("highlight")}>{statusData.num_days_watched}</span>
        </p>
        <p>
          Mean Score: <span className={cx("highlight")}>{statusData.mean_score}</span>
        </p>
      </div>
      <div className={cx("progress-bar")}>
        <ProgressChild
          percent={convertToPercent(statusData.num_items_watching, statusData.num_items)}
          color="#1CE318"
        />
        <ProgressChild
          percent={convertToPercent(statusData.num_items_completed, statusData.num_items)}
          color="#1C4CF2"
        />
        <ProgressChild percent={convertToPercent(statusData.num_items_on_hold, statusData.num_items)} color="#DBDE22" />
        <ProgressChild percent={convertToPercent(statusData.num_items_dropped, statusData.num_items)} color="#E93030" />
      </div>
      <div className={cx("status-note")}>
        <div className="w-[43%] lg-between:w-[47%]">
          <StatusNoteChild
            color="#1CE318"
            title="Watching"
            number={statusData.num_items_watching}
            className={cx("note-child")}
          />
          <StatusNoteChild
            color="#377dff"
            title="Completed"
            number={statusData.num_items_completed}
            className={cx("note-child")}
          />
          <StatusNoteChild
            color="#DBDE22"
            title="On-hold"
            number={statusData.num_items_on_hold}
            className={cx("note-child")}
          />
          <StatusNoteChild
            color="#E93030"
            title="Drop"
            number={statusData.num_items_dropped}
            className={cx("note-child")}
          />
          <StatusNoteChild
            color="#757B85"
            title="Plan to Watch"
            number={statusData.num_items_plan_to_watch}
            className={cx("note-child")}
          />
        </div>
        <div className="w-[43%] lg-between:w-[47%]">
          <div className={cx("watch-wrapper") + " lg-between:my-5"}>
            <span className={cx("watch-title")}>Total Entries</span>
            <span className={cx("watch-number")}>{statusData.num_items}</span>
          </div>
          <div className={cx("watch-wrapper") + " lg-between:my-5"}>
            <span className={cx("watch-title")}>Rewatched</span>
            <span className={cx("watch-number")}>{statusData.num_times_rewatched}</span>
          </div>
          <div className={cx("watch-wrapper") + " lg-between:my-5"}>
            <span className={cx("watch-title")}>Episodes</span>
            <span className={cx("watch-number")}>{statusData.num_episodes}</span>
          </div>
        </div>
      </div>
    </StatusWrapper>
  )
}

function StatusNoteChild({ color, title, number }) {
  return (
    <div className={cx("status-wrapper") + " lg-between:my-5"}>
      <div className={cx("status-round")} style={{ backgroundColor: `${color}` }}></div>
      <div className={cx("status-text-wrapper")}>
        <p className={cx("status")}>{title}</p>
        <p className={cx("status-number")}>{number}</p>
      </div>
    </div>
  )
}

export function ProgressChild({ percent, color = "#1ce318", className }) {
  return <div style={{ width: `${percent}%`, backgroundColor: `${color}`, height: "100%" }} className={className}></div>
}

export default AnimeStatus
