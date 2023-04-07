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

    if (window.location.href == window.location.origin + "/")
      window.scrollTo({ top: -100, left: 0, behavior: "smooth" })
  }

  return (
    <Link href="/" onClick={handleOnClick} className="text-lg font-semibold">
      <Image src={logo} alt="logo" width={135} height={65} priority />
    </Link>
  )
}

export default Logo
