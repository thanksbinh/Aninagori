
import "@/app/globals.css"
import Image from 'next/image'

export default function LandingHeader() {
    return (
        <div className="px-32 py-16 flex">
            <div className="leading-tight tracking-tighter font-extrabold text-5xl gradient-text flex flex-col flex-1">
                <p className="landing-header">Aninagory</p>
                <p className="">Share your favourite animemory with your friends</p>
            </div>
            <div className="flex flex-1 justify-center">
                <Image src="/anime-crossover.png" width={800} height={600} alt="" className="shadow-inner shadow-[#0d1116]" />
            </div>
        </div>
    )
}