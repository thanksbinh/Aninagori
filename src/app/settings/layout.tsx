import dynamic from "next/dynamic"
import "../globals.css"
const TabSelector = dynamic(() => import("./components/TabSelector"))

export default async function SettingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="hidden sm:block w-[360px] h-screen py-20 px-2 bg-ani-gray border-r-[1px] border-ani-light-gray">
        <TabSelector />
      </div>

      <div className="flex-1 pt-20 mx-14">
        {children}
      </div>
    </div>
  )
}
