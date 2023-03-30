import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import "../globals.css"
import AnimeRecommendList from "./leftsidebar/AnimeRecommendList"
import FriendList from "./rightsidebar/FriendList"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex justify-center pt-4">
      <div className="xl:block xl:flex-1 flex-shrink max-w-[320px]">
        <div className="hidden xl:block max-w-[320px] pt-16 px-2 h-screen fixed left-0 z-20 bg-ani-black">
          {/* @ts-expect-error Server Component */}
          <AnimeRecommendList myUserId={(session as any)?.user?.id} />
        </div>
      </div>

      <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 w-full">{children}</div>

      <div className="lg:block lg:flex-1 flex-shrink max-w-[320px]">
        <div className="hidden lg:block w-[320px] pt-16 px-2 h-screen fixed right-0 z-20 bg-ani-black">
          {/* @ts-expect-error Server Component */}
          <FriendList myUserId={(session as any)?.user?.id} />
        </div>
      </div>
    </div>
  )
}
