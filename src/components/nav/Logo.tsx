/* eslint-disable @next/next/no-img-element */
"use client"

import Image from "next/image"
import Link from "next/link"
// import { useRouter } from "next/navigation"
import logo from "public/logo.png"

const Logo = () => {
  // const router = useRouter()

  const handleOnClick = () => {
    // router.refresh()

    if (window.location.href == window.location.origin + "/")
      window.scrollTo({ top: 0 })
  }

  return (
    <Link href="/" onClick={handleOnClick} id="logo" className="text-lg font-semibold">
      <Image src={logo} alt="logo" height={36} priority className="w-auto" />
    </Link>
  )
}

export default Logo
