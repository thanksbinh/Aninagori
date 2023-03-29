// import ContextProvider from "../post/[...post_id]/components/context/PostContext";
import PostAction from "../post/[...post_id]/components/post/PostAction";
import PostContent from "../post/[...post_id]/components/postContent/PostContent";
import PostForm from "./components/PostForm";

export default function loading() {
  return (
    <div className='flex justify-center pt-10'>
      <div className="flex flex-col lg:w-2/5 w-3/5">
        <PostForm avatarUrl={""} username={""} isBanned={false} />
        {/* <ContextProvider
          myUserInfo={{ username: "", id: "", image: "" }}
          content={"Loading..."}
          authorName={""}
          postId={""}
        >
          <PostContent content={"Loading..."} />
          <PostAction />
        </ContextProvider> */}
        <div className="animate-pulse mb-4">
          <PostContent />
          <PostAction />
        </div>
      </div>
    </div>
  )
}
