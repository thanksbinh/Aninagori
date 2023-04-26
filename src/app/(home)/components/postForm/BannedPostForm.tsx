import Avatar from "@/components/avatar/Avatar";
import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill";
import { HiPhotograph } from "@react-icons/all-files/hi/HiPhotograph";

export function BannedPostForm({ avatarUrl }: { avatarUrl: string }) {
  return (
    <div className="flex flex-col item flex-1 bg-ani-gray rounded-2xl px-4 my-4">
      <div className="flex justify-between items-center mt-4">
        <Avatar imageUrl={avatarUrl} altText={""} size={8} />
        <input
          type="text"
          disabled
          className="flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-ani-black caret-white"
        />
      </div>

      <div className="flex w-full mt-4">
        <img src="/banned.gif" className="w-2/3 object-contain" />
        <div>you&apos;ve been banned</div>
      </div>

      <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
        <label
          htmlFor="image-input"
          className="flex flex-1 items-center justify-center space-x-1 text-[#fff] py-2 px-4 rounded-lg mt-1 mx-1"
        >
          <HiPhotograph className="w-5 h-5" />
          <span>Photo/Gif</span>
        </label>

        <label
          htmlFor="video-input"
          className="flex flex-1 items-center justify-center space-x-1 text-[#fff] py-2 px-4 rounded-lg mt-1 mx-1"
        >
          <BsCameraVideoFill className="w-5 h-5" />
          <span>Video</span>
        </label>

        <button
          type="submit"
          disabled
          className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#798597] py-2 px-4 rounded-lg mt-1 mx-1"
        >
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}