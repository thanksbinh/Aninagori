import { faCircleXmark, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind"
import styles from "../postForm/PostForm.module.scss"
import { memo } from "react";
import { deleteMediaFiles } from "@/app/post/[...post_id]/components/option/postOptions";

const cx = classNames.bind(styles)

interface PostFormMediaDisplayProps {
    mediaUrl: any,
    mediaType: any,
    handleDeleteMedia: any,
    handleMediaChange: any,
    setMediaUrl: any,
    isEditPost: any,
    haveUploadedImage: any,
    setHaveUploadedImage: any,
}

const PostFormMediaDisplay: React.FC<PostFormMediaDisplayProps> = ({
    mediaUrl,
    mediaType,
    handleDeleteMedia,
    handleMediaChange,
    setMediaUrl,
    isEditPost,
    haveUploadedImage,
    setHaveUploadedImage,
}) => {

    if (mediaUrl.length === 0) return (<></>)
    return (
        <div className="mt-2 mb-3 w-full flex items-center justify-center">
            <input
                type="file"
                id="multi-media-input"
                accept="video/*,image/*"
                onChange={(e) => {
                    handleMediaChange(e, "image")
                    setHaveUploadedImage((prev: any) => [...prev, false])
                }}
                className="hidden"
            />
            {mediaUrl.length > 0 ? (
                mediaType === "video" ? (
                    <div className={cx("media-wrapper") + " w-2/3 h-full flex items-center relative"}>
                        <video src={haveUploadedImage[0] ? mediaUrl[0] : URL.createObjectURL(mediaUrl[0])} className="w-full object-contain rounded-xl" controls />
                        <FontAwesomeIcon
                            onClick={async () => {
                                //TODO: handle delete media in firebase if post is edit
                                if (isEditPost && haveUploadedImage[0]) {
                                    if (confirm('Are you sure you want to delete this video?')) {
                                        setMediaUrl([])
                                        await deleteMediaFiles(undefined, mediaUrl[0])
                                    }
                                } else {
                                    handleDeleteMedia(0)
                                }
                                setHaveUploadedImage([])
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
                                    style={{ backgroundImage: `url(${haveUploadedImage[index] ? media : URL.createObjectURL(media)})` }}
                                >
                                    <FontAwesomeIcon
                                        onClick={async () => {
                                            if (isEditPost && haveUploadedImage[index]) {
                                                if (confirm('Are you sure you want to delete this image?')) {
                                                    setMediaUrl((prev: any) => prev.filter((item: any, i: number) => i !== index))
                                                    await deleteMediaFiles(media)
                                                }
                                            } else {
                                                handleDeleteMedia(index)
                                            }
                                            setHaveUploadedImage((prev: any) => prev.filter((item: any, i: number) => i !== index))
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