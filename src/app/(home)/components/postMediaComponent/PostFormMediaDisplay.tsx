import { faCircleXmark, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind"
import styles from "../PostForm.module.scss"

const cx = classNames.bind(styles)

function PostFormMediaDisplay({ mediaUrl, mediaType, handleMediaChange, handleDeleteMedia }: { mediaUrl: any, mediaType: string, handleMediaChange: any, handleDeleteMedia: any }) {
    return (<div className="mt-4 w-full flex items-center justify-center">
        <input
            type="file"
            id="multi-media-input"
            accept="video/*,image/*"
            onChange={(e) => handleMediaChange(e)}
            className="hidden"
        />
        {mediaUrl.length > 0 ? (
            mediaType === "video" ? (
                <div className={cx("media-wrapper") + " w-2/3 h-2/5 flex items-center relative"}>
                    <video src={URL.createObjectURL(mediaUrl[0])} className="w-full object-contain rounded-xl" controls />
                    <FontAwesomeIcon
                        onClick={() => {
                            handleDeleteMedia(0)
                        }}
                        icon={faCircleXmark as any}
                        className={cx("delete-icon")}
                    />
                </div>
            ) : (
                <div
                    className={
                        cx("media-wrapper") +
                        " w-full h-64 flex items-center relative overflow-x-auto bg-[#212833] rounded-xl px-4 py-4"
                    }
                >
                    {mediaUrl.map((media: any, index: number) => {
                        return (
                            <div
                                key={index}
                                className={cx("image-wrapper")}
                                style={{ backgroundImage: `url(${URL.createObjectURL(media)})` }}
                            >
                                <FontAwesomeIcon
                                    onClick={() => {
                                        handleDeleteMedia(index)
                                    }}
                                    icon={faCircleXmark as any}
                                    className={cx("delete-icon")}
                                />
                            </div>
                        )
                    })}
                    <label htmlFor="multi-media-input" className={cx("add-media")}>
                        <FontAwesomeIcon
                            icon={faFileCirclePlus as any}
                            className="text-[#3BC361] text-4xl hover:text-green-400"
                        />
                    </label>
                </div>
            )
        ) : (
            <>
                <label
                    className={
                        cx("media-wrapper", { "no-media-wrapper": true }) +
                        " w-full h-64 flex items-center justify-center relative hover:opacity-75 rounded-xl border-2 border-[#3BC361] cursor-pointer"
                    }
                    htmlFor="multi-media-input"
                >
                    <FontAwesomeIcon
                        icon={faFileCirclePlus as any}
                        className="text-[#3BC361] text-4xl hover:text-green-400"
                    />
                </label>
            </>
        )}
    </div>);
}

export default PostFormMediaDisplay;