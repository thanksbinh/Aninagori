import PostAction from "../post/[...post_id]/components/post/PostAction";
import PostContent from "../post/[...post_id]/components/post/PostContent";
import PostForm from "./components/postForm/PostForm";
import AnimeRecommendList from "./leftsidebar/AnimeRecommendList";
import FriendList from "./rightsidebar/FriendList";

export default function loading() {
  return (
    <div className="flex justify-center pt-4">
      <div className="xl:block xl:flex-1 flex-shrink max-w-[320px]">
        <div className="hidden xl:block max-w-[320px] py-16 px-2 h-full fixed left-0 z-20 bg-ani-black">
          {/* @ts-expect-error Server Component */}
          <AnimeRecommendList />
        </div>
      </div>

      <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 w-full">
        <div className="flex flex-col pt-10">
          <PostForm avatarUrl={""} username={""} isBanned={false} />
          <div className="animate-pulse mb-4">
            <PostContent />
            <PostAction />
          </div>
        </div>
      </div>
      <div className="lg:block lg:flex-1 flex-shrink max-w-[320px]">
        <div className="hidden lg:block w-[320px] pt-16 px-2 h-screen fixed right-0 z-20 bg-ani-black">
          {/* @ts-expect-error Server Component */}
          <FriendList />
        </div>
      </div>
    </div>
  )
}
