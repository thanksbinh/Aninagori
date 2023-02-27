import { useSession } from 'next-auth/react';
import { useState } from 'react';

import ProfilePopup from './ProfilePopup';

const ProfilePicture = () => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    if (!session) return null;

    return (
        <>
            <img
                src={session.user?.image ?? '/images/default-profile-pic.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            />
            <ProfilePopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default ProfilePicture;