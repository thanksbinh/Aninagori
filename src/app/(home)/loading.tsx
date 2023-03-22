import PostForm from "../post/[...post_id]/components/post/PostForm";

export default function loading() {
  return (
    <div className='flex justify-center pt-10'>
      <div className="flex flex-col lg:w-2/5 w-3/5">
        <PostForm avatarUrl={""} username={""} isBanned={false} />
      </div>
    </div>
  )
}
