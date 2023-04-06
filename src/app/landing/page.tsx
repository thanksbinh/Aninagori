import LandingHeader from "./components/LandingHeader";
import LandingNav from "./components/LandingNav";

export default function LandingPage() {
    return (
        <div className="flex justify-center h-screen w-full z-40">
            <div className="w-full h-fit bg-[#0d1116]">
                <LandingNav />
                <LandingHeader />
                <p className="text-black">Landing page</p>
            </div>
        </div>
    )
}