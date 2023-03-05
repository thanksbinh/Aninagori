import FriendList from "./FriendList"

export default function RightSidebar() {
  return (
    <div className="hidden lg:block min-w-[280px] px-2 border-l-2 h-screen fixed right-0 z-40 bg-white pt-5">
      <FriendList />
    </div>
  )
}
