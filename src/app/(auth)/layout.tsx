import "../globals.css"

import loginWallpaper from "public/ibasho.jpg"
import Image from "next/image";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-0 h-14 header-fixed bg-ani-black">
      <Image src={loginWallpaper} alt={"loginWallpaper"} priority className="fixed top-0 left-0 -z-10 h-screen w-screen object-cover object-left-top" />

      <div className="z-40">
        {children}
      </div>
    </div>
  )
}
