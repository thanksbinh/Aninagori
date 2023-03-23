import FriendList from "./FriendList"

export default function RightSidebar() {
  return (
    <div className="hidden lg:block min-w-[280px] pt-16 px-2 h-screen fixed right-0 z-20 bg-ani-gray">
      {/* @ts-expect-error Server Component */}
      <FriendList />
    </div>
  )
}
