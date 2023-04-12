import { faCircleXmark, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind"
import styles from "../postForm/PostForm.module.scss"
import { memo } from "react";

const cx = classNames.bind(styles)

interface PostFormMediaDisplayProps {
    mediaUrl: any;
    mediaType: string;
    handleDeleteMedia: any;
    handleMediaChange: any;
    isEditPost?: any
}

const PostFormMediaDisplay: React.FC<PostFormMediaDisplayProps> = ({
    mediaUrl,
    mediaType,
    handleDeleteMedia,
    handleMediaChange,
    isEditPost
}) => {
    if (mediaUrl.length === 0) return (<></>)
    return (
        <div className="mt-2 mb-3 w-full flex items-center justify-center">
            <input
                type="file"
                id="multi-media-input"
                accept="video/*,image/*"
                onChange={(e) => handleMediaChange(e, "image")}
                className="hidden"
            />
            {mediaUrl.length > 0 ? (
                mediaType === "video" ? (
                    <div className={cx("media-wrapper") + " w-2/3 h-2/5 flex items-center relative"}>
                        <video src={isEditPost ? mediaUrl[0] : URL.createObjectURL(mediaUrl[0])} className="w-full object-contain rounded-xl" controls />
                        <FontAwesomeIcon
                            onClick={() => {
                                //TODO: handle delete media in firebase if post is edit
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
                                    style={{ backgroundImage: `url(${isEditPost ? media : URL.createObjectURL(media)})` }}
                                >
                                    <FontAwesomeIcon
                                        onClick={() => {
                                            //TODO: handle delete media in firebase if post is edit
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
                </>
            )}
        </div>);
}

export default memo(PostFormMediaDisplay);