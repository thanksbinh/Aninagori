'use client'
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Props {
    userimage: string;
    username: string;
}

const ProfilePicture: React.FC<Props> = ({ userimage, username }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            setIsOpen(false);
            await signOut();
        } catch (error) {
            console.error(error);
        }
    };

    if (!session) return null;

    return (
        <div ref={ref}>
            <img
                src={userimage ?? '/images/default-profile-pic.png'}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = '/images/default-profile-pic.png';
                }}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen ?
                <div className="absolute top-14 right-1 z-50 w-56 py-2 mt-1 bg-white rounded-md shadow-lg">
                    <div className="px-4 py-2 text-gray-800">{username}</div>
                    <div className="border-t border-gray-100"></div>
                    <Link
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                    >
                        View Profile
                    </Link>
                    <button
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div> : null
            }

        </div>
    );
};

export default ProfilePicture;