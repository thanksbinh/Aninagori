
import loginWallpaper from "public/ibasho.jpg"
import Image from "next/image";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed top-0 h-14 header-fixed">
            <div className="z-40">
                {children}
            </div>
        </div>
    )
}