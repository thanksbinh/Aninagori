"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

const Logo = () => {
  const router = useRouter()

  const handleOnClick = () => {
    router.refresh()
    if (window.location.href == window.location.origin + "/") window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  return (
    <Link href="/" onClick={handleOnClick} className="text-lg font-semibold">
      <img src="logo.png" alt="logo" className="h-10" />
    </Link>
  )
}

export default Logo
