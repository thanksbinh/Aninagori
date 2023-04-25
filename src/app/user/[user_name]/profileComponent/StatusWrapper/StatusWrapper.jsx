import classNames from "classnames/bind"
import styles from "./StatusWrapper.module.scss"

const cx = classNames.bind(styles)

function StatusWrapper({ children, title }) {
  return (
    <div className={cx("wrapper") + " lg-between:flex-1 lg-between:max-w-[48%]"}>
      <h4 className={cx("title")}>{title}</h4>
      {children}
    </div>
  )
}

export default StatusWrapper
