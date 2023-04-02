/* eslint-disable @next/next/no-img-element */
"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import logo from "public/logo.png"

const Logo = () => {
  const router = useRouter()

  const handleOnClick = () => {
    router.refresh()
    console.log(window.location.href)
    if (window.location.href == process.env.NEXT_PUBLIC_BASE_URL)
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  return (
    <Link href="/" onClick={handleOnClick} className="text-lg font-semibold">
      <Image src={logo} alt="logo" width={135} height={65} />
    </Link>
  )
}

export default Logo
