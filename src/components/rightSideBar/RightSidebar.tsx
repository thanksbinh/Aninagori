import FriendList from "./FriendList"

export default function RightSidebar() {
  return (
    <div className="hidden lg:block min-w-[280px] pt-20 px-2 border-l-2 h-screen fixed right-0 z-40 bg-white">
      <FriendList />
    </div>
  )
}
