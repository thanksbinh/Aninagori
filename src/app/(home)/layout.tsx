import '../globals.css';
import RightSidebar from '@/components/sidebar/RightSidebar';
import LeftSidebar from '@/components/sidebar/LeftSidebar';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex'>
            <LeftSidebar />
            
            <div className="w-full">
                {children}
            </div>

            <RightSidebar />
        </div>
    )
}
