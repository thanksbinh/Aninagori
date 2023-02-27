'use client'
import Link from 'next/link';
import ProfilePicture from '@/components/nav/ProfilePicture';

const Navbar = () => {
    return (
        <nav className="py-2 border-b-2">
            <div className="px-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/" className="text-lg font-semibold">
                        Aninagori
                    </Link>
                </div>
                <div className="flex items-center">
                    <ProfilePicture />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;