import '../globals.css';
import RightSidebar from '@/components/sidebar/RightSidebar';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex'>
            <div className="w-full">
                {children}
            </div>

            <RightSidebar />
        </div>
    )
}
