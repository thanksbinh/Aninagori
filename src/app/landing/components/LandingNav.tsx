import Logo from "@/components/nav/Logo";
import Link from "next/link";

export default function LandingNav() {
    return (
        <div className="text-white px-32 py-4">
            <div className="flex">
                <div className="flex flex-start flex-1">
                    <Logo />
                </div>
                <div className="flex items-end justify-end flex-1 pt-2">
                    <div className="text-white px-4 py-2">
                        <Link href="/login">Sign in</Link>
                    </div>
                    <div className="text-white px-4 py-2 rounded-xl border border-white">
                        <Link href="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}