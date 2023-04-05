import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill"
import { HiPhotograph } from "@react-icons/all-files/hi/HiPhotograph"

function PostButtonArea({ handleMediaChange, loadPosting }: { handleMediaChange: any; loadPosting: boolean }) {
    return (
        <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
            <label
                htmlFor="image-input"
                className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
            >
                <HiPhotograph className="w-5 h-5 fill-[#3BC361]" />
                <span>Photo/Gif</span>
            </label>
            <input type="file" id="image-input" accept="image/*" onChange={(e) => handleMediaChange(e)} className="hidden" />

            <label
                htmlFor="video-input"
                className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer"
            >
                <BsCameraVideoFill className="w-5 h-5 fill-[#FF1D43]" />
                <span>Video</span>
            </label>
            <input type="file" id="video-input" accept="video/*" onChange={(e) => handleMediaChange(e)} className="hidden" />

            <button
                type="submit"
                className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1"
            >
                {loadPosting && (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                <span>Share</span>
            </button>
        </div>
    )
}

export default PostButtonArea
