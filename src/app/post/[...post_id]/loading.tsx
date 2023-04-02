import PostAction from "./components/post/PostAction";
import PostContent from "./components/post/PostContent";

export default function loading() {
  return (
    <div className='flex justify-center pt-10'>
      <div className="flex flex-col lg:w-2/5 w-3/5 mt-8 mb-2">
        <div className="animate-pulse mb-4">
          <PostContent />
          <PostAction />
        </div>
      </div>
    </div>
  )
}
