import { AnimeTag } from "../animePostComponent";
import PostFormMediaDisplay from "../postMediaComponent/PostFormMediaDisplay";
import classNames from "classnames/bind"
import styles from "../PostForm.module.scss"


const cx = classNames.bind(styles)

function PostBasic(
    { basicPostingInfo, animeTag, inputRef, handlePaste, mediaUrl, mediaType, handleDeleteMedia, handleMediaChange }
        : { basicPostingInfo: boolean, animeTag: any, inputRef: any, handlePaste: any, mediaUrl: any, mediaType: string, handleDeleteMedia: any, handleMediaChange: any }) {
    return (
        <div className={basicPostingInfo ? "flex flex-col" : "hidden"}>
            <input
                type="text"
                ref={inputRef}
                onPaste={handlePaste}
                placeholder="Share your favourite Animemory now!"
                className="flex rounded-3xl py-3 px-4 w-full focus:outline-none bg-[#212833] caret-white"
            />
            <PostFormMediaDisplay mediaUrl={mediaUrl} mediaType={mediaType} handleDeleteMedia={handleDeleteMedia} handleMediaChange={handleMediaChange} />
            <AnimeTag tagArr={["Spoiler", "GoodStory", "BestWaifu", "NSFW"]} ref={animeTag} />
        </div>
    );
}

export default PostBasic;