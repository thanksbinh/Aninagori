import '../globals.css';
// import Sidebar from '@/components/Sidebar/Sidebar';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex'>
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}
