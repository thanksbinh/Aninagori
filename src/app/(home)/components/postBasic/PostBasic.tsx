import { AnimeTag } from "../animePostComponent";
import PostFormMediaDisplay from "../postMediaComponent/PostFormMediaDisplay";

function PostBasic(
    { setBasicPosting, basicPosting, animeTag, inputRef, handlePaste, mediaUrl, mediaType, handleDeleteMedia, handleMediaChange }
        : { setBasicPosting: any, basicPosting: any, animeTag: any, inputRef: any, handlePaste: any, mediaUrl: any, mediaType: string, handleDeleteMedia: any, handleMediaChange: any }) {
    return (
        <div className="flex flex-col">
            <input
                type="text"
                ref={inputRef}
                onPaste={handlePaste}
                placeholder="Share your favourite Animemory now!"
                className="flex rounded-3xl mt-4 mb-5 py-3 px-4 w-full focus:outline-none bg-[#212833] caret-white"
            />
            <PostFormMediaDisplay mediaUrl={mediaUrl} mediaType={mediaType} handleDeleteMedia={handleDeleteMedia} />
            <AnimeTag tagArr={["Spoiler", "GoodStory", "BestWaifu", "NSFW"]} ref={animeTag} />
            <p
                className="whitespace-nowrap ml-2 my-3 text-ani-text-main cursor-pointer font-bold underline text-sm opacity-80 hover:opacity-100"
                onClick={() => { setBasicPosting(!basicPosting) }}>
                {basicPosting ? "More details..." : "Fewer details..."}
            </p>
        </div>
    );
}

export default PostBasic;