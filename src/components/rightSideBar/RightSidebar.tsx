import FriendList from "./FriendList"

const fakeFriends = [{
  username: 'binh_2',
  avatarUrl: "https://lh3.googleusercontent.com/a/AGNmyxaYDb8JMwlI7x_gSlRFgQOQGlqfBIURpCCI6CFX=s96-c",
}, {
  username: 'binh_test',
  avatarUrl: "",
}]

export default function RightSidebar() {
  return (
    <div className="hidden lg:block min-w-[280px] px-2 border-l-2 h-screen">
      <FriendList friends={fakeFriends} />
    </div>
  )
}
