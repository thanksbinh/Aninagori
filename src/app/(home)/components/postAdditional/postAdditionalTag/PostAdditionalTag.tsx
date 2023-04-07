import classNames from "classnames/bind"
import styles from "../PostAdditional.module.scss"

const cx = classNames.bind(styles)

function PostAdditionalTag({ tagName, color, index, deleteTag }: { tagName: string, color: string, index: number, deleteTag: any }) {
    return (
        <div className={cx("tag-wrapper")} style={{ backgroundColor: color }} >
            <div className={cx("tag-content")}>
                <div className={cx("tag-text")}>{tagName}</div>
            </div>
            <div className={cx("tag-delete")} onClick={() => { deleteTag(index) }}>
                <svg viewBox="0 0 8 8" className={cx("close-thick")}>
                    <polygon points="8 1.01818182 6.98181818 0 4 2.98181818 1.01818182 0 0 1.01818182 2.98181818 4 0 6.98181818 1.01818182 8 4 5.01818182 6.98181818 8 8 6.98181818 5.01818182 4"></polygon>
                </svg>
            </div>
        </div>
    )
}

export default PostAdditionalTag
