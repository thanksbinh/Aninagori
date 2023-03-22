import { PostContent } from "@/components";
import ContextProvider from "@/components/post/context/PostContext";
import PostAction from "@/components/post/PostAction";

export default function loading() {
  return (
    <div className='flex justify-center pt-10'>
      <div className="flex flex-col lg:w-2/5 w-3/5 mt-8 mb-2">
        <ContextProvider
          myUserInfo={{ username: "", id: "", image: "" }}
          content={"Loading..."}
          authorName={""}
          postId={""}
        >
          <PostContent content={"Loading..."} />
          <PostAction />
        </ContextProvider>
      </div>
    </div>
  )
}
