import PostAction from "../post/[...post_id]/components/post/PostAction";
import PostContent from "../post/[...post_id]/components/post/PostContent";
import PostForm from "./components/PostForm";

export default function loading() {
  return (
    <div className="flex flex-col pt-10">
      <PostForm avatarUrl={""} username={""} isBanned={false} />
      <div className="animate-pulse mb-4">
        <PostContent />
        <PostAction />
      </div>
    </div>
  )
}
