import '../globals.css';
import RightSidebar from '@/components/sideBarRight/RightSidebar';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex pt-4'>
            <div className="w-full">
                {children}
            </div>

            <RightSidebar />
        </div>
    )
}
