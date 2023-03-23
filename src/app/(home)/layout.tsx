import "../globals.css"
import LeftSidebar from "./sidebarComponent/LeftSidebar"
import RightSidebar from "./sidebarComponent/RightSidebar"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex pt-4">
      <LeftSidebar />

      <div className="w-full">{children}</div>

      <RightSidebar />
    </div>
  )
}
