'use client'

import { useFirebaseSession } from '@/app/SessionProvider';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { UserInfo } from "../../global/UserInfo.types";
import UsernamePopup from '../utils/UsernamePopup';

interface Props {
    myUserInfo: UserInfo | undefined
}

const ProfilePicture: React.FC<Props> = ({ myUserInfo }) => {
    const session = useFirebaseSession();
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [openUsernamePopup, setOpenUsernamePopup] = useState(false)

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

    useEffect(() => {
        if (myUserInfo?.username === "guess")
            setOpenUsernamePopup(true)
    }, [myUserInfo])

    const handleLogout = async () => {
        try {
            setIsOpen(false);
            await signOut();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div ref={ref}>
            <img
                src={myUserInfo?.image ?? '/bocchi.jpg'}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = '/bocchi.jpg';
                }}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer object-cover"
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen &&
                <div className="absolute top-14 right-8 z-40 w-56 py-2 bg-ani-gray rounded-md shadow-lg">
                    {myUserInfo?.username === "guess" ?
                        <button onClick={() => setOpenUsernamePopup(true)} className="px-4 py-2 text-ani-text-main hover:bg-slate-50/25 w-full text-left">Set username</button> :
                        <div className="px-4 py-2 text-ani-text-main">{myUserInfo?.username}</div>
                    }
                    <div className="border-t border-gray-700"></div>
                    <Link
                        className="block px-4 py-2 text-ani-text-main hover:bg-slate-50/25 w-full text-left rounded-md"
                        href={`/user/${myUserInfo?.username}`}
                        onClick={() => setIsOpen(false)}
                    >
                        View Profile
                    </Link>
                    <button
                        className="block px-4 py-2 text-ani-text-main hover:bg-slate-50/25 w-full text-left rounded-md"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            }
            {openUsernamePopup &&
                <UsernamePopup
                    isOpen={openUsernamePopup}
                    onClose={() => setOpenUsernamePopup(false)}
                    session={session}
                />
            }
        </div>
    );
};

export default ProfilePicture;