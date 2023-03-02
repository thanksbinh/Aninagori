'use client'
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import ProfilePopup from './ProfilePopup';

interface Props {
    userimage: string;
    username: string;
}

const ProfilePicture: React.FC<Props> = ({ userimage, username }) => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    if (!session) return null;

    return (
        <>
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
            <ProfilePopup isOpen={isOpen} onClose={() => setIsOpen(false)} username={username} />
        </>
    );
};

export default ProfilePicture;