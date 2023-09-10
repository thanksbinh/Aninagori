import PostActions from "../post/[...post_id]/components/actions/PostActions";
import PostContent from "../post/[...post_id]/components/post/PostContent";
import PostForm from "./components/postForm/PostForm";
import AnimeRecommendList from "./components/leftsidebar/AnimeRecommendList";
import FriendList from "./components/rightsidebar/FriendList";

export default function loading() {
  return (
    <div className="flex justify-center pt-4">
      <div className="xl:block xl:flex-1 flex-shrink max-w-[320px]">
        <div className="hidden xl:block max-w-[320px] py-16 px-2 h-full fixed left-0 z-20 bg-ani-black">
          {/* @ts-expect-error Server Component */}
          <AnimeRecommendList />
        </div>
      </div>

      <div className="xl:w-[55%] lg:w-3/5 md:w-4/5 w-full">
        <div className="h-screen flex flex-col items-center pt-10">
          <div className="w-full sm:w-[72%]">
            <PostForm />
          </div>
          <div className="mb-4 w-full">
            <div className="flex justify-center animate-pulse mb-4">
              <div className="w-full sm:w-[72%] relative">
                <PostContent />
                <PostActions />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:block lg:flex-1 flex-shrink max-w-[320px]">
        <div className="hidden lg:block w-[320px] pt-16 px-2 h-screen fixed right-0 z-20 bg-ani-black">
          <FriendList myFriendList={[]} myUserInfo={undefined} />
        </div>
      </div>
    </div>
  )
}
