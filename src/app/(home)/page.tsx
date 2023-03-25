import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getUserInfo } from "@/global/getUserInfo";
import PostForm from './components/PostForm';
import Posts from './components/PostContainer';

export default async function Home() {
  const session = await getServerSession(authOptions)
  const myUserId = (session as any)?.user?.id
  const myUserInfo = await getUserInfo(myUserId)

  if (!myUserInfo) return null

  return (
    <div className="flex justify-center pt-10">
      <div className="flex flex-col lg:w-2/5 w-3/5">
        <PostForm
          className="mt-4"
          avatarUrl={myUserInfo.image}
          username={myUserInfo.username}
          isBanned={!!myUserInfo.is_banned}
        />

        <Posts myUserInfo={myUserInfo} />
      </div>
    </div>
  )
}
